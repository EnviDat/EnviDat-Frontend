// src/modules/s3/store/s3Store.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { _Object, ListObjectsV2Output } from '@aws-sdk/client-s3/dist-types/models/models_0';
import { S3Node } from '@/types/s3Types';
import { CommonPrefix } from '@aws-sdk/client-s3/dist-types/models';

// const TEST_URL =
//   https://os.zhdk.cloud.switch.ch/envicloud/?prefix=wsl/CORE_S2A/&max-keys=100000&delimiter=/



export const useS3Store = defineStore('s3Store', {
  state: () => ({
    loading: false,
    contentFromS3: [],
    error: null,
    treeData: [],
    s3Url: null,
    s3BucketUrl: null,
/*
    treeViewIsOpened: false,
*/
    isS3Resources: false,
  }),
  getters: {},
  actions: {
    async fetchS3Content(url: string, isChild: boolean, nodeId: number, rootNodes?: S3Node[], params = {}) {

      try {
        const response = await axios.get(url, {
          params,
          // forceNoCredentials: true,
          withCredentials: false,
        });

        const json = this.parseXmlToJson(response.data);
        const { ListBucketResult } : { ListBucketResult: ListObjectsV2Output } = json;

        if (isChild) {
          return this.mapChildData(ListBucketResult, nodeId, rootNodes);
        }

        return this.mapData(ListBucketResult);
      } catch (error) {
        this.error = error;
        throw error;
      }
    },

    parseXmlToJson(xmlData: string) {
      const parser = new XMLParser({
        ignoreAttributes: false,
      });

      try {
        return parser.parse(xmlData);
      } catch (error) {
        throw new Error('Failed to parse XML data');
      }
    },

    mapData(listObject: ListObjectsV2Output) : S3Node[] {
      const rootId = 1;

      const childFolders = listObject.CommonPrefixes?.map<S3Node>(
        (prefix, index) =>
          this.createFolderEntry(prefix, index, rootId),
      );

      // listObject.Contents this can be a single Object not an array
      // maybe due to the conversion from XML?
      const contents = listObject.Contents;
      let childEntires: S3Node[];

      const hasContentList =  contents && (contents instanceof Array);

      if (hasContentList) {
        childEntires = contents.map<S3Node>(
          (content, index) =>
            this.createFileEntry(content, index, rootId),
        )
      }

      return [
        {
          id: rootId,
          isFile: this.isItemFile(listObject.Prefix),
          title: this.parseString(listObject.Prefix),
          isChild: false,
          childrenLoaded: false,
          children: childFolders || childEntires,
        },
      ]
    },

    mapChildData(listObject: ListObjectsV2Output, nodeId: number, rootNodes: S3Node[]) : S3Node[] | undefined {
      if (!listObject || !listObject.Contents) {
        return undefined;
      }

      const lastId = rootNodes.length;

      // Remove first element because is a repetition of the container
      const contents = Array.isArray(listObject.Contents)
        ? listObject.Contents.slice(1)
        : listObject.Contents;

      // map the content
      const children = Array.isArray(contents)
        ? contents.map<S3Node>((prefix, index) => this.createFileEntry(prefix, index, lastId))
        : [
            {
              id: lastId + 1,
              isChild: true,
              title: 'Go to S3',
              // lastItem is needed for manage the last level of deep allowed
              isLastItem: true,
              link: this.s3BucketUrl,
              childrenLoaded: false,
              children: undefined,
            },
          ];

      // Trigger function to add data in the right node
      this.findAndAddChildren(
        rootNodes,
        children,
        nodeId,
      );

      return rootNodes;
    },

    findAndAddChildren(nodes: S3Node[], children: S3Node[], nodeId: number) {

      for (const node of nodes) {
        if (node.id === nodeId) {
          if (node.children && node.children.length > 0) {
            // The array check is necessary because if the node contains multiple items,
            // Skip if already populated
            return true;
          }

          // Add the children and remove unnecessary `children: []` if it's beyond the first level
          node.children = children.map((child) => {
            if (child.isFile || child.isLastItem) {
              delete child.children;
            }

            return child;
          });

          return true;
        }

        // Recursive function to check all levels of the tree
        if (node.children && node.children.length > 0) {
          const found = this.findAndAddChildren(
            node.children,
            children,
            nodeId,
          );

          // Skip further checks if the node is found
          if (found) return true;
        }
      }

      return false;
    },

    // set the URL for download
    getS3Link(url) {
      const cleanedBaseUrl = this.s3Url.replace(/\/$/, '');
      const cleanedUrl = url.replace(/^\//, '');

      return `${cleanedBaseUrl}/${cleanedUrl}`;
    },
    // Clean the string for the fileName to reduce the length of the word
    parseStringChild(str) {
      const childStr = this.parseString(str);
      const splitted = childStr.split('_');
      if (splitted.length >= 2) {
        return `${splitted[0]}_${splitted[splitted.length - 1]}`;
      }
      return childStr;
    },
    // clean the string
    parseString(str) {
      const trimmedStr = str.replace(/\/$/, '');

      const match = trimmedStr.match(/[^/]+$/);

      if (match) {
        return match[0];
      }

      return str;
    },
    // function to understand if the item is a file or container
    isItemFile(path) {
      const isFileRegex = /[^/]+\.[^/]+$/;
      return isFileRegex.test(path);
    },
    createFolderEntry (prefix: CommonPrefix, index: number, rootId: number) : S3Node {
      return {
        id: rootId + index + 1,
        // define if is child to triggher another function and manage deep level
        isChild: true,
        title: this.parseString(prefix.Prefix),
        isFile: this.isItemFile(prefix.Prefix),
        childrenLoaded: false,
        children: [],
      };
    },
    createFileEntry (content: _Object, index: number, rootId: number) : S3Node {
      return {
        id: rootId + index + 1,
        isChild: true,
        title: this.parseStringChild(content.Key),
        isFile: this.isItemFile(content.Key),
        link: this.getS3Link(content.Key),
        childrenLoaded: false,
        children: undefined,
      }
    },
  },
});

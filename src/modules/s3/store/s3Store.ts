// src/modules/s3/store/s3Store.js
/* eslint-disable no-irregular-whitespace */
import { defineStore } from 'pinia';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import {
  _Object,
  ListObjectsV2Output,
} from '@aws-sdk/client-s3/dist-types/models/models_0';
import { CommonPrefix } from '@aws-sdk/client-s3/dist-types/models';
import { S3Node } from '@/types/s3Types';

// const TEST_URL =
//   https://os.zhdk.cloud.switch.ch/envicloud/?prefix=wsl/CORE_S2A/&max-keys=100000&delimiter=/

export const useS3Store = defineStore('s3Store', {
  state: () => ({ originUrl: '' as string }),
  getters: {},
  actions: {
    async fetchS3Content(
      baseUrl: string,
      url: string,
      isChild: boolean,
      nodeId: number,
      rootNodes?: S3Node[],
    ) {
      const response = await axios.get(url);
      const { ListBucketResult } = this.parseXmlToJson(response.data);

      return isChild
        ? this.mapChildData(baseUrl, ListBucketResult, nodeId, rootNodes)
        : this.mapData(baseUrl, ListBucketResult);
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

    mapData(baseUrl: string, listObject: ListObjectsV2Output): S3Node[] {
      const rootId = 1;

      const childFolders = listObject.CommonPrefixes?.map<S3Node>(
        (prefix, index) => this.createFolderEntry(prefix, index, rootId),
      );

      // listObject.Contents this can be a single Object not an array
      // maybe due to the conversion from XML?
      const contents = listObject.Contents;
      let childEntires: S3Node[];

      const hasContentList = contents && contents instanceof Array;

      if (hasContentList) {
        childEntires = contents.map<S3Node>((content, index) =>
          this.createFileEntry(baseUrl, content, index, rootId),
        );
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
      ];
    },

    mapChildData(
      baseUrl: string,
      listObject: ListObjectsV2Output,
      nodeId: number,
      rootNodes: S3Node[],
    ): S3Node[] | undefined {
      // if the API returns nothing useful, still attach a "Go to S3" link so the UI doesn't break
      // example metadata/swissrad10-hourly-light-availability-maps-at-10-m-resolution-over-switzerland?search=swissrad
      if (!listObject || !listObject.Contents) {
        const children = [
          this.createFileEntry(baseUrl, 'Go to S3', undefined, undefined, {
            isLastItem: true,
            customLink: this.originUrl,
          }),
        ];
        // Trigger function to add data in the right node
        this.findAndAddChildren(rootNodes, children, nodeId);
        return rootNodes;
      }

      // Remove first element because is a repetition of the container
      const contents = Array.isArray(listObject.Contents)
        ? listObject.Contents.slice(1)
        : listObject.Contents;

      // map the content
      const children = Array.isArray(contents)
        ? contents.map<S3Node>((content) =>
            this.createFileEntry(baseUrl, content),
          )
        : [
            this.createFileEntry(baseUrl, 'Go to S3', undefined, undefined, {
              isLastItem: true,
              customLink: this.getBrowserLink(baseUrl),
            }),
          ];

      // Trigger function to add data in the right node
      this.findAndAddChildren(rootNodes, children, nodeId);

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
    getCleanLink(baseUrlWithQuery: string, key: string): string {
      let bucketRoot = baseUrlWithQuery.split('?')[0];
      if (!bucketRoot.endsWith('/')) bucketRoot += '/';

      const cleanKey = key.replace(/^\//, '');
      return `${bucketRoot}${cleanKey}`;
    },
    getBrowserLink(baseUrl: string): string {
      // es. baseUrl = "https://envicloud.wsl.ch/edna/?prefix=fw_sn/dir/&max-keys=..."
      const urlObj = new URL(baseUrl);

      const hostRoot = urlObj.origin;
      const bucketRoot = baseUrl.split('?')[0];
      const prefix = urlObj.searchParams.get('prefix') || '';

      return `${hostRoot}/#/?bucket=${encodeURIComponent(bucketRoot)}&prefix=${encodeURIComponent(prefix)}`;
    },

    // Clean the string for the fileName to reduce the length of the word
    parseStringChild(str: string) {
      const childStr = this.parseString(str);
      const splitted = childStr.split('_');
      if (splitted.length >= 2) {
        return `${splitted[0]}_${splitted[splitted.length - 1]}`;
      }
      return childStr;
    },
    // clean the string
    parseString(str: string) {
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
    createFolderEntry(
      prefix: CommonPrefix,
      index: number,
      rootId: number,
    ): S3Node {
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

    createFileEntry(
      baseUrl: string,
      content: _Object | string,
      index?: number,
      rootId?: number,
      opts?: { isLastItem?: boolean; customLink?: string },
    ): S3Node {
      const key = typeof content === 'string' ? content : content.Key;

      const node: S3Node = {
        isChild: true,
        title: this.parseStringChild(key),
        isFile: this.isItemFile(key),
        link: opts?.customLink ?? this.getCleanLink(baseUrl, key),
        childrenLoaded: false,
        children: undefined,
        ...(opts?.isLastItem ? { isLastItem: true } : {}),
      };

      if (index !== undefined && rootId !== undefined) {
        node.id = rootId + index + 1;
      }

      return node;
    },
  },
});

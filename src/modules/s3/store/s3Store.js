// src/modules/s3/store/s3Store.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

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
    async fetchS3Content(url, isChild, nodeId, params = {}) {

      try {
        const response = await axios.get(url, {
          params,
          forceNoCredentials: true,
        });

        const jsonObj = this.parseXmlToJson(response.data);

        if (isChild) {
          return this.mapChildData(jsonObj, nodeId);
        }

        return this.mapData(jsonObj);
      } catch (error) {
        this.error = error;
        throw error;
      }
    },

    parseXmlToJson(xmlData) {
      const parser = new XMLParser({
        ignoreAttributes: false,
      });

      try {
        return parser.parse(xmlData);
      } catch (error) {
        throw new Error('Failed to parse XML data');
      }
    },

    mapChildData(json, nodeId) {
      if (!json.ListBucketResult || !json.ListBucketResult.Contents) {
        return;
      }

      // Rremove first element because is a repetition of the container
      const contents = Array.isArray(json.ListBucketResult.Contents)
        ? json.ListBucketResult.Contents.slice(1)
        : json.ListBucketResult.Contents;

      // map the content
      const children = Array.isArray(contents)
        ? contents.map((prefix) => ({
            isChild: true,
            title: this.parseStringChild(prefix.Key),
            isFile: this.isItemFile(prefix.Key),
            link: this.setUrl(prefix.Key),
            childrenLoaded: false,
          }))
        : [
            {
              isChild: true,
              title: 'Go to S3',
              // lastItem is needed for manage the last level of deep allowed
              isLastItem: true,
              link: this.s3BucketUrl,
              childrenLoaded: false,
            },
          ];

      // Trigger function to add data in the right node
      this.findAndAddChildren(
        this.contentFromS3,
        children,
        nodeId,
      );
    },

    findAndAddChildren(nodes, children, nodeId) {
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

    mapData(json) {
      const rootId = 1;

      const children = json.ListBucketResult.CommonPrefixes.map(
        (prefix, index) => ({
          id: rootId + index + 1,
          // define if is child to triggher another function and manage deep level
          isChild: true,
          title: this.parseString(prefix.Prefix),
          isFile: this.isItemFile(prefix.Prefix),
          childrenLoaded: false,
          children: [],
        }),
      );

      this.contentFromS3 = [
        {
          id: rootId,
          isFile: this.isItemFile(json.ListBucketResult.Prefix),
          title: this.parseString(json.ListBucketResult.Prefix),
          children,
          isChild: false,
          childrenLoaded: false,
        },
      ];
    },
    // set the URL for download
    setUrl(url) {
      const cleanedBaseUrl = this.s3Url.replace(/\/$/, '');
      const cleanedUrl = url.replace(/^\//, '');

      const linkUrl = `${cleanedBaseUrl}/${cleanedUrl}`;
      return linkUrl;
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
  },
});

/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-31 08:14:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { SelectionType } from 'vanilla-jsoneditor';
import BaseJsonEditor from '@/components/BaseJsonEditor.vue';
import metadata from '@/../stories/js/metadata.js'

export default {
  title: '1 Base / Json Editor',
  component: BaseJsonEditor,
};


const jsonContent = {
  some: 'testdata',
  someValue: 1,
  nestedStuff: {
    moreThings: true,
    moreValues: -1,
  },
}

export const Empty = {
  args: {
    title: 'Empty Json Editor',
  },
}

export const FilledJSONContent = {
  args: {
    title: 'Json Editor',
    instructions: 'Here you can change the configuration of something',
    jsonContent,
  },
}

export const FilledJSONKeyEditingAllowed = {
  args: {
    title: 'Json Editor',
    instructions: 'Here you can change the configuration of something',
    jsonContent,
    allowedSelection: SelectionType.key,
  },
}

export const FilledJSONMultiEditingAllowed = {
  args: {
    title: 'Json Editor',
    instructions: 'Here you can change the configuration of something',
    jsonContent,
    allowedSelection: SelectionType.multi,
  },
}


export const FilledLargeJSONContent = {
  args: {
    title: 'Json Editor',
    instructions: 'What you see here is system admin stuff, only change things if you know what you\'re doing',
    maxHeight: 700,
    jsonContent: metadata[0],
  },
}


export const FilledTextContent = {
  args: {
    title: 'Json Editor',
    instructions: 'Here you can change the configuration of something',
    textContent: JSON.stringify(jsonContent),
  },
}

export const FilledTextContentError = {
  args: {
    title: 'Json Editor',
    instructions: 'Here you can change the configuration of something',
    textContent: `${JSON.stringify(jsonContent)} randomstuff`,
  },
}

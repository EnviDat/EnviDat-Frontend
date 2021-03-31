/**
 * @summary story of BaseIconLabelView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-27 16:00:17
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import TextPreviewCard from '@/modules/metadata/components/ResourcePreviews/TextPreviewCard';


storiesOf('3 Cards / Resource Previews', module)
.add('Text Preview', () => ({
  components: { TextPreviewCard },
  template: `
  <v-col>

    <v-row>
      <v-col>
        Empty Text Preview
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <TextPreviewCard />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        Text Preview with url
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <TextPreviewCard :url="txtUrl" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        Text Preview with invalid url
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <TextPreviewCard :url="invalidUrl" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
      Text Preview with markdown url
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <TextPreviewCard :url="mdUrl"
                          :enableMarkdown="true" />
      </v-col>
    </v-row>


    <v-row>
      <v-col>
      Text Preview with relative markdown url
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <TextPreviewCard :url="relavtieMDUrl"
                          :enableMarkdown="true" />
      </v-col>
    </v-row>

  </v-col> `,
  data: () => ({
    txtUrl: 'https://os.zhdk.cloud.switch.ch/envicloud/wsl/ros_data/readme.txt',
    invalidUrl: 'https://os.zhdk.cloud.switch.ch/envicloud/wsl/ros_data/fasdfasdfasdfas.txt',
    mdUrl: 'https://raw.githubusercontent.com/EnviDat/EnviDat-Frontend/master/README.md',
    relavtieMDUrl: './testdata/dmp.md',
  }),
}));

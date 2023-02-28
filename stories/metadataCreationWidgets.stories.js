/* eslint-disable object-property-newline */
import EditAddPublication from '@/modules/user/components/EditAddPublication.vue';
import relatedPublicCitationTesting from './js/relatedPublicCitation';

/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-09-06 15:11:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  title: '9 Editing Metadata / Add Related Publication Widget',
  decorators: [],
  parameters: {},
};

const mobileViewportParams =  { viewport: { defaultViewport: 'mobile1' } };
const mobileLargeViewportParams = { viewport: {defaultViewport: 'mobile2' } };
const tabletViewportParams = { viewport: { defaultViewport: 'tablet' } };

const keys = Object.keys(relatedPublicCitationTesting);

const pubCitation = relatedPublicCitationTesting[keys[1]];
const pubCitation0 = relatedPublicCitationTesting[keys[0]];

const citation1 = {
  citation: pubCitation0.citation.WSL,
  abstract: pubCitation0.abstract,
  pid: keys[0],
};

const citation2 = {
  citation: pubCitation.citation.WSL,
  abstract: pubCitation.abstract,
  doi: pubCitation.doi,
  doiUrl: `https://www.doi.org/${pubCitation.doi}`,
};

const Template = (args, { argTypes }) => ({
  components: { EditAddPublication },
  props: Object.keys(argTypes),
  template: '<EditAddPublication v-bind="$props" />',
});

export const Empty = Template.bind({});

export const FilledPid = Template.bind({});
FilledPid.args = {
  pid: 'wsl:21835',
}

export const FilledDoi = Template.bind({});
FilledDoi.args = {
  doi: '10.1002/eap.2133',
}

export const FilledDenseDoi = Template.bind({});
FilledDenseDoi.args = {
  ...FilledDoi.args,
  dense: true,
}

export const FilledPidWithPreview = Template.bind({});
FilledPidWithPreview.args = {
  dense: true,
  ...citation1,
}

export const FilledDoiWithPreview = Template.bind({});
FilledDoiWithPreview.args = {
  dense: true,
  ...citation2,
}
/*
export const EditRelatedPublicationViews = () => ({
    components: { EditRelatedPublications },
    template: `
    <v-col>

      <v-row>
        Edit Related Publications fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditRelatedPublications v-bind="genericProps" />
        </v-col>
      </v-row>


      <v-row>
        Edit Related Publications fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditRelatedPublications v-bind="genericPropsFilled" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    methods: {
      editComponentsChanged(updateObj) {
        if (updateObj.data.id === this.genericProps.id) {
          this.genericProps = updateObj.data;
         // this.genericProps.publications.text = this.genericProps.textareaContent;
        }
        if (updateObj.data.id === this.genericPropsFilled.id) {
          // this.genericPropsFilled = updateObj.data;
          this.genericPropsFilled.relatedPublicationsText = updateObj.data;
        }
      },
    },
    data: () => ({
      genericProps: {
        relatedPublicationsText: '', // * wsl:21835 wsl%3A22390 \n * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 ',
        id: '1',
      },
      genericPropsFilled: {
        id: '2',
        labelTextarea: 'Related Publications',
        subtitlePreview: 'Preview',
        showPlaceholder: false,
        relatedPublicationsText: '* wsl:21835 wsl%3A22390 \n * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 ',
        // relatedPublicationsText: '* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A22390\r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 \r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A30382',
      },
    }),
  });
*/

/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-11 16:50:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import {
  CANCEL_EDITING_RESOURCE,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  SAVE_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/eventBus';

import EditMetadataResources from '@/modules/user/components/EditMetadataResources';
import EditDataAndResources from '@/modules/user/components/EditDataAndResources';
import EditDataInfo from '@/modules/user/components/EditDataInfo';
import { createResources } from '@/factories/metaDataFactory';
import {
  enhanceElementsWithStrategyEvents,
  localIdProperty,
} from '@/factories/strategyFactory';
import unFormatedMetadataCards from './js/metadata';
import { METADATA_EDITING } from './storybookFolder';


const apiFactory = require('@/factories/apiFactory');

const metadataCards = [];

// console.log(`got metadata ${!!unFormatedMetadataCards}`);

for (let i = 0; i < unFormatedMetadataCards.length; i++) {
  const el = unFormatedMetadataCards[i];
  /*
  }

  unFormatedMetadataCards.forEach((el) => {
  */
  let formatted = apiFactory.solrResultToCKANJSON(el);
  formatted = createResources(formatted);
  enhanceElementsWithStrategyEvents(formatted.resources, SELECT_EDITING_RESOURCE_PROPERTY, true);
  metadataCards.push(formatted);
}
// });

const storybookFolder = `${METADATA_EDITING} / Data Infos`;


storiesOf(storybookFolder, module)
  .add('Edit Resources List', () => ({
    components: { EditMetadataResources },
    template: `
    <v-col>

      <v-row>
        EditMetadataResources EmptyList
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataResources v-bind="emptyFirstGenericProps" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.$on(SELECT_EDITING_RESOURCE, this.selectResource);
    },
    beforeDestroy() {
      eventBus.$off(SELECT_EDITING_RESOURCE, this.selectResource);
    },
    methods: {
      selectResource(id) {
        this.emptyFirstGenericProps = {
          ...this.emptyFirstGenericProps,
          selectionId: id,
        };
      },
      // editComponentsChanged(updateObj) {
      //   if (updateObj.data.id === this.genericProps.id) {
      //     this.genericProps = updateObj.data;
      //   }
      //   if (updateObj.data.id === this.emptyFirstGenericProps.id) {
      //     this.emptyFirstGenericProps = updateObj.data;
      //   }
      // },
    },
    data: () => ({
      emptyFirstGenericProps: {
        id: '1',
        resources: metadataCards[1].resources,
        selectionId: -1,
        resourcesConfig: {
          downloadActive: false,
        },
      },
      genericProps: {
        id: '2',
        resources: metadataCards[2].resources,
        selectionId: -1,
        resourcesConfig: {
          downloadActive: false,
        },
      },
    }),
  }))
  .add('Edit Data Info', () => ({
  components: { EditDataInfo },
  template: `
    <v-col>

      <v-row>
        EditDataInfo Component Unfilled Dates
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataInfo :datesArray="datesArrayEmpty" />
        </v-col>
      </v-row>

      <v-row>
        EditDataInfo Component Prefilled Dates
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataInfo :datesArray="datesArrayFilled" />
        </v-col>
      </v-row>

    </v-col>
    `,
  computed: {
  },
  methods: {
  },
    data: () => ({
      datesArrayEmpty: [
        {
          dateType: '',
          date: '',
          dateEnd: '',
        },
      ],
      datesArrayFilled: [
        {
          dateType: 'collected',
          date: '01.08.2006',
          dateEnd: '6.09.2007',
        },
        {
          dateType: 'collected',
          date: '01.08.2006',
          dateEnd: '6.09.2007',
        },
        {
          dateType: 'collected',
          date: '01.08.2006',
          dateEnd: '6.09.2007',
        },
      ],
    }),
  }))
  .add('Edit Data And Resources List', () => ({
    components: { EditDataAndResources },
    template: `
    <v-col>

      <v-row>
        EditDataAndResources Component
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataAndResources :genericProps="genericProps" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.$on(SAVE_EDITING_RESOURCE, this.saveResource);
      eventBus.$on(CANCEL_EDITING_RESOURCE, this.cancelEditing);
      eventBus.$on(SELECT_EDITING_RESOURCE, this.selectResource);
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.$off(SAVE_EDITING_RESOURCE, this.saveResource);
      eventBus.$off(CANCEL_EDITING_RESOURCE, this.cancelEditing);
      eventBus.$off(SELECT_EDITING_RESOURCE, this.selectResource);
      eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    computed: {
      genericProps() {
        return {
          resources: this.resources,
          selectionId: this.selectionId,
          resourcesConfig: {
            downloadActive: false,
          },
        };
      },
    },
    methods: {
      selectResource(id) {
        if (this.selectionId !== -1) {
          this.cancelEditing();
        }

        this.selectionId = id;
        this.setSelected(this.selectionId, true);
      },
      cancelEditing() {
        this.setSelected(this.selectionId, false);
        this.selectionId = -1;
      },
      editComponentsChanged(updateObj) {
        if (updateObj.object === EDITMETADATA_DATA_RESOURCES) {

          this.updateResource(updateObj.data);
        }
      },
      updateResource(newRes) {
        const res = this.resources;

        for (let i = 0; i < res.length; i++) {
          const r = res[i];
          // if (r.id === newRes.id) {
          //   this.$set(res, i, newRes);
          //   return;
          // }

          if (r[localIdProperty]) {
            if (r[localIdProperty] === newRes.id) {
              this.$set(res, i, newRes);
              return;
            }
          } else if (r.id === newRes.id) {
            this.$set(res, i, newRes);
            return;
          }
        }

        res.unshift(newRes);
      },
      setSelected(id, selected) {
        const res = this.resources;

        for (let i = 0; i < res.length; i++) {
          const r = res[i];
          // if (r.id === id) {
          //   r.isSelected = selected;
          //   return;
          // }

          if (r[localIdProperty]) {
            if (r[localIdProperty] === id) {
              r.isSelected = selected;
              this.$set(res, i, r);
              return;
            }
          } else if (r.id === id) {
            r.isSelected = selected;
            this.$set(res, i, r);
            return;
          }
        }
      },
      saveResource(newRes) {
        newRes.existsOnlyLocal = false;
        this.updateResource(newRes);
        this.cancelEditing();
      },
    },
    data: () => ({
      resources: metadataCards[0].resources,
      selectionId: -1,
    }),
  }));

<template>

  <v-container id="EditDataInfo"
                fluid
                class="pa-0">

    <v-row>

        <v-col cols="12">
          <div class="text-h5">{{ labels.cardTitle }}</div>
        </v-col>

      </v-row>


      <v-row>

        <v-col >
          <v-select :items="yearsList"
                    outlined
                    :label="labels.creationDate"
                    required
                    prepend-icon="date_range"
                    append-icon="arrow_drop_down"
                    :value="addInfoFields.creationYear"
                    @input="notifyChange('creationYear', $event)"
          />
        </v-col>

        <v-col >
          <v-select :items="yearsList"
                    outlined
                    :label="labels.collectionDate"
                    required
                    prepend-icon="date_range"
                    append-icon="arrow_drop_down"
                    :value="addInfoFields.collectionYear"
                    @input="notifyChange('collectionYear', $event)"
          />
        </v-col>

      </v-row>


      <v-row>

        <v-col cols="6">
          <v-select :items="yearsList"
                    outlined
                    :label="labels.publicationDate"
                    required
                    readonly
                    prepend-icon="date_range"
                    append-icon="arrow_drop_down"
                    :value="addInfoFields.publicationYear"
                    @input="notifyChange('publicationYear', $event)"
          />
        </v-col>

      </v-row>


      <v-row>

        <v-col >
          <v-select :items="dataLicenses"
                    outlined
                    :label="labels.dataLicense"
                    required
                    append-icon="arrow_drop_down"
                    :value="addInfoFields.dataLicense"
                    @input="notifyChange('dataLicense', $event)"
          />
        </v-col>

      </v-row>

  </v-container>

</template>


<script>
/**
 * EditDataInfo.vue shows Additional Information
 *
 *
 * @summary Shows Additional Information (creation, collection and publication dates, data license and summary)
 * @author Sam Woodcock and Rebecca Kurup Buchholz
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-10-12
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_INFO,
  eventBus,
} from '@/factories/eventBus';


export default {
  name: 'EditDataInfo',
  props: {
    addInfoObj: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    labels: {
      cardTitle: 'Additional Information about the Resources',
      creationDate: 'Creation Date',
      collectionDate: 'Collection Date',
      publicationDate: 'Publication Date',
      dataLicense: 'Data License',
    },
    maxYears: 30,
    dataLicenses: ['foo', 'boo'],
  }),
  computed: {
    addInfoFields: {
      get() {
        let addInfoObject = { ...this.addInfoObj };

        if (Object.keys(addInfoObject).length === 0) {
          addInfoObject = {
            creationYear: '',
            collectionYear: '',
            publicationYear: '',
            dataLicense: '',
          };
        }

        return addInfoObject;
      },
    },
    yearsList() {

      const date = new Date();
      let year = date.getFullYear();
      const yearList = [];

      for (let i = 0; i < this.maxYears; i++) {
        yearList[i] = year.toString();
        year--;
      }

      return yearList;
    },
  },
  methods: {
    editEntry(addInfoObject, property, value) {
      addInfoObject[property] = value;
    },
    notifyChange(property, value) {

      const addInfoCopy = { ...this.addInfoObj };

      this.editEntry(addInfoCopy, property, value);

      this.setDataInfo('addInfoObj', addInfoCopy);

    },
    setDataInfo(property, value) {
      const newDataInfo = {
        ...this.$props,
        [property]: value,
      };
      // console.log(newDataInfo);
      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_INFO,
        data: newDataInfo,
      });
    },
  },
  components: {
  },
};


</script>

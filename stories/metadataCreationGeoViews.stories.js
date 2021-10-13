/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Sam Woodcock
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-11 16:50:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from "@storybook/vue";

import EditDataGeo from "@/modules/user/components/EditDataGeo";
import MapLeaflet from "@/modules/metadata/components/Geoservices/MapLeaflet";

import { METADATA_EDITING } from "./storybookFolder";

const storybookFolder = `${METADATA_EDITING} / Data Infos`;

storiesOf(storybookFolder, module).add("Edit Geo Information", () => ({
  components: {
    EditDataGeo,
    MapLeaflet
  },
  template: `
    <v-col>

      <v-row>
        EditDataGeo with Point
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataGeo :genericProps="genericPropsPoint" />
        </v-col>
      </v-row>

      <v-row>
        EditDataGeo with Polygon
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataGeo :genericProps="genericPropsPolygon" />
        </v-col>
      </v-row>

    </v-col>
    `,
  data: () => ({
    genericPropsPoint: {
      mapDivId: "point-map-small",
      error: null,
      layerConfig: null,
      mapHeight: 450,
      mapEditable: true,
      site: {
        type: "Point",
        coordinates: [9.870043694972992, 46.80772203292321]
      }
    },
    genericPropsPolygon: {
      mapDivId: "polygon-map-small",
      error: null,
      layerConfig: null,
      mapHeight: 450,
      mapEditable: true,
      site: {
        type: "Polygon",
        coordinates: [
          [
            [8.7451171875, 46.89073198488606],
            [17.4462890625, 51.971796908939176],
            [28.388671875, 57.42208294734931],
            [23.73046875, 59.086490948368436],
            [4.658203125, 52.24170452760525],
            [0.2197265625, 48.80734571355101],
            [8.7451171875, 46.89073198488606]
          ]
        ]
      }
    }
  }),
  created() {
    //      eventBus.$on(SELECT_EDITING_RESOURCE, this.editComponentsChanged);
  },
  beforeDestroy() {
    //      eventBus.$off(SELECT_EDITING_RESOURCE, this.editComponentsChanged);
  },
  methods: {
    editComponentsChanged(updateObj) {
      this.genericProps = updateObj.data;
    },
    changeOpacity(value) {
      this.opacity = value;
    },
    changeLayer(layerName) {
      this.$emit("changeLayer", layerName, this.mapDivId);
    }
  }
}));

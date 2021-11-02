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
import { createLocation } from "@/factories/metaDataFactory";

import { METADATA_EDITING } from "./storybookFolder";

const storybookFolder = `${METADATA_EDITING} / Data Infos`;

// DUMMY DATA START
const testMetadata = {
  id: 1,
  name: "test_site",
  title: "Test Site",
}
const metaPoint = JSON.stringify({type: "Point", coordinates: [7.435198,46.268368]});
const metaPolygon = JSON.stringify({type: "Polygon",
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
});
const metaMultiPoint = JSON.stringify({
  type: "MultiPoint",
  coordinates: [
    [8.7451171875, 46.89073198488606],
    [17.4462890625, 51.971796908939176],
    [28.388671875, 57.42208294734931],
    [23.73046875, 59.086490948368436],
    [4.658203125, 52.24170452760525],
    [0.2197265625, 48.80734571355101],
    [8.7451171875, 46.89073198488606]
  ]
});
const metaMultiPolygon = JSON.stringify({
  type: "MultiPolygon",
  coordinates: [
    [
      [
        [102.0, 2.0],
        [103.0, 2.0],
        [103.0, 3.0],
        [102.0, 3.0],
        [102.0, 2.0]
      ]
    ],
    [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0]
      ]
    ]
  ]
});
const pointLocation = createLocation({...testMetadata, spatial: metaPoint});
const polygonLocation = createLocation({...testMetadata,spatial: metaPolygon});
const multiPointLocation = createLocation({...testMetadata,spatial: metaMultiPoint});
const multiPolygonLocation = createLocation({...testMetadata,spatial: metaMultiPolygon});
// DUMMY DATA END

storiesOf(storybookFolder, module).add("EditGeo Point", () => ({
  components: {
    EditDataGeo
  },
  template: `
    <v-col>

      <v-row>
        {{ label }}
      </v-row>
      <v-row class="py-3" >
        <v-col >
          <EditDataGeo  :mapDivId="mapDivId"
                        :location="location" />
        </v-col>
      </v-row>

    </v-col>
    `,
  data: () => ({
    label: "EditDataGeo with Point",
    mapDivId: "point-map-small",
    location: pointLocation
  })
}));

storiesOf(storybookFolder, module).add("EditGeo Polygon", () => ({
  components: {
    EditDataGeo
  },
  template: `
    <v-col>

      <v-row>
        {{ label }}
      </v-row>
      <v-row class="py-3" >
        <v-col >
          <EditDataGeo  :mapDivId="mapDivId"
                        :location="location" />
        </v-col>
      </v-row>

    </v-col>
    `,
  data: () => ({
    label: "EditDataGeo with Polygon",
    mapDivId: "polygon-map-small",
    location: polygonLocation
  })
}));

storiesOf(storybookFolder, module).add("EditGeo MultiPoint", () => ({
  components: {
    EditDataGeo
  },
  template: `
    <v-col>

      <v-row>
       {{ label }}
      </v-row>
      <v-row class="py-3" >
        <v-col >
          <EditDataGeo  :mapDivId="mapDivId"
                        :location="location" />
        </v-col>
      </v-row>

    </v-col>
    `,
  data: () => ({
    label: "EditDataGeo with MultiPoint",
    mapDivId: "multipoint-map-small",
    location: multiPointLocation
  })
}));

storiesOf(storybookFolder, module).add("EditGeo MultiPolygon", () => ({
  components: {
    EditDataGeo
  },
  template: `
    <v-col>

      <v-row>
        {{ label }}
      </v-row>
      <v-row class="py-3" >
        <v-col >
          <EditDataGeo  :mapDivId="mapDivId"
                        :location="location" />
        </v-col>
      </v-row>

    </v-col>
    `,
  data: () => ({
    label: "EditDataGeo with MultiPolygon",
    mapDivId: "multipolygon-map-small",
    location: multiPolygonLocation
  })
}));

// storiesOf(storybookFolder, module).add("EditGeo GeometryCollection", () => ({
//   components: {
//     EditDataGeo
//   },
//   template: `
//     <v-col>

//       <v-row>
//         {{ label }}
//       </v-row>
//       <v-row class="py-3" >
//         <v-col >
//           <EditDataGeo  :mapDivId="mapDivId"
//                         :location="geoJSON" />
//         </v-col>
//       </v-row>

//     </v-col>
//     `,
//   data: () => ({
//     label: "EditDataGeo with GeometryCollection",
//     mapDivId: "geometrycollection-map-small",
//     geoJSON: { "type": "GeometryCollection",
//       "geometries": [
//         { "type": "Point",
//           "coordinates": [100.0, 0.0]
//         },
//         { "type": "Polygon",
//           "coordinates": [
//             [101.0, 0.0],
//             [102.0, 1.0],
//             [102.0, 0.0],
//             [101.0, 1.0],
//           ]
//         },
//         { "type": "Polygon",
//           "coordinates": [
//             [104.0, 0.0],
//             [103.0, 1.0],
//             [104.0, 0.0],
//             [103.0, 1.0],
//           ]
//         },
//       ]
//     },
//   })
// }));

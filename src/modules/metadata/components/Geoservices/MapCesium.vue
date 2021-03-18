<template>
  <div :id="mapDivId" class="cesiumContainer">
    <div class="zoom">
        <zoom-btn @zoomIn="zoomIn" @zoomOut="zoomOut" />
    </div>
    <v-card ripple class="basemap-toggle">
      <img width="40" height="40" v-if="basemap==='streets'" src="./satellite-icon.png" @click="basemap='satellite'">
      <img width="40" height="40" v-if="basemap==='satellite'" src="./streets-icon.png" @click="basemap='streets'">
    </v-card>
    <div style="position: absolute; bottom: 70px; right: 16px; z-index: 99999;">
      <slot></slot>
    </div>
    <div id="credits">
      <a style="padding-right: 10px;" href="https://cesium.com/cesiumjs/" target="_blank">CesiumJS</a>
      <a href="https://www.bing.com/maps/" target="_blank">Images &copy; Bing Maps</a>
    </div>
  </div>
</template>

<script>
    /* eslint-disable new-cap */
    import Viewer from 'cesium/Widgets/Viewer/Viewer';
    import OpenStreetMapImageryProvider from 'cesium/Scene/OpenStreetMapImageryProvider';
    import BingMapsImageryProvider from 'cesium/Scene/BingMapsImageryProvider';
    import BingMapsStyle from 'cesium/Scene/BingMapsStyle';
    import Rectangle from 'cesium/Core/Rectangle';
    import SceneMode from 'cesium/Scene/SceneMode';
    import Cartesian2 from 'cesium/Core/Cartesian2';
    import Ellipsoid from 'cesium/Core/Ellipsoid';
    import CesiumMath from 'cesium/Core/Math';
    import 'cesium/Widgets/widgets.css';
    import ZoomBtn from './ZoomBtn';
    import { cesiumLayer } from './layer-cesium';

    export default {
      name: 'MapCesium',
      components: { ZoomBtn },
      props: {
        opacity: Number,
        layer: Object,
        mapDivId: String,
      },
      data() {
        return {
          viewer: null,
          mapLayer: null,
          basemapLayer: null,
        };
      },
      computed: {
        extent() {
          return this.viewer.camera;
        },
        basemap: {
          get() {
            return this.$store.state.geoservices.basemap;
          },
          set(value) {
            this.$store.commit('setBasemap', value);
          },
        },
        streets() {
          return new OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/',
          });
        },
        satellite() {
          return new BingMapsImageryProvider({
            url: 'https://dev.virtualearth.net',
            key: process.env.VUE_APP_BING_API_KEY,
            mapStyle: BingMapsStyle.AERIAL,
          });
        },
      },
      mounted() {
        this.viewer = new Viewer(this.mapDivId, {
          animation: false,
          imageryProvider: false,
          baseLayerPicker: false,
          enablePickFeatures: true,
          fullscreenButton: false,
          vrButton: false,
          geocoder: false,
          homeButton: false,
          sceneMode: SceneMode.SCENE3D,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
          navigationInstructionsInitiallyVisible: false,
          clockViewModel: null,
          requestRenderMode: true,
          maximumRenderTimeChange: Infinity,
        });
        // Hide default credits from all existing cesium maps
        const cesiumWidgets = document.getElementsByClassName('cesium-widget-credits');
        cesiumWidgets.forEach((w) => { w.style.display = 'none'; });

        this.replaceLayer();
        this.replaceBasemap();
        this.zoomToExtent(this.layer.bbox);

        this.viewer.scene.canvas.addEventListener('click', (event) => {
          event.preventDefault();
          const mousePosition = new Cartesian2(event.clientX, event.clientY);
          const selectedLocation = this.viewer.scene.pickPosition(mousePosition);
          const wgs = Ellipsoid.WGS84.cartesianToCartographic(selectedLocation);
          console.log(CesiumMath.toDegrees(wgs.latitude), CesiumMath.toDegrees(wgs.longitude));
          console.log(this.viewer.scene);


          const posUL = this.viewer.camera.pickEllipsoid(new Cartesian2(0, 0), Ellipsoid.WGS84);
          const posLR = this.viewer.camera.pickEllipsoid(new Cartesian2(this.viewer.canvas.width, this.viewer.canvas.height), Ellipsoid.WGS84);
          const posLL = this.viewer.camera.pickEllipsoid(new Cartesian2(0, this.viewer.canvas.height), Ellipsoid.WGS84);
          const posUR = this.viewer.camera.pickEllipsoid(new Cartesian2(this.viewer.canvas.width, 0), Ellipsoid.WGS84);
          const cartUl = Ellipsoid.WGS84.cartesianToCartographic(posUL);
          const maxLat = CesiumMath.toDegrees(cartUl.latitude).toFixed(2);

          const cartUr = Ellipsoid.WGS84.cartesianToCartographic(posUR);
          const maxLon = CesiumMath.toDegrees(cartUr.longitude).toFixed(2);
          const cartLr = Ellipsoid.WGS84.cartesianToCartographic(posLR);
          const minLat = CesiumMath.toDegrees(cartLr.latitude).toFixed(2);
          const cartLl = Ellipsoid.WGS84.cartesianToCartographic(posLL);
          const minLon = CesiumMath.toDegrees(cartLl.longitude).toFixed(2);

          console.log(maxLat, maxLon, minLat, minLon);

        }, false);


      },
      methods: {
        zoomIn() {
          this.viewer.camera.zoomIn();
        },
        zoomOut() {
          this.viewer.camera.zoomOut();
        },
        zoomToExtent(bbox) {
          this.viewer.camera.setView({
            destination: new Rectangle.fromDegrees(bbox.minx, bbox.miny, bbox.maxx, bbox.maxy),
          });
        },
        replaceLayer() {
          if (this.mapLayer) {
            this.viewer.imageryLayers.remove(this.mapLayer);
            this.mapLayer = null;
          }
          // Attention: new WebMapServiceImageryProvider can not be used as removable layer object
          this.mapLayer = this.viewer.imageryLayers.addImageryProvider(cesiumLayer(this.layer));
        },
        replaceBasemap() {
          if (this.basemapLayer) {
            this.viewer.imageryLayers.remove(this.basemapLayer);
            this.basemapLayer = null;
          }
          this.basemapLayer = this.basemap === 'streets' ? this.streets : this.satellite;
          this.basemapLayer = this.viewer.imageryLayers.addImageryProvider(this.basemapLayer, 0);
        },
      },
      watch: {
        opacity() {
          this.mapLayer.alpha = this.opacity / 100;
        },
        layer: {
          handler() {
            this.replaceLayer();
          },
          deep: true,
        },
        basemap() {
          this.replaceBasemap();
        },
      },
      beforeDestroy() {
        this.viewer.destroy();
      },
    };
</script>

<style scoped>
  .cesiumContainer {
    position: relative;
    line-height:0;
    height: 100%;
    width: 100%;
    z-index: 100;
    max-height: 100%;
  }
  .zoom {
    position: absolute;
    padding: 10px;
    z-index: 999;
  }
  #credits {
    font-size: 8pt;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 8px 6px 10px 6px;
    z-index: 999;
    background-color: aliceblue;
  }
  .basemap-toggle {
    position: absolute;
    bottom: 20px;
    right: 15px;
    z-index: 10000;
    cursor: pointer;
    padding: 2px;
    width:44px;
    height: 44px;
  }
</style>

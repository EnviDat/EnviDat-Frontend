<template>
  <div id="cesiumContainer">
    <div class="zoom">
      <transition name="fade">
        <zoom-btn @zoomIn="zoomIn" @zoomOut="zoomOut" @zoomToGeometry="zoomToGeometry" />
      </transition>
    </div>
    <div style="position: absolute; z-index: 1000; bottom: 40px;">
      <slot></slot>
    </div>
    <div id="credits">
      <a style="padding-right: 10px;" href="https://cesium.com/cesiumjs/" target="_blank" rel="noopener noreferrer">CesiumJS</a>
      <a href="https://www.bing.com/maps/" target="_blank" rel="noopener noreferrer">Images &copy; Bing Maps</a>
    </div>
  </div>
</template>

<script>
  /* eslint-disable new-cap */
  import { mapState } from 'vuex';

  import Viewer from 'cesium/Widgets/Viewer/Viewer';
  import BingMapsImageryProvider from 'cesium/Scene/BingMapsImageryProvider';
  import BingMapsStyle from 'cesium/Scene/BingMapsStyle';
  import SceneMode from 'cesium/Scene/SceneMode';
  import HorizontalOrigin from 'cesium/Scene/HorizontalOrigin';
  import VerticalOrigin from 'cesium/Scene/VerticalOrigin';
  import GeoJsonDataSource from 'cesium/DataSources/GeoJsonDataSource';
  import Color from 'cesium/Core/Color';
  // import Credit from 'cesium/Core/Credit';
  // import CreditDisplay from 'cesium/Scene/CreditDisplay';
  import Rectangle from 'cesium/Core/Rectangle';
  import 'cesium/Widgets/widgets.css';

  import marker from '@/assets/map/marker-icon.png';
  import marker2x from '@/assets/map/marker-icon-2x.png';
  import markerShadow from '@/assets/map/marker-shadow.png';
  import ZoomBtn from './ZoomBtn';

  export default {
    name: 'MetadataLocationCesium',
    components: { ZoomBtn },
    data() {
      return {
        marker,
        marker2x,
        markerShadow,
        viewer: null,
      };
    },
    props: {
      geom: { type: Object, required: true },
      centroid: { type: Object, required: true },
      bbox: { type: Object, required: true },
      zoomExtent: { type: Object, required: true },
      color: String,
      fillAlpha: Number,
      outlineWidth: Number,
    },
    mounted() {

      this.initCesium();
    },
    computed: {
      ...mapState([
        'config',
      ]),
      bingApiKey() {
        return this.config?.apiKeys?.bing || null;
      },
    },
    methods: {
      initCesium() {
        const bingKey = this.bingApiKey;

        const imageProvider = new BingMapsImageryProvider({
          url: 'https://dev.virtualearth.net',
          // key: 'AgjSmnaR47Jnx7SWyxGFEJkp9QXCFyj6DwFZw9le12QdVl_ePXbuWb2DHPu8Uqdh',
          key: bingKey,
          mapStyle: BingMapsStyle.AERIAL,
        });

        this.initCesiumContainer(imageProvider);

        // Hide default credits
        document.getElementsByClassName('cesium-credit-logoContainer')[0].style.display = 'none';

          GeoJsonDataSource.load(this.geom)
          .then((dataSource) => {
            this.viewer.dataSources.add(dataSource);

            const entities = dataSource.entities.values;
            entities.forEach((entity) => {

              // Set point style
              entity.billboard = {
                image: marker,
                horizontalOrigin: HorizontalOrigin.CENTER,
                verticalOrigin: VerticalOrigin.BOTTOM,
              };

              // Set polygon style
              entity.polygon.material = new Color.fromCssColorString(this.color).withAlpha(this.fillAlpha);
              entity.outline = true;
              entity.outlineWidth = this.outlineWidth;
              entity.polygon.outlineColor = new Color.fromCssColorString(this.color);
            });
          });

        this.zoomToGeometry();        
      },
      zoomIn() {
        this.viewer.camera.zoomIn();
      },
      zoomOut() {
        this.viewer.camera.zoomOut();
      },
      zoomToGeometry() {
        this.viewer.camera.setView({
          destination: new Rectangle.fromDegrees(this.zoomExtent.minX, this.zoomExtent.minY, this.zoomExtent.maxX, this.zoomExtent.maxY),
        });
      },
      initCesiumContainer(imageProvider) {
        this.viewer = new Viewer('cesiumContainer', {
          animation: false,
          baseLayerPicker: false,
          imageryProvider: imageProvider,
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
      },
    },
    watch: {
      bingApiKey() {
        if (this.bingApiKey) {
          this.initCesium();
        }
      },
    },
  };
</script>

<style scoped>
  #cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .zoom {
    position: absolute;
    padding: 20px;
    z-index: 999;
  }

  #credits {
    font-size: 8pt;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 6px 0 6px;
    margin: 16px;
    z-index: 999;
    background-color: aliceblue;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>

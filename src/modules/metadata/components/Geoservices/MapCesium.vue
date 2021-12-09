<template>
  <div :id="mapDivId"
        :style="`height: ${mapHeight === 0 ? '100%' : mapHeight + 'px' };`"
        class="cesiumContainer">

    <div id="credits">
      <a style="padding-right: 10px;" href="https://cesium.com/cesiumjs/" target="_blank">CesiumJS</a>
      <a href="https://www.bing.com/maps/" target="_blank" v-if="baseMapLayerName === 'satellite'">Images &copy; Bing Maps</a>
      <a href="https://www.openstreetmap.org/" target="_blank" v-if="baseMapLayerName === 'streets'">OpenStreetMap</a>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
  import {
    buffer as tBuffer,
    envelope as tEnvelope,

  } from '@turf/turf';

    /* eslint-disable new-cap */
    import Viewer from 'cesium/Widgets/Viewer/Viewer';
    import OpenStreetMapImageryProvider from 'cesium/Scene/OpenStreetMapImageryProvider';
    import BingMapsImageryProvider from 'cesium/Scene/BingMapsImageryProvider';
    import BingMapsStyle from 'cesium/Scene/BingMapsStyle';
    import Rectangle from 'cesium/Core/Rectangle';
import Matrix4 from 'cesium/Core/Matrix4';
    import SceneMode from 'cesium/Scene/SceneMode';
    import HeadingPitchRange from 'cesium/Core/HeadingPitchRange';
    import Cartesian2 from 'cesium/Core/Cartesian2';
    import Ellipsoid from 'cesium/Core/Ellipsoid';
    import CesiumMath from 'cesium/Core/Math';
    import GeoJsonDataSource from 'cesium/DataSources/GeoJsonDataSource';
    import HorizontalOrigin from 'cesium/Scene/HorizontalOrigin';
    import VerticalOrigin from 'cesium/Scene/VerticalOrigin';
    import Color from 'cesium/Core/Color';
    import 'cesium/Widgets/widgets.css';
    import marker from '@/assets/map/marker-icon.png';
    import marker2x from '@/assets/map/marker-icon-2x.png';
    import markerShadow from '@/assets/map/marker-shadow.png';
    import { mapState } from 'vuex';

    import {
      MAP_ZOOM_IN,
      MAP_ZOOM_OUT,
      MAP_ZOOM_CENTER,
      eventBus,
    } from '@/factories/eventBus';
    import {
      LOCATION_TYPE_POINT,
      LOCATION_TYPE_MULTIPOINT,
      LOCATION_TYPE_POLYGON,
    } from '@/factories/metaDataFactory';
    import { cesiumLayer } from './layer-cesium';


    export default {
      name: 'MapCesium',
      components: {
      },
      props: {
        baseMapLayerName: String,
        opacity: Number,
        featureInfoPts: Array,
        wmsLayer: Object,
        mapDivId: String,
        maxExtent: Object,
        site: Object,
        mapHeight: {
          type: Number,
          default: 0,
        },
      },
      mounted() {
        eventBus.$on(MAP_ZOOM_IN, this.zoomIn);
        eventBus.$on(MAP_ZOOM_OUT, this.zoomOut);
        eventBus.$on(MAP_ZOOM_CENTER, this.triggerCenter);

        this.setupMap();
      },
      beforeDestroy() {
        eventBus.$off(MAP_ZOOM_IN, this.zoomIn);
        eventBus.$off(MAP_ZOOM_OUT, this.zoomOut);
        eventBus.$off(MAP_ZOOM_CENTER, this.triggerCenter);

        this.viewer.destroy();
      },
      computed: {
        ...mapState([
          'config',
        ]),
        extent() {
          return this.viewer.camera;
        },
        streets() {
          return new OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/',
          });
        },
        satellite() {
          return new BingMapsImageryProvider({
            url: 'https://dev.virtualearth.net',
            key: this.config?.apiKeys?.bing || null,
            mapStyle: BingMapsStyle.AERIAL,
          });
        },
      },
      methods: {
        setupMap() {
          this.viewer = this.setupCesiumViewer(this.mapDivId);

          // Hide default credits from all existing cesium maps
          const cesiumWidgets = document.getElementsByClassName('cesium-widget-credits');
          cesiumWidgets.forEach((w) => { w.style.display = 'none'; });

          this.replaceBasemap();

          if (this.wmsLayer) {
            this.replaceLayer();
          }

          const that = this;

          this.viewer.scene.canvas.addEventListener('click', (event) => {
            event.preventDefault();
            const viewer = that.viewer;
            const mousePosition = new Cartesian2(event.clientX, event.clientY);
            const selectedLocation = viewer.scene.pickPosition(mousePosition);

            if (selectedLocation) {
              const wgs = Ellipsoid.WGS84.cartesianToCartographic(selectedLocation);
              // console.log(CesiumMath.toDegrees(wgs.latitude), CesiumMath.toDegrees(wgs.longitude));
              // console.log(viewer.scene);


              const posUL = viewer.camera.pickEllipsoid(new Cartesian2(0, 0), Ellipsoid.WGS84);
              const posLR = viewer.camera.pickEllipsoid(new Cartesian2(viewer.canvas.width, viewer.canvas.height), Ellipsoid.WGS84);
              const posLL = viewer.camera.pickEllipsoid(new Cartesian2(0, viewer.canvas.height), Ellipsoid.WGS84);
              const posUR = viewer.camera.pickEllipsoid(new Cartesian2(viewer.canvas.width, 0), Ellipsoid.WGS84);
              const cartUl = Ellipsoid.WGS84.cartesianToCartographic(posUL);
              const maxLat = CesiumMath.toDegrees(cartUl.latitude).toFixed(2);

              const cartUr = Ellipsoid.WGS84.cartesianToCartographic(posUR);
              const maxLon = CesiumMath.toDegrees(cartUr.longitude).toFixed(2);
              const cartLr = Ellipsoid.WGS84.cartesianToCartographic(posLR);
              const minLat = CesiumMath.toDegrees(cartLr.latitude).toFixed(2);
              const cartLl = Ellipsoid.WGS84.cartesianToCartographic(posLL);
              const minLon = CesiumMath.toDegrees(cartLl.longitude).toFixed(2);

              // console.log(maxLat, maxLon, minLat, minLon);
            } else {
              console.log('could not resolve selected Location');
            }

          }, false);

          if (this.site) {
            this.addSite(this.site);

            if (this.maxExtent) {
              this.zoomToExtent(this.maxExtent);
            }
          }
        },
        removeSite() {
          this.viewer.dataSources.remove(this.siteLayer, true);
        },
        setupCesiumViewer(mapDivId) {
          return new Viewer(mapDivId, {
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
            requestRenderMode: true, // only renders frames when changes happend
            maximumRenderTimeChange: Infinity,
          });
        },
        addSite(geoJson) {

          const bbox = tEnvelope(geoJson);
          const buffer = tBuffer(bbox, 200, { units: 'kilometers' });
          const enve = tEnvelope(buffer);

          // GeoJsonDataSource.load(buffer)
          // .then((dataSource) => {
          //   this.viewer.dataSources.add(dataSource);

          //   const entities = dataSource.entities.values;
          //   const isPoints = geoJson.type === 'MultiPoint' || geoJson.type === 'Point';

          //   entities.forEach((entity) => {
          //     // Set point style
          //     if (isPoints) {
          //       entity.billboard = {
          //         image: marker,
          //         horizontalOrigin: HorizontalOrigin.CENTER,
          //         verticalOrigin: VerticalOrigin.BOTTOM,
          //       };
          //     } else {
          //       // Set polygon style
          //       entity.polygon.material = new Color.fromCssColorString('blue').withAlpha(0.5);
          //       entity.outline = true;
          //       entity.outlineWidth = this.outlineWidth;
          //       entity.polygon.outlineColor = new Color.fromCssColorString('blue');
          //     }
          //   });

          // });

          // GeoJsonDataSource.load(enve.geometry)
          // .then((dataSource) => {
          //   this.siteLayerCameraPos = dataSource;

          //   const entities = dataSource.entities.values;
          //   // const isPoints = geoJson.type === 'MultiPoint' || geoJson.type === 'Point';

          //   entities.forEach((entity) => {
          //     // Set point style
          //     // if (isPoints) {
          //     //   entity.billboard = {
          //     //     image: marker,
          //     //     horizontalOrigin: HorizontalOrigin.CENTER,
          //     //     verticalOrigin: VerticalOrigin.BOTTOM,
          //     //   };
          //     // } else {
          //       // Set polygon style
          //       entity.polygon.material = new Color.fromCssColorString('blue').withAlpha(0.5);
          //       entity.outline = true;
          //       // entity.outlineWidth = this.outlineWidth;
          //       entity.polygon.outlineColor = new Color.fromCssColorString('blue');
          //     // }
          //   });

          // });

          GeoJsonDataSource.load(geoJson)
          .then((dataSource) => {
            this.viewer.dataSources.add(dataSource);

            this.siteLayer = dataSource;
            const entities = dataSource.entities.values;

            const isPoints = geoJson.type === LOCATION_TYPE_MULTIPOINT || geoJson.type === LOCATION_TYPE_POINT;

            entities.forEach((entity) => {
              // Set point style
              if (isPoints) {
                entity.billboard = {
                  image: marker,
                  horizontalOrigin: HorizontalOrigin.CENTER,
                  verticalOrigin: VerticalOrigin.BOTTOM,
                  alpha: 0.65,
                };
              } else {
                // Set polygon style
                entity.polygon.material = new Color.fromCssColorString(this.color).withAlpha(0.5);
                entity.outline = true;
                // entity.outlineWidth = this.outlineWidth;
                entity.polygon.outlineColor = new Color.fromCssColorString(this.color);
              }
            });
          });
        },
        zoomIn(mapId) {
          if (this.mapDivId !== mapId) {
            return;
          }

          this.viewer.camera.zoomIn();
        },
        zoomOut(mapId) {
          if (this.mapDivId !== mapId) {
            return;
          }

          this.viewer.camera.zoomOut();
        },
        triggerCenter(mapId) {
          if (this.mapDivId !== mapId) {
            return;
          }

          this.zoomToExtent(this.maxExtent);
        },
        zoomToExtent(bbox) {

          // reset camera to world view, seeing the globe
          this.viewer.camera.lookAtTransform(Matrix4.IDENTITY);

          // const buffer = tBuffer(this.site, 100, { units: 'kilometers' });

          // const enve = tEnvelope(buffer);

          // this.viewer.zoomTo(this.siteLayerCameraPos, new HeadingPitchRange(0, -90, 0));

          let dest = this.siteLayer;

          if (this.site.type === LOCATION_TYPE_POLYGON) {
            this.viewer.flyTo(dest, {
              duration: 1,
              offset: new HeadingPitchRange(0, -90, 0),
            });
          } else {

            dest = Rectangle.fromDegrees(bbox.minx, bbox.miny, bbox.maxx, bbox.maxy);
            // dest = this.siteLayerCameraPos;
            // this.viewer.flyTo(dest, {
            //   duration: 1,
            //   offset: new HeadingPitchRange(0, -90, 0),
            // });
            this.viewer.camera.setView({ destination: dest });
          }

            // this.viewer.flyTo(dest, {
            //   duration: 1,
            //   offset: new HeadingPitchRange(0, -90, 0),
            // });

          // const centroid = tCentroid(this.site);
          // const long = centroid.geometry.coordinates[0];
          // const lat = centroid.geometry.coordinates[1];
          // const dest = Cartographic.fromDegrees(long, lat, 10000);

          // this.viewer.camera.setView({
          //   // destination: dest,
          //   destination: Rectangle.fromDegrees(bbox.minx, bbox.miny, bbox.maxx, bbox.maxy),
          //   // orientation: new HeadingPitchRange(0, -90, 0),
          // });
        },
        replaceLayer() {
          if (this.mapLayer) {
            this.viewer.imageryLayers.remove(this.mapLayer);
            this.mapLayer = null;
          }
          // Attention: new WebMapServiceImageryProvider can not be used as removable layer object
          this.mapLayer = this.viewer.imageryLayers.addImageryProvider(cesiumLayer(this.wmsLayer));
        },
        replaceBasemap() {
          if (this.basemapLayer) {
            this.viewer.imageryLayers.remove(this.basemapLayer);
            this.basemapLayer = null;
          }
          this.basemapLayer = this.baseMapLayerName === 'streets' ? this.streets : this.satellite;
          this.basemapLayer = this.viewer.imageryLayers.addImageryProvider(this.basemapLayer, 0);
        },
      },
      watch: {
        opacity() {
          this.mapLayer.alpha = this.opacity / 100;
        },
        wmsLayer: {
          handler() {
            this.replaceLayer();
          },
          deep: true,
        },
        baseMapLayerName() {
          this.replaceBasemap();
        },
        site: {
          handler() {
            if (this.site) {
              this.addSite(this.site);
            } else {
              this.removeSite();
            }
          },
          deep: true,
        },
      },
      data: () => ({
        marker,
        marker2x,
        markerShadow,
        viewer: null,
        mapLayer: null,
        basemapLayer: null,
        siteLayer: null,
        siteLayerCameraPos: null,
        LOCATION_TYPE_POLYGON,
      }),
    };
</script>

<style scoped>
  .cesiumContainer {
    position: relative;
    line-height:0;
  }

  #credits {
    font-size: 8pt;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 8px 6px 10px 6px;
    z-index: 999;
    background-color: aliceblue;
    font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
  }

  .basemap-toggle {
    position: absolute;
    bottom: 20px;
    right: 8px;
    z-index: 10000;
  }
</style>

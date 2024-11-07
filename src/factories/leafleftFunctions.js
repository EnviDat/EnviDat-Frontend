
import {
  divIcon,
  icon as createIcon,
  Icon,
  marker as createMarker,
  polygon as createPolygon,
} from 'leaflet';

// Solution to loading in the imgs correctly via webpack
// see more https://github.com/PaulLeCam/react-leaflet/issues/255
/*
import marker from '@/assets/map/marker-icon.png';
import marker2x from '@/assets/map/marker-icon-2x.png';
import selectedMarker from '@/assets/map/selected-marker-icon.png';
import selectedMarker2x from '@/assets/map/selected-marker-icon-2x.png';
*/
import markerShadow from '@/assets/map/marker-shadow.png';

import { EDNA_MODE } from '@/store/metadataMutationsConsts';
import { mdiMapMarker, mdiMapMarkerMultiple } from '@mdi/js';



export function getPointIcon(dataset, modeData, selected, multiMarker = false) {
  const iconOptions = Icon.Default.prototype.options;
  // use the defaultoptions to ensure that all untouched defaults stay in place

  if (modeData && modeData.name !== EDNA_MODE && modeData.icons) {
    let iconUrl = Object.values(modeData.icons)[0];
    let extraValue = dataset[modeData.extrasKey];

    if (extraValue) {
      extraValue = extraValue.toLowerCase();
      iconUrl = modeData.icons[extraValue];
    }

    return createIcon({
      ...iconOptions,
      iconUrl,
      iconRetinaUrl: iconUrl,
      iconShadowUrl: markerShadow,
      iconSize: [30, 30],
      className: 'swissFL_icon',
    })
  }

  iconOptions.iconSize = [30, 30];
  iconOptions.html = `
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          class="v-icon__svg"
          role="img"
          preserveAspectRatio="none"
          style="color: ${ selected ? '#00897b' : 'black' }"
        >
          <path d="${ multiMarker ? mdiMapMarkerMultiple : mdiMapMarker}" transform="scale(1.25, 1.25)"></path>
        </svg>
      `;

  return divIcon(iconOptions);
}

export function getPoint(dataset, coords, id, title, selected, onClick, modeData, multiMarker = false) {
  const icon = getPointIcon(dataset, modeData, selected, multiMarker);

  let opacity = null;

  if (modeData && modeData.icons) {
    opacity = selected ? 1 : 0.65;
  } else {
    opacity = selected ? 0.8 : 0.65;
  }

  const point = createMarker(coords, {
    icon,
    opacity,
    riseOnHover: true,
  });

  point.id = id;
  point.title = title;
  point.on({
    click: (e) => {
      onClick(e.target.id);
    },
    mouseover: (e) => {
      e.target.bindPopup(`<p>${e.target.title}</p>`)
        .openPopup();
    },
    mouseout: (e) => {
      e.target.closePopup();
    },
  });

  return point;
}

export function getPolygon(coords, id, title, selected, onClick) {
  // create a polygon from an array of LatLng points
  // var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
  const polygon = createPolygon(coords, {
    color: selected ? '#00897b' : '#ffd740',
    opacity: 0.45,
    fillOpacity: 0,
  });

  polygon.on({ click: onClick });
  polygon.id = id;
  polygon.title = title;

  return polygon;
}

export function getMultiPoint(dataset, coords, id, title, selected, onClick, modeData) {
  const points = [];

  for (let i = 0; i < coords.length; i++) {
    const pointCoord = coords[i];
    const point = getPoint(dataset, pointCoord, id, title, selected, onClick, modeData, true);
    points.push(point);
  }

  return points;
}

export function getMultiPolygon(coords, id, title, selected, onClick) {
  const polys = [];

  for (let i = 0; i < coords.length; i++) {
    const pointCoord = coords[i];
    const poly = getPolygon(pointCoord, id, title, selected, onClick);
    polys.push(poly);
  }

  return polys;
}

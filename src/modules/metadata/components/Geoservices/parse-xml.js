const fs = require('fs');
const axios = require('axios');
const parseString = require('xml2js').parseString;

let xml;

// eslint-disable-next-line no-extend-native
Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

function getDates(startDate, stopDate) {
  const dateArray = new Array();
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}


axios.get('http://map.wsl.ch/cgi-bin/envidat/map.fcgi?REQUEST=Getcapabilities&SERVICE=WMS')
  .then((res) => {
    xml = res.data;
    parseString(xml, (err, result) => {
      const layers = result.WMS_Capabilities.Capability[0].Layer[0].Layer;
      const data = {
        baseURL: 'http://map.wsl.ch/cgi-bin/envidat/map.fcgi',
        bbox: {
          minx: 0.659965,
          miny: 45.4183,
          maxx: 10.8344,
          maxy: 48.7495,
        },
        timeseries: true,
        layers: [],
      };
      const dates = getDates(new Date(2015, 0, 1), new Date().addDays(300));
      let count = 0;
      layers.forEach((layer) => {
        const date = dates[count];
        const name = layer.Name[0];
        const dateString = name.split('V_1_0')[1];
        if (!dateString) return;
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1).toString()).slice(-2);
        const day = ('0' + date.getDate().toString()).slice(-2);

        const jsonlayer = {
          name: layer.Name[0],
          title: layer.Title[0],
          visibility: count === 0,
          timestamp: `${year}-${month}-${day}`,
          value: 1,
        };
        data.layers.push(jsonlayer);
        count++;

      });

      fs.writeFileSync('geoservice_chelsa_parsed.json', JSON.stringify(data));


    });
  });

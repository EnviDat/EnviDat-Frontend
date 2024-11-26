const ruBarColors = () => {
  const barColors = [
    '#874540','#954D59','#9C5A74','#9B6A90','#907DA8','#7D92BC','#62A5C7','#45B8C8','#38C9C1','#4DD8B1','#75E59C','#A3EF86','#D5F673',
//  "#3F1D1E","#512933","#5E374A","#644964","#635D7D","#597392","#4989A2","#369FA9","#31B4A9","#4AC8A0","#72DA92","#A1E981","#D5F673"
//  "#F0807D","#F3859B","#ED90B8","#DC9ED3","#C2AFE7","#A0C0F3","#7ACFF4","#57DCEC","#49E6DA","#5CEEC1","#81F3A6","#ABF68B","#D6F675"  
  ];
  return barColors.reverse();
}

export const organizationSeries = (orgaDatasetMap ) => {

  const series = [];
  const keys = Array.from(orgaDatasetMap.keys());

  for (const [orgaName, value] of orgaDatasetMap) {
    const index = keys.indexOf(orgaName);
    const data = [];

    const yearMap = value.yearMap;

    for (const year of yearMap.keys()) {
      const amount = yearMap.get(year)?.length || 0;
      data.push(amount);
    }

    series.push({
      name: orgaName,
      data,
      color: ruBarColors()[index],
      /*
      dataSorting: {
        enabled: true,
        matchByName: true
      },
      */
    });
  }

  return series;
}

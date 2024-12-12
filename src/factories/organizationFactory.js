import { toRaw } from 'vue';

const ruBarColors = () => {
  const barColors = [
    '#874540','#954D59','#9C5A74','#9B6A90','#907DA8','#7D92BC','#62A5C7','#45B8C8','#38C9C1','#4DD8B1','#75E59C','#A3EF86','#D5F673',
//  "#3F1D1E","#512933","#5E374A","#644964","#635D7D","#597392","#4989A2","#369FA9","#31B4A9","#4AC8A0","#72DA92","#A1E981","#D5F673"
//  "#F0807D","#F3859B","#ED90B8","#DC9ED3","#C2AFE7","#A0C0F3","#7ACFF4","#57DCEC","#49E6DA","#5CEEC1","#81F3A6","#ABF68B","#D6F675"  
  ];
  return barColors.reverse();
}

export const getYearDatasetMap = (datasets) => {

  const yearMap = new Map();

  for (const dSet of datasets) {

    let year
    try {
      year = JSON.parse(dSet.publication).publication_year;
    } catch (e) {
      console.error(`JSON.parse error: ${e}`);
    }

    if (year) {
      if (typeof year === 'number') {
        year = year.toString()
      }

      if (yearMap.has(year)) {
        const dList = yearMap.get(year);
        dList.push(dSet);
      } else {
        yearMap.set(year, [dSet]);
      }
    }
  }

  return yearMap;
}

export const getOraganizationsFromMap = (orgaDatasetsMap) => {

  const organizations = [];

  // eslint-disable-next-line no-unused-vars
  for (const [orgaTitle, entry] of orgaDatasetsMap) {
    organizations.push(entry.organization);
  }

  return organizations;
}

export const getOrgaDatasetsMap = (datasets, groupForResearchUnit = false) => {
  const datasetMap = new Map();

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    let key = groupForResearchUnit ? dataset.ruName : dataset.organization.name;
    // in the groups the organizations are referenced by "name" which has '-' instead of spaces
    key = key.replaceAll(' ', '-');
    key = key.toLowerCase();

    if (key) {
      const orgaDatasets = datasetMap.get(key);
      if (orgaDatasets) {

        orgaDatasets.count += 1
        orgaDatasets.datasets.push(dataset);
      } else {
        datasetMap.set(key, {
          count: 1,
          organization: dataset.organization,
          datasets: [dataset],
          name: dataset.organization.name,
          title: dataset.organization.title,
        });
      }
    }
  }

  const keys = datasetMap.keys();

  for (const k of keys) {
    const orga = datasetMap.get(k);
    const orgaDatasets = orga.datasets;
    orga.yearMap = getYearDatasetMap(orgaDatasets);
  }

  return datasetMap;
}

export const organizationSeries = (orgaDatasetsMap, yearLabels) => {

  const series = [];
  const keys = Array.from(orgaDatasetsMap.keys());

  for (const [orgaName, value] of orgaDatasetsMap) {
    const orgaTitle = value.title;
    const index = keys.indexOf(orgaName);
    const data = [];
    const yearMap = value.yearMap;

    for (const year of yearLabels) {
      const amount = yearMap.get(year)?.length || null;
      data.push(amount);
    }

    series.push({
      label: orgaTitle,
      data,
      backgroundColor: ruBarColors()[index],
    });
  }

  return series;
}

export function getResearchUnit(orgaTitle, researchUnits) {
  const units = researchUnits.researchUnits;
  const orgaTitleLower = orgaTitle.toLowerCase();

  for (let i = 0; i < units.length; ++i) {
    const unit = units[i];
    const ruName = unit.name;
    const ruNameLower = unit.name.toLowerCase();

    if (ruNameLower.includes(orgaTitleLower)) {
      return ruName;
    }

    if (unit.groups.length > 0) {
      const groups = unit.groups;

      for (let j = 0; j < groups.length; ++j) {
        const groupName = groups[j].toLowerCase();

        if (groupName.includes(orgaTitleLower)) {
          return ruName;
        }
      }
    }

  }

  return 'Others';
}

export function enhanceDatasetWithResearchUnit(datasets, researchUnits) {
  const ruDatasets = [];

  for (let i = 0; i < datasets.length; ++i) {
    const dSet = toRaw(datasets[i]);

    const orgaTitle = dSet.organization.title;
    // research units have the title with CamelCase and spaces
    dSet.ruName = getResearchUnit(orgaTitle, researchUnits);

    ruDatasets.push(dSet);
  }

  return ruDatasets;
}


export function getOrganizationMap(organizations) {

  const organizationMap = new Map();

  if (!organizations) {
    return organizationMap;
  }

  for (let i = 0; i < organizations.length; i++) {
    const orga = organizations[i];
    let key = orga.name;

    if (orga.groups?.length > 0) {
      key = orga.groups[0].name;
    }

    const orgaEntry = organizationMap.get(key);
    if (orgaEntry) {
      orgaEntry.childOrganizations.push(orga);
    } else {
      organizationMap.set(key, {
        name: key,
        title: orga.title,
        childOrganizations: [orga],
      });
    }
  }

  return organizationMap;
}

export const getOrganitzionTreeItem = (entries, id) => {

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    if (entry.id === id) {
      return entry;
    }

    if (entry.children?.length > 0) {
      const childEntry = getOrganitzionTreeItem(entry.children, id);
      if (childEntry) {
        return childEntry;
      }
    }
  }

  return null;
}

function getTreeItem(organizationMap, organizationDatasetMap, organization, index) {

  const orgaName = organization.name;
  const children = [];

  const childrendOrgas = organizationMap.get(orgaName);

  const orgaDatasetEntry = organizationDatasetMap?.get(orgaName);
  const datasetCount = orgaDatasetEntry?.count || 0;

  if (childrendOrgas?.length > 0) {

    for (let i = 0; i < childrendOrgas.length; i++) {
      const childOrga = childrendOrgas[i];

      if (childOrga.name !== orgaName) {
        const child = getTreeItem(organizationMap, organizationDatasetMap, childOrga, index);
        children.push(child);
        index = child.id;
      }
    }
  }

  return {
    id: ++index,
    title: organization.title || orgaName,
    name: orgaName,
    datasetCount,
    children,
  }
}

export function getOrganizationTree(organizationMap, organizationDatasetMap = undefined) {

  const orgaNames = Array.from(organizationMap.keys()).sort();
  const treeItems = [];
  let index = 0;

  for (const orgaName of orgaNames) {

    const orgaEntry = organizationMap.get(orgaName);
    const orgaTitle = orgaEntry.title;
    const childOrganizations = orgaEntry.childOrganizations;
    const orgaDatasetEntry = organizationDatasetMap?.get(orgaName);
    const datasetCount = orgaDatasetEntry?.count || 0;

    const children = []

    if (childOrganizations.length > 0) {
      for (let i = 0; i < childOrganizations.length; i++) {
        const orga = childOrganizations[i];

        if (orga.name !== orgaName) {
          const childItem = getTreeItem(organizationMap, organizationDatasetMap, orga, index);
          children.push(childItem);
          index = childItem.id;
        }
      }
    }

    treeItems.push({
      id: ++index,
      title: orgaTitle,
      name: orgaName,
      datasetCount,
      children,
    });
  }

  return treeItems;
}


export const researchUnitDatasetChartOptions = {
  plugins: {
    title: {
      display: true,
      text: 'Dataset Publication per Research Unit History',
    },
    legend: {
      position: 'right',
    },
    datalabels: {
      color: '#d9f3f3',
      textStrokeColor: '#222222',
      textStrokeWidth: 2,
    },
  },
  animations: {
    colors: 'show',
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
}

export const getResearchUnitDatasetSeries = (orgaDatasetsMap) => {
  if (!orgaDatasetsMap) {
    return {
      labels: [],
      datasets: [],
    };
  }

  const yearLables = new Set();

  // eslint-disable-next-line no-unused-vars
  for (const [orgaTitle, value] of orgaDatasetsMap) {
    const yearMap = value.yearMap;

    for (const year of yearMap.keys()) {
      yearLables.add(year);
    }
  }

  const yearsSorted = Array.from(yearLables).sort();

  const series = organizationSeries(orgaDatasetsMap, yearsSorted);

  return {
    labels: yearsSorted,
    datasets: series,
  };
}

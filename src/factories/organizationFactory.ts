import { toRaw } from 'vue';
import { DatasetOrganizationMapEntry } from '@/types/modelTypes';
import type { DatasetDTO, OrganizationDTO } from '@/types/dataTransferObjectsTypes';

const toPascalCase = (text, trimSpace=false) => text.split(' ').map((t) => t[0].toUpperCase() + t.slice(1).toLowerCase()).join(trimSpace?'':' ');

const ruBarColors = () => {
  const barColors = [
    '#874540','#954D59','#9C5A74','#9B6A90','#907DA8','#7D92BC','#62A5C7','#45B8C8','#38C9C1','#4DD8B1','#75E59C','#A3EF86','#D5F673',
//  "#3F1D1E","#512933","#5E374A","#644964","#635D7D","#597392","#4989A2","#369FA9","#31B4A9","#4AC8A0","#72DA92","#A1E981","#D5F673"
//  "#F0807D","#F3859B","#ED90B8","#DC9ED3","#C2AFE7","#A0C0F3","#7ACFF4","#57DCEC","#49E6DA","#5CEEC1","#81F3A6","#ABF68B","#D6F675"  
  ];
  return barColors.reverse();
}

export const getYearDatasetMap = (datasets: DatasetDTO[]) => {

  const yearMap: Map<string, DatasetDTO[]> = new Map();

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

export const getTopOrganizations = (orgas: OrganizationDTO[]) => {

  const top = [];

  if (!orgas) {
    return top;
  }

  for (const orga of orgas) {
    if (orga.groups?.length <= 0) {
      top.push(orga);
    }
  }

  return top;
}

export const getOrgaDatasetsMap = (datasets, groupForResearchUnit = false) => {
  const datasetMap: Map<string, DatasetOrganizationMapEntry> = new Map();

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
          datasets: [dataset],
/*
          organization: dataset.organization,
          name: dataset.organization.name,
          title: dataset.organization.title,
*/
        } as DatasetOrganizationMapEntry);
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

export const organizationSeries = (orgaDatasetsMap : Map<string, DatasetOrganizationMapEntry>, yearLabels) => {

  const series = [];
  const keys = Array.from(orgaDatasetsMap.keys());

  for (const [orgaName, value] of orgaDatasetsMap) {
    const index = keys.indexOf(orgaName);
    const data = [];
    const yearMap = value.yearMap;

    for (const year of yearLabels) {
      const amount = yearMap.get(year)?.length || null;
      data.push(amount);
    }

    series.push({
      label: toPascalCase(orgaName.replaceAll('-', ' ')),
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
    const ruNameLower = unit.name.toLowerCase();

    if (ruNameLower.includes(orgaTitleLower)) {
      return unit.name;
    }

    if (unit.groups.length > 0) {
      const groups = unit.groups;

      for (let j = 0; j < groups.length; ++j) {
        const groupName = groups[j].toLowerCase();

        if (groupName.includes(orgaTitleLower)) {
          return unit.name;
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


export function getOrganizationRelationMap(organizations : OrganizationDTO[]) {

  const organizationRelationMap : Map<string, OrganizationDTO[]> = new Map();

  if (!organizations) {
    return organizationRelationMap;
  }

  for (let i = 0; i < organizations.length; i++) {
    const orga = organizations[i];
    let key = orga.name;

    if (orga.groups?.length > 0) {
      key = orga.groups[0].name;
    }

    const orgaEntry = organizationRelationMap.get(key);
    if (orgaEntry) {
      orgaEntry.push(orga);
    } else {
      organizationRelationMap.set(key, [orga]);
/*
      organizationRelationMap.set(key, {
        name: orgaName,
        title: orga.title,
        childOrganizations: [orga],
      });
*/
    }
  }

  return organizationRelationMap;
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

function getTreeItem(
  organizationRelationMap : Map<string, OrganizationDTO[]>,
  organizationDatasetMap : Map<string, DatasetOrganizationMapEntry>,
  organization: OrganizationDTO,
  index,
  ) {

  const orgaName = organization.name;
  const orgaTitle = organization.title;

  const childrendOrgas = organizationRelationMap.get(orgaName);

  const orgaDatasetEntry = organizationDatasetMap?.get(orgaName);
  const datasetCount = orgaDatasetEntry?.count || 0;

  const childItems = [];
  let childDatasetsCount = 0;

  if (childrendOrgas?.length > 0) {

    for (let i = 0; i < childrendOrgas.length; i++) {
      const childOrga = childrendOrgas[i];

      if (childOrga.name !== orgaName) {
        const child = getTreeItem(organizationRelationMap, organizationDatasetMap, childOrga, index);
        childDatasetsCount += child.datasetCount + child.childDatasetsCount;
        childItems.push(child);
        index = child.id;
      }
    }
  }

  const item = {
    id: ++index,
    title: orgaTitle,
    name: orgaName,
    datasetCount,
    childDatasetsCount,
    children: childItems,
  };

/*
  if (childItems?.length > 0) {
    item.children = childItems;
  }
*/

  return item;
}

export function getOrganizationTree(
  topOrganizations : OrganizationDTO[],
  organizationRelationMap : Map<string, OrganizationDTO[]>,
  organizationDatasetMap : Map<string, DatasetOrganizationMapEntry> = undefined,
) {

  // const orgaNames = Array.from(organizationRelationMap.keys()).sort();
  const organizations = topOrganizations.sort();

  const treeItems = [];
  let index = 0;

  for (let i = 0; i < organizations.length; i++) {
    const topOrga = organizations[i];
    const orgaName = topOrga.name;

    const childOrganizations = organizationRelationMap.get(orgaName);
    const orgaDatasetEntry = organizationDatasetMap?.get(orgaName);
    const datasetCount = orgaDatasetEntry?.count || 0;

    const childItems = []
    let childDatasetsCount = 0;

    if (childOrganizations.length > 0) {
      for (let j = 0; j < childOrganizations.length; j++) {
        const orga = childOrganizations[j];

        if (orga.name !== orgaName) {
          const childItem = getTreeItem(organizationRelationMap, organizationDatasetMap, orga, index);
          childDatasetsCount += childItem.datasetCount + childItem.childDatasetsCount;
          childItems.push(childItem);
          index = childItem.id;
        }
      }
    }

    const item = {
      id: ++index,
      title: toPascalCase(orgaName.replaceAll('-', ' ')),
      name: orgaName,
      datasetCount,
      childDatasetsCount,
      children: childItems,
    };

/*
    if (childItems?.length > 0) {
      item.children = childItems;
    }
*/

    treeItems.push(item);
  }

  return treeItems;
}

export const organizationDatasetHistoryOptions = {
  plugins: {
    title: {
      display: true,
      text: 'Dataset Publication History',
    },
    legend: {
      position: 'top',
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
}

export const researchUnitDatasetChartOptions = {
  plugins: {
    title: {
      display: true,
      text: 'Dataset Publication per Research Unit History',
    },
    legend: {
      position: (ctx: { chart: { width: number; }; }) => ctx?.chart?.width < 968 ? 'bottom' : 'right',
      reverse: 'true',
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
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
}

export const getResearchUnitDatasetSeries = (orgaDatasetsMap : Map<string, DatasetOrganizationMapEntry>) => {
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

export function getOrganizationFromRelationMap(orgaNameToFind :string, orgaRelationMap : Map<string, OrganizationDTO[]>) : OrganizationDTO | null {

  if (!orgaNameToFind || !orgaRelationMap) {
    return null;
  }

  const orgaNames = Array.from(orgaRelationMap.keys());

  for (let i = 0; i < orgaNames.length; i++) {
    const orgaName = orgaNames[i];

    const childOrgas = orgaRelationMap.get(orgaName);

    if (childOrgas.length > 0) {
      for (let j = 0; j < childOrgas.length; j++) {
        const childOrga = childOrgas[j];

        if (childOrga.name === orgaNameToFind) {
          return childOrga;
        }
      }
    }
  }

  return null;
}

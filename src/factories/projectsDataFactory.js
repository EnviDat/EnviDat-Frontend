/**
 * function factory for project object enhancing methods by parsing
 * the json from the backend.
 *
 * @summary function factory for project object enhancing methods
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:07:03 
 * Last modified  : 2019-11-20 16:08:39
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
function assignParent(currentProject, extra, projects) {
  const parentTitle = extra.value.trim();
  let parent = null;

  for (let l = 0; l < projects.length; l++) {
    const p = projects[l];
    if (p.title === parentTitle) {
      parent = p;
      break;
    }
  }

  if (parent) {
    currentProject.parent = parent;
  } else {
    currentProject.parent = extra.value;
  }
}

function assignSubprojects(project, extra, projects) {
  const splits = extra.value.split(',');
  project.subProjects = [];

  for (let k = 0; k < splits.length; k++) {
    const sub = splits[k].trim();

    const matchedProject = projects.filter(p => p.title.includes(sub));
    if (matchedProject.length >= 1) {
      project.subProjects.push(matchedProject[0]);
    }
  }

}

export function enhanceSubprojectsFromExtras(projects) {
  if (!projects) return [];

  const projectsWithExtras = projects.filter(p => typeof p.extras === 'object' && p.extras instanceof Array);

  for (let i = 0; i < projectsWithExtras.length; i++) {
    const project = projectsWithExtras[i];

    for (let j = 0; j < project.extras.length; j++) {
      const extra = project.extras[j];
      
      if (extra.key === 'subprojects') {
        assignSubprojects(project, extra, projects);
      }

      if (extra.key === 'parent') {
        assignParent(project, extra, projects);
      }
    }
  }

  return projects;
}

export function enhanceProjectsDatasets(projects, allDatasets) {
  if (!projects || !allDatasets) return [];

  const projectsWithPackages = projects.filter(p => p && p.packages && p.packages.length > 0);

  for (let i = 0; i < projectsWithPackages.length; i++) {
    const proj = projectsWithPackages[i];

    for (let j = 0; j < proj.packages.length; j++) {
      const dataset = proj.packages[j];
      const fullDataset = allDatasets[dataset.id];

      if (!dataset.tags && fullDataset) {
        // the tags of each dataset has to be looked up in the allDatasets (metadataContents)
        // because the backend call doesn't deliver the packages with the tags
        // it can only delivery the tags for the projects, which is no use for this case
        dataset.tags = fullDataset.tags;
      }
    }

  }

  return projects;
}

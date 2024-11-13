import BaseDatasetPicker from '@/components/BaseElements/BaseDatasetPicker.vue';
import unFormatedProjects from './js/groupList';

export default {
  title: '1 Base / Pickers / Dataset Picker',
  component: BaseDatasetPicker,
};

// in the real application you can use GET_PROJECTS project actions, see an example in ProjectDetailPage.vue

const formattedProject = [];

const formatString = str =>
  str
    .replace(/[-_]/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());

unFormatedProjects.forEach(prj => {
  formattedProject.push(formatString(prj));
});

const data = {
  projects: formattedProject,
  preSelectedProject: formattedProject.slice(0, 3),
};

// function to format the data, use the same function in the parent component in the real application

const argTypes = {
  blur: { action: 'blur' },
  removedUsers: { action: 'removedUsers' },
  pickedDataset: { action: 'pickedDataset' },
};

export const DataSetPicker = {
  args: {
    projects: data.projects,
  },
  argTypes: { ...argTypes },
};

export const DataSetPickerPreSelection = {
  args: {
    preSelected: data.preSelectedProject,
    projects: data.projects,
  },
  argTypes: { ...argTypes },
};
export const DataSetPickerPreSelectionMultipleAndClearable = {
  args: {
    preSelected: data.preSelectedProject,
    projects: data.projects,
    multiplePick: true,
    isClearable: true,
    instructions: 'Instructions',
  },
  argTypes: { ...argTypes },
};

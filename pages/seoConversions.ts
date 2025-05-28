import { DatasetDTO } from '@/types/modelTypes';

function cropString(str: string, maxLength: number, ending: string | undefined) {
  if (!str) { return '' }

  if (str.length > maxLength) {
    return str.substring(0, maxLength);
  }
  return ending ? str + ending : str;
}

export const getSeoSanitizedDataset = (dataset: DatasetDTO): DatasetDTO => {
  if (!dataset) {
    return {
      title: '',
      notes: '',
    }
  }

  return {
    title: cropString(dataset.title, 50, '...'),
    notes: cropString(dataset.notes, 155, '...'),
  } as Partial<DatasetDTO>
}


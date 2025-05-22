import { DatasetDTO } from '@/types/modelTypes';

function cropString(str: string, maxLength: number, ending: string | undefined) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength);
  }
  return ending ? str + ending : str;
}

export const getSeoSanitizedDataset = (dataset: DatasetDTO): DatasetDTO => ({
    title: cropString(dataset.title, 50, '...'),
    notes: cropString(dataset.notes, 155, '...'),
  } as Partial<DatasetDTO>
)


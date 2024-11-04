import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export const isValidId = (id: string) => {
  return uuidValidate(id);
}
import { IConcerto } from 'app/entities/concerto/concerto.model';

export interface IFoto {
  id?: number;
  concerto?: IConcerto | null;
}

export class Foto implements IFoto {
  constructor(public id?: number, public concerto?: IConcerto | null) {}
}

export function getFotoIdentifier(foto: IFoto): number | undefined {
  return foto.id;
}

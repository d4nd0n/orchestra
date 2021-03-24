import { ICorso } from 'app/entities/corso/corso.model';

export interface IInsegnante {
  id?: number;
  nomeInsegnante?: string | null;
  corsos?: ICorso[] | null;
}

export class Insegnante implements IInsegnante {
  constructor(public id?: number, public nomeInsegnante?: string | null, public corsos?: ICorso[] | null) {}
}

export function getInsegnanteIdentifier(insegnante: IInsegnante): number | undefined {
  return insegnante.id;
}

import { ICorso } from 'app/entities/corso/corso.model';

export interface ICliente {
  id?: number;
  nomeCliente?: string | null;
  corsos?: ICorso[] | null;
}

export class Cliente implements ICliente {
  constructor(public id?: number, public nomeCliente?: string | null, public corsos?: ICorso[] | null) {}
}

export function getClienteIdentifier(cliente: ICliente): number | undefined {
  return cliente.id;
}

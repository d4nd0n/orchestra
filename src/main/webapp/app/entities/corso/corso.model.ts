import { IConcerto } from 'app/entities/concerto/concerto.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { IInsegnante } from 'app/entities/insegnante/insegnante.model';

export interface ICorso {
  id?: number;
  anno?: string | null;
  concertos?: IConcerto[] | null;
  clientes?: ICliente[] | null;
  insegnantes?: IInsegnante[] | null;
}

export class Corso implements ICorso {
  constructor(
    public id?: number,
    public anno?: string | null,
    public concertos?: IConcerto[] | null,
    public clientes?: ICliente[] | null,
    public insegnantes?: IInsegnante[] | null
  ) {}
}

export function getCorsoIdentifier(corso: ICorso): number | undefined {
  return corso.id;
}

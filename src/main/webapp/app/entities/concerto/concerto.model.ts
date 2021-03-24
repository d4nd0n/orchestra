import * as dayjs from 'dayjs';
import { IFoto } from 'app/entities/foto/foto.model';
import { IVideo } from 'app/entities/video/video.model';
import { ICorso } from 'app/entities/corso/corso.model';

export interface IConcerto {
  id?: number;
  date?: dayjs.Dayjs | null;
  hours?: string | null;
  location?: string | null;
  fotos?: IFoto[] | null;
  videos?: IVideo[] | null;
  corso?: ICorso | null;
}

export class Concerto implements IConcerto {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public hours?: string | null,
    public location?: string | null,
    public fotos?: IFoto[] | null,
    public videos?: IVideo[] | null,
    public corso?: ICorso | null
  ) {}
}

export function getConcertoIdentifier(concerto: IConcerto): number | undefined {
  return concerto.id;
}

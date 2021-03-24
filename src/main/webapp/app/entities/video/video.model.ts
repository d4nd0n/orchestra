import { IConcerto } from 'app/entities/concerto/concerto.model';

export interface IVideo {
  id?: number;
  concerto?: IConcerto | null;
}

export class Video implements IVideo {
  constructor(public id?: number, public concerto?: IConcerto | null) {}
}

export function getVideoIdentifier(video: IVideo): number | undefined {
  return video.id;
}

import { User } from './user';
import { SongDTO } from './song';
import { MusicStyle } from './musicStyle';

export interface Band {
    id?: number;
    name: string;
    shortDescription: string;
    country: string;
    bandLogo: string;
    formedDate: Date;
    styles: MusicStyle[];
    bandMembers: User[];
    songs: SongDTO[];
}
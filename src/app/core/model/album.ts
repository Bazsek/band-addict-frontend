import { SongDTO } from './song';

export interface Album {
    id?: number;
    name: string;
    description: string;
    coverPhoto: string;
    createdAt: Date;
    songs: SongDTO[];
}
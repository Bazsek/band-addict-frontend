import { User } from './user';

export interface Sheet {
    id?: number;
    title: string;
    instrument: string;
    name: string;
    createdAt?: Date;
}
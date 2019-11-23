import { User } from 'firebase';

export interface Event {
    id?: number;
    title: string;
    description: string;
    start: Date;
    end?: Date;
    type: string;
}
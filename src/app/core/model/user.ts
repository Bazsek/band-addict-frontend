import { Instrument } from './instrument';
import { Band } from './band';
import { Sheet } from './sheet';

export interface User {
    id?: number;
    email: string;
    name: string;
    password: string;
    role: string;
    profilePicture: string;
    description: string;
    nickName: string;
    phoneNumber: string;
    instruments: Instrument[];
    band: Band;
}
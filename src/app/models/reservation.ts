import {UserPublic} from "./userPublic";

export interface Reservation {
  id: string;
  date: string; // ISO date string
  nbrPeople: number;
  user: UserPublic;
  validated: boolean;
}

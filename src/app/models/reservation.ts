import {UserPublic} from "./userPublic";

export interface Reservation {
  id: string;
  date: string;
  nbrPeople: number;
  userId: string;
  userFirstname: string;
  userLastname: string;
  validated: boolean;
}


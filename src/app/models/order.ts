import {Meal} from "./meal";
import {UserPublic} from "./userPublic";

export interface Order {
  id: string;
  user: UserPublic;
  meals: Meal[];
  date: string; // ISO date string
  total: number;
  validated: boolean;
}

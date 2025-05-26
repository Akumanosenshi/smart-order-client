import {Meal} from "./meal";
import {UserPublic} from "./userPublic";

export interface Order {
  id: string;
  user: UserPublic;
  meals: Meal[];
  date: string; // ISO date string
  total: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
}

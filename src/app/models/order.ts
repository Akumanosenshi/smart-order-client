import {Meal} from "./meal";
import {UserPublic} from "./userPublic";

export interface Order {
  id: string;
  userId: string;
  userFirstname: string;
  userLastname: string;
  meals: Meal[];
  date: string;
  total: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
}


import { Timestamp } from "@angular/fire/firestore";

export interface Testimonial {
  id: string;
  authorName: string;
  authorAvatar?: string;
  testimonialText: string;
  createdAt: Timestamp;
  approved: boolean;
}
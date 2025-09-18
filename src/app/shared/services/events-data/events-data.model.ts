import { Timestamp } from "@angular/fire/firestore";

export interface EventVMData {
  id: string;
  imageSmall: string;
  imageLarge: string;
  startDateTime: Timestamp;
  endDateTime?: Timestamp;
  date: string;
  title: string;
  hosts: string[];
  description: string;
  online?: boolean;
  zoom?: Zoom;
  whatsAppGroup?: string;
  physicalLocation?: string;
  isFuture?: boolean;
  isOngoing?: boolean;
}

export interface Zoom {
  link: string;
  meetingID: string;
  passcode: string;
}
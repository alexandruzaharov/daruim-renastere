export interface Mentor {
  id: string;
  name: string;
  nameNormalized: string;
  photo: string;
  kitLinks: KitLink[];
  linkWithoutProducts: string;
}

export interface KitLink {
  kitId: string;
  link: string;
}

export interface Kit {
  id: string;
  name: string;
  img: string;
  description: string;
  retail: Price;
  wholesale: Price;
  link?: string;
}

interface Price {
  price: string;
  decimal: string;
}

export interface MonthlyMentorsDoc {
  monthlyMentors: MonthlyMentor[];
}

export interface MonthlyMentor {
  mentorId: string;
  month: number;
}

export interface EnrollVMData {
  mentors: Mentor[];
  kits: Kit[];
  selectedMentor: Mentor | null;
  defaultMentor: Mentor | null;
}
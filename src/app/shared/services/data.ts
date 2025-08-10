import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
} from '@angular/fire/firestore';
import {
  EnrollVMData,
  Kit,
  Mentor,
  MonthlyMentor,
  MonthlyMentorsDoc,
} from '@shared/models/data.model';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  shareReplay,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private firestore = inject(Firestore);
  private selectedMentorId$ = new BehaviorSubject<string | null>(null);

  private mentorsCollection = collection(this.firestore, 'mentors');
  private kitsCollection = collection(this.firestore, 'kits');
  private monthlyMentorsDoc = doc(
    this.firestore,
    'monthlyMentors/3jl5AjORuvYN09YZuXAk'
  );

  public mentors$: Observable<Mentor[]> = (
    collectionData(this.mentorsCollection, { idField: 'id' }) as Observable<Mentor[]>
  ).pipe(shareReplay(1));

  public kits$: Observable<Kit[]> = (
    collectionData(this.kitsCollection, { idField: 'id' }) as Observable<Kit[]>
  ).pipe(shareReplay(1));

  public monthlyMentors$: Observable<MonthlyMentor[]> = (
    docData(this.monthlyMentorsDoc) as Observable<MonthlyMentorsDoc>
  ).pipe(
    map((data) => data.monthlyMentors),
    shareReplay(1)
  );

  public vm$: Observable<EnrollVMData> = combineLatest([
    this.mentors$,
    this.kits$,
    this.monthlyMentors$,
    this.selectedMentorId$
  ]).pipe(
    map(([mentors, kits, monthlyMentors, selectedMentorId]) => {
      const currentMonth: number = new Date().getMonth() + 1;
      const current: MonthlyMentor | null = monthlyMentors.find((m) => m.month === currentMonth) ?? null;

      const defaultMentor: Mentor | null = mentors.find((m) => m.id === current?.mentorId) ?? null;
      const selectedMentor: Mentor | null =
        mentors.find((m) => m.id === selectedMentorId) ??
        defaultMentor ??
        null;

      const kitsWithLinks = kits.map((kit: Kit) => {
        if (!selectedMentor) return { ...kit, link: '#' };
        const kitLink = selectedMentor.kitLinks.find((k) => k.kitId === kit.id);
        return { ...kit, link: kitLink ? kitLink.link : '#' };
      });

      return { mentors, kits: kitsWithLinks, selectedMentor, defaultMentor };
    }),
    shareReplay(1)
  );

  public selectMentor(mentorId: string | null) {
    this.selectedMentorId$.next(mentorId);
  }
}

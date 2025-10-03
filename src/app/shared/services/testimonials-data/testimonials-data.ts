import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, DocumentData, Firestore, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter, updateDoc, where } from '@angular/fire/firestore';
import { Testimonial } from './testimonials-data.model';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsData {
  private injector = inject(EnvironmentInjector);
  private firestore = inject(Firestore);
  private collectionRef = collection(this.firestore, 'testimonials');
  private lastVisibleMap = new Map<number, QueryDocumentSnapshot>();

  public getTotalCount(): Observable<number> {
    return from(
      collectionData(query(this.collectionRef, where('approved', '==', true)))
        .pipe(map(data => data.length))
    );
  }

  public getTestimonials(pageIndex: number, pageSize: number): Observable<Testimonial[]> {
    let lastVisible = this.lastVisibleMap.get(pageIndex - 1); // snapshot-ul ultimului document de pe pagina anterioară

    return runInInjectionContext(this.injector, () => {
      let q = query(
        this.collectionRef,
        where('approved', '==', true),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
  
      if (lastVisible) {
        q = query(
          this.collectionRef,
          where('approved', '==', true),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      }

      return from(getDocs(q)).pipe(
        map(snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as any)
          }));
  
          // salvăm documentul snapshot pentru pagina următoare
          if (snapshot.docs.length) {
            const lastDoc = snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot<DocumentData>;
            this.lastVisibleMap.set(pageIndex, lastDoc);
          }
  
          return items;
        })
      );
    });
  }

  public getPendingTestimonials(): Observable<Testimonial[]> {
    return runInInjectionContext(this.injector, () => {
      const q = query(
        this.collectionRef,
        where('approved', '==', false),
        orderBy('createdAt', 'desc')
      );
      return collectionData(q, { idField: 'id' }) as Observable<Testimonial[]>;
    });
  }

  public approveTestimonial(id: string): Promise<void> {
    const docRef = doc(this.firestore, `testimonials/${id}`);
    return updateDoc(docRef, { approved: true });
  }

  public deleteTestimonial(id: string): Promise<void> {
    const docRef = doc(this.firestore, `testimonials/${id}`);
    return deleteDoc(docRef);
  }
}

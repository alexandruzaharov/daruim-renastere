import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, serverTimestamp } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Testimonial } from '@shared/services/testimonials-data/testimonials-data.model';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  async uploadAvatar(file: File, testimonialId: string): Promise<string> {
    const storageRef = ref(this.storage, `testimonials/avatars/${testimonialId}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async addTestimonial(
    data: Omit<Testimonial, 'id' | 'createdAt' | 'approved'>,
    avatarFile?: File
  ): Promise<void> {
    const colRef = collection(this.firestore, 'testimonials');

    let avatarUrl: string | undefined;

    if (avatarFile) {
      const fakeId = crypto.randomUUID();
      avatarUrl = await this.uploadAvatar(avatarFile, fakeId);
    }

    await addDoc(colRef, {
      authorName: data.authorName,
      testimonialText: data.testimonialText,
      ...(avatarUrl ? { authorAvatar: avatarUrl } : {}),
      approved: false,
      createdAt: serverTimestamp(),
    });
  }
}

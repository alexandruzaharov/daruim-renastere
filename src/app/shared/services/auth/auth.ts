import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { EnvironmentInjector, inject, Injectable, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { Auth, authState, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { BehaviorSubject, map, Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private functions = inject(Functions);
  private platformId = inject(PLATFORM_ID);
  private injector = inject(EnvironmentInjector);

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    if (isPlatformServer(this.platformId)) {
      this.isLoadingSubject.next(true);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      onAuthStateChanged(this.auth, async (user) => {
        this.currentUserSubject.next(user);
        if (user) {
          try {
            const token = await user.getIdTokenResult();
            this.isAdminSubject.next(!!token.claims['admin']);
          } catch (error) {
            this.isAdminSubject.next(false);
          }
        } else {
          this.isAdminSubject.next(false);
        }
        this.isLoadingSubject.next(false);
      },
      (error) => {
        console.error('Auth state error:', error);
        this.isAdminSubject.next(false);
        this.isLoadingSubject.next(false);
      });
    }
  }

  public async setAdminRole(email: string): Promise<any> {
    const setAdminRole = httpsCallable(this.functions, 'setAdminRole');
    const result = await setAdminRole( {email} );
    const user = this.auth.currentUser;

    if (user && user.email === email) {
      await user.getIdToken(true);
      const token = await user.getIdTokenResult();
      this.isAdminSubject.next(!!token.claims['admin']);
    }

    return result.data;
  }

  public isAdmin(): Observable<boolean> {
    return this.isAdmin$.pipe(take(1))
  }

  public getUser(): Observable<User | null> {
    return authState(this.auth);
  }

  public async login(email: string, password: string) {
    return runInInjectionContext(this.injector, async () => {
      try {
        this.isLoadingSubject.next(true);
        await signInWithEmailAndPassword(this.auth, email, password);
      } catch (error) {
        this.isLoadingSubject.next(false);
        console.error('Login error:', error);
        throw error;
      } finally {
        this.isLoadingSubject.next(false);
      }
    });
  }

  public async logout(): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      this.isAdminSubject.next(false);
      await signOut(this.auth);
    });
  }

  public async refreshAdminStatus(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      const token = await user.getIdTokenResult(true);
      this.isAdminSubject.next(!!token.claims['admin']);
    } else {
      this.isAdminSubject.next(false);
    }
  }

  getUsername(): Observable<string | null> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }
    return this.currentUser$.pipe(
      map(user => {
        if (user && user.email) {
          return user.email.split('@')[0];
        }
        return null;
      })
    );
  }
}

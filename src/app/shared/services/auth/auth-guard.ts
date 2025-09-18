import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';
import { combineLatest, map, of, switchMap, take } from 'rxjs';
import { isPlatformServer } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    return of(true);
  }

  return combineLatest([authService.getUser(), authService.isLoading$]).pipe(
    take(1),
    switchMap(([user, isLoading]) => {
      if (isLoading) {
        return of(false);
      }
      if (!user) {
        router.navigate(['/login']);
        return of(false);
      }
      return authService.isAdmin().pipe(
        map(isAdmin => {
          if (!isAdmin) {
            router.navigate(['/home']);
          }
          return isAdmin;
        })
      );
    })
  );
};

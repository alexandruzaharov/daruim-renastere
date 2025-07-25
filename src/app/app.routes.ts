import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'despre-noi', loadComponent: () => import('./about-us/about-us').then(c => c.AboutUs) },
    { path: 'daruim-renastere', loadComponent: () => import('./programs/give-renaissance/give-renaissance').then(c => c.GiveRenaissance) },
    { path: 'darul-animalelor', loadComponent: () => import('./programs/gift-of-animals/gift-of-animals').then(c => c.GiftOfAnimals) },
    { path: 'testimoniale', loadComponent: () => import('./testimonials/testimonials').then(c => c.Testimonials) },
    { path: 'evenimente', loadComponent: () => import('./events/events').then(c => c.Events) },
    { path: 'contact', loadComponent: () => import('./contact/contact').then(c => c.Contact) },
    { path: 'inscrie-te', loadComponent: () => import('./register/register').then(c => c.Register) },
    { path: '', loadComponent: () => import('./home/home').then(c => c.Home) },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

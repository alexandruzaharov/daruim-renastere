import { Routes } from '@angular/router';
import { authGuard } from '@shared/services/auth/auth-guard';

export const routes: Routes = [
    { path: 'despre-noi', loadComponent: () => import('./about-us/about-us').then(c => c.AboutUs) },
    { path: 'daruim-renastere', loadComponent: () => import('./events/give-renaissance/give-renaissance').then(c => c.GiveRenaissance) },
    { path: 'darul-animalelor', loadComponent: () => import('./events/gift-of-animals/gift-of-animals').then(c => c.GiftOfAnimals) },
    { path: 'evenimente-inregistrate', loadComponent: () => import('./events/video-recordings/video-recordings').then(c => c.VideoRecordings) },
    { path: 'testimoniale', loadComponent: () => import('./testimonials/testimonials').then(c => c.Testimonials) },
    { path: 'contact', loadComponent: () => import('./contact/contact').then(c => c.Contact) },
    { path: 'inscrie-te', loadComponent: () => import('./enroll/enroll').then(c => c.Enroll) },
    { path: 'login', loadComponent: () => import('./login/login').then(c => c.Login) },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin').then(c => c.Admin),
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'events-settings', pathMatch: 'full' },
            {
                path: 'events-settings',
                loadComponent: () => import('./admin/events-settings/events-settings').then(c => c.EventsSettings)
            },
            {
                path: 'mentors-settings',
                loadComponent: () => import('./admin/mentors-settings/mentors-settings').then(c => c.MentorsSettings)
            },
            {
                path: 'testimonials-settings',
                loadComponent: () => import('./admin/testimonials-settings/testimonials-settings').then(c => c.TestimonialsSettings)
            },
            {
                path: 'users-settings',
                loadComponent: () => import('./admin/users-settings/users-settings').then(c => c.UsersSettings)
            },
        ]
    },
    { path: '', loadComponent: () => import('./home/home').then(c => c.Home) },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

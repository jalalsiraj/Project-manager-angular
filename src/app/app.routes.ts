import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard';
import { loginGuardGuard } from './guards/login-guard-guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: Home },
    {
        path: 'auth', children: [
            { path: 'tenant-register', loadComponent: () => import('./components/auth/tenant-register/tenant-register').then((m) => m.TenantRegister) },
            { path: ':tenantId/login', canActivate: [loginGuardGuard], loadComponent: () => import('./components/auth/login/login').then((m) => m.Login) },
            { path: ':tenantId/register', loadComponent: () => import('./components/auth/register/register').then((m) => m.Register) }
        ]
    },
    { path: ':tenantId/dashboard/:id', canActivate: [authGuard], loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard) },
    { path: '**', redirectTo: 'home' }
];

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'pai',
    canActivate: [authGuard],
    loadComponent: () => import('./features/pai/pai-list.component').then(c => c.PaiListComponent)
  },
  {
    path: 'filho',
    canActivate: [authGuard],
    loadComponent: () => import('./features/filho/filho-list.component').then(c => c.FilhoListComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-users.component').then(c => c.AdminUsersComponent)
  }
];

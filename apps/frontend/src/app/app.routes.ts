import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'pai',
    loadComponent: () => import('./features/pai/pai-list.component').then(c => c.PaiListComponent)
  },
  {
    path: 'filho',
    loadComponent: () => import('./features/filho/filho-list.component').then(c => c.FilhoListComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-users.component').then(c => c.AdminUsersComponent)
  }
];

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
    path: 'luthiers',
    canActivate: [authGuard],
    loadComponent: () => import('./features/luthier/luthier-list/luthier-list.component').then(c => c.LuthierListComponent)
  },
  {
    path: 'luthiers/novo',
    canActivate: [authGuard],
    loadComponent: () => import('./features/luthier/luthier-form/luthier-form.component').then(c => c.LuthierFormComponent)
  },
  {
    path: 'luthiers/:id/editar',
    canActivate: [authGuard],
    loadComponent: () => import('./features/luthier/luthier-form/luthier-form.component').then(c => c.LuthierFormComponent)
  },
  {
    path: 'instrumentos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/instrumento/instrumento-list/instrumento-list.component').then(c => c.InstrumentoListComponent)
  },
  {
    path: 'instrumentos/novo',
    canActivate: [authGuard],
    loadComponent: () => import('./features/instrumento/instrumento-form/instrumento-form.component').then(c => c.InstrumentoFormComponent)
  },
  {
    path: 'instrumentos/:id/editar',
    canActivate: [authGuard],
    loadComponent: () => import('./features/instrumento/instrumento-form/instrumento-form.component').then(c => c.InstrumentoFormComponent)
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-users.component').then(c => c.AdminUsersComponent)
  }
];

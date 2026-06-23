import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-offwhite">
      <header class="bg-brand-brown shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <span class="text-2xl font-bold text-white tracking-wide">Cooperativa de Luthiers</span>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="text-white font-medium hidden sm:block">
                Olá, {{ authService.currentUser()?.primeiroNome }}
              </span>
              <button 
                (click)="logout()" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-brown-light hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown-light transition-all shadow-sm">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-6">
          <!-- Cards de Navegação Rápida -->
          
          <a routerLink="/luthiers" class="bg-white hover:bg-brand-offwhite/30 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-brown-light transition-all duration-300 border border-gray-200 flex items-center justify-between p-6 min-h-[9rem] w-full group">
            <!-- Icon Left (Circular border) -->
            <div class="flex-shrink-0 border-2 border-brand-brown/30 rounded-full p-4 bg-brand-offwhite group-hover:border-brand-brown-light group-hover:bg-white transition-all duration-300">
              <svg class="h-8 w-8 text-brand-brown-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <!-- Centered Text (Title: Brown, Subtitle: Black) -->
            <div class="flex-1 text-center px-4">
              <h3 class="text-2xl font-bold text-brand-brown">Luthiers</h3>
              <p class="mt-1 text-base text-brand-text-dark font-medium">Gerenciar oficinas e profissionais.</p>
            </div>
            <!-- Spacer to balance layout on large screens -->
            <div class="w-16 h-16 hidden sm:block opacity-0"></div>
          </a>

          <a routerLink="/instrumentos" class="bg-white hover:bg-brand-offwhite/30 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-brown-light transition-all duration-300 border border-gray-200 flex items-center justify-between p-6 min-h-[9rem] w-full group">
            <!-- Spacer to balance layout on large screens -->
            <div class="w-16 h-16 hidden sm:block opacity-0"></div>
            <!-- Centered Text (Title: Brown, Subtitle: Black) -->
            <div class="flex-1 text-center px-4">
              <h3 class="text-2xl font-bold text-brand-brown">Instrumentos</h3>
              <p class="mt-1 text-base text-brand-text-dark font-medium">Acompanhar reparos em andamento.</p>
            </div>
            <!-- Icon Right (Circular border) -->
            <div class="flex-shrink-0 border-2 border-brand-brown/30 rounded-full p-4 bg-brand-offwhite group-hover:border-brand-brown-light group-hover:bg-white transition-all duration-300">
              <!-- Ícone de Guitarra / Violão Clássico -->
              <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet" class="w-8 h-8 text-brand-brown-light">
                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                  <path d="M4445 5111 c-57 -15 -108 -45 -165 -98 l-58 -54 -38 26 c-132 89 -289 -76 -199 -210 l26 -37 -95 -131 c-84 -117 -149 -186 -565 -601 l-470 -470 -88 41 c-172 81 -315 109 -502 100 -266 -14 -494 -119 -684 -316 -104 -108 -185 -229 -243 -363 -78 -179 -99 -193 -299 -201 -407 -17 -737 -235 -931 -613 -90 -178 -128 -342 -128 -559 -1 -177 14 -265 66 -415 80 -226 151 -323 478 -651 146 -146 297 -289 335 -318 96 -71 290 -165 403 -195 441 -117 903 7 1206 324 189 198 280 416 293 700 9 201 16 211 228 315 166 81 232 127 348 243 267 264 367 652 262 1017 -15 50 -41 122 -60 160 l-34 70 467 468 c428 430 478 477 605 567 l138 98 36 -24 c45 -31 124 -33 167 -5 69 46 89 144 42 211 l-24 35 54 57 c64 67 92 124 100 205 15 140 -31 237 -190 400 -121 126 -186 176 -266 207 -50 20 -169 29 -215 17z m133 -310 c44 -23 202 -183 226 -228 23 -47 20 -65 -19 -103 l-36 -34 -155 155 -156 156 35 36 c39 42 53 45 105 18z m-196 -428 l148 -148 -62 -43 -62 -42 -133 132 -132 132 41 58 c23 32 44 58 47 58 3 0 73 -66 153 -147z m-320 -310 c60 -59 108 -112 108 -118 0 -19 -1249 -1260 -1258 -1250 -4 6 -27 36 -51 67 -23 31 -68 76 -99 99 -31 24 -61 47 -67 51 -10 9 1231 1258 1250 1258 5 0 58 -48 117 -107z m-1568 -698 c75 -16 156 -44 156 -54 0 -3 -71 -77 -158 -164 l-157 -157 -75 -21 c-145 -40 -254 -117 -334 -237 -65 -99 -97 -202 -97 -316 -1 -174 49 -294 171 -416 120 -121 238 -170 406 -170 166 0 286 51 404 169 81 82 127 161 155 266 15 58 21 66 179 224 l163 163 22 -62 c119 -355 -46 -735 -398 -913 -47 -24 -102 -50 -121 -57 -59 -22 -166 -98 -202 -142 -89 -110 -108 -171 -119 -363 -9 -164 -29 -257 -78 -353 -145 -287 -492 -478 -837 -459 -183 10 -365 74 -503 176 -93 70 -559 542 -611 620 -96 144 -149 305 -157 481 -17 360 175 705 472 846 104 49 173 64 340 73 164 9 214 23 305 81 95 61 147 132 216 293 158 369 503 567 858 492z m-7 -690 c60 -18 135 -81 165 -138 26 -53 35 -152 18 -213 -19 -66 -78 -136 -141 -168 -74 -37 -173 -37 -247 0 -170 84 -208 301 -78 441 78 84 174 110 283 78z"/>
                  <path d="M927 2035 c-51 -18 -73 -39 -93 -92 -34 -89 -45 -75 484 -606 262 -263 489 -485 504 -493 35 -18 101 -18 138 1 56 29 88 96 75 162 -6 31 -73 104 -482 517 -261 265 -487 488 -502 497 -39 24 -81 29 -124 14z"/>
                </g>
              </svg>
            </div>
          </a>

          @if (authService.isAdmin()) {
            <a routerLink="/admin/users" class="bg-white hover:bg-brand-offwhite/30 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-brown-light transition-all duration-300 border border-gray-200 flex items-center justify-between p-6 min-h-[9rem] w-full group">
              <!-- Icon Left (Circular border) -->
              <div class="flex-shrink-0 border-2 border-brand-brown/30 rounded-full p-4 bg-brand-offwhite group-hover:border-brand-brown-light group-hover:bg-white transition-all duration-300">
                <svg class="h-8 w-8 text-brand-brown-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <!-- Centered Text (Title: Brown, Subtitle: Black) -->
              <div class="flex-1 text-center px-4">
                <h3 class="text-2xl font-bold text-brand-brown">Configurações</h3>
                <p class="mt-1 text-base text-brand-text-dark font-medium">Gerenciar acessos e usuários.</p>
              </div>
              <!-- Spacer to balance layout on large screens -->
              <div class="w-16 h-16 hidden sm:block opacity-0"></div>
            </a>
          }
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

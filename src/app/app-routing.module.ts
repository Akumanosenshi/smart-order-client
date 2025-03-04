import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './services/auth.guard.service'; // Assure-toi que ce fichier existe

const routes: Routes = [
  {path: '', redirectTo: 'loader', pathMatch: 'full'}, // Page par défaut
  {path: 'loader', loadChildren: () => import('./pages/loader/loader.module').then(m => m.LoaderPageModule)},
  {path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)},
  {path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)},
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuardService], // Empêche d'accéder aux tabs sans login
  },
  {path: '**', redirectTo: 'loader', pathMatch: 'full'}, {
    path: 'notre-menu',
    loadChildren: () => import('./pages/notre-menu/notre-menu.module').then(m => m.NotreMenuPageModule)
  },
  {
    path: 'vos-commandes',
    loadChildren: () => import('./pages/vos-commandes/vos-commandes.module').then(m => m.VosCommandesPageModule)
  },
// Redirection si l'URL n'est pas reconnue
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})
export class AppRoutingModule {}

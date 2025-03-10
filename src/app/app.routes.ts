import { Routes } from '@angular/router';
import { NotFoundComponent } from './modules/core/components/not-found/not-found.component';

// Use lazy loading to load modules effectivelly
export const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/core/core.module').then(m => m.CoreModule)},
  { path: 'token', loadChildren: () => import('./modules/token/token.module').then(m => m.TokenModule)},
  { path: 'nft', loadChildren: () => import('./modules/nft/nft.module').then(m => m.NFTModule)},
  { path: '**', component: NotFoundComponent }
];

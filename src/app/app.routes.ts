import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './components/layout/home-layout/home-layout.component';
import { LoginComponent } from './components/login/login.component';
import { ListingComponent } from './components/blog/listing/listing.component';
import { ShowComponent } from './components/blog/show/show.component';
import { FormComponent } from './components/blog/form/form.component';
import { isLoggInGuard } from './guards/is-logg-in.guard';
import { NotFoundComponent } from './components/error/not-found/not-found.component';

export const routes: Routes = [
    {
        path:'login',
        component: LoginComponent
    },
    {
        path: '',
        redirectTo: '/acceuil',
        pathMatch: 'full'
    },
    {
        path: '',
        component: HomeLayoutComponent,
        children: [
            {
                path: 'acceuil',
                component: ListingComponent,
            },
            {
              path: 'article/nouveau',
              component: FormComponent,
              canActivate: [isLoggInGuard]
            },
            {
                path: 'article/:slug',
                component: ShowComponent,
            },
            {
              path: 'article/:slug/edit',
              component: FormComponent,
              canActivate: [isLoggInGuard]
            }
        ]
    },
    {
      path:"not-found",
      component:NotFoundComponent
    },
    {
      path: '**',
      redirectTo: '/not-found'
    }
];

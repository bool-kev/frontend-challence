import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './components/layout/home-layout/home-layout.component';
import { LoginComponent } from './components/login/login.component';
import { ListingComponent } from './components/blog/listing/listing.component';
import { ShowComponent } from './components/blog/show/show.component';
import { FormComponent } from './components/blog/form/form.component';

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
                component: ListingComponent
            },
            {
              path: 'article/nouveau',
              component: FormComponent
            },
            {
                path: 'article/:slug-:id',
                component: ShowComponent
            }
        ]
    }
];

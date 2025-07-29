import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { HomeComponent } from './Component/home/home.component';
import { ProjetComponent } from './Component/projet/projet.component';
import { TacheComponent } from './Component/tache/tache.component';
import { AdminComponent } from './Component/admin/admin.component';
import { DashbordComponent } from './Component/dashbord/dashbord.component';
import { adminGuard } from './guard/admin.guard';
import { loginGuard } from './guard/login.guard';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },

    {
        path: "login", component: LoginComponent
    },
    {
        path: "home", component: HomeComponent,
        canActivate: [loginGuard],
        children: [
            { path: "projet", component: ProjetComponent },
            { path: "tache", component: TacheComponent },
            { path: "admin", component: AdminComponent, canActivate: [adminGuard] },
            { path: "dashboard", component: DashbordComponent },
            { path: "dasbord", redirectTo: "dashboard", pathMatch: "full" },

        ]
    },


];



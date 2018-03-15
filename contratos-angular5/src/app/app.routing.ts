import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { AppComponent } from './app.component';

const APP_ROUTES: Routes = [
	{ path: '', component: AppComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(APP_ROUTES)],
    exports: [RouterModule]
})
export class AppRouting {}
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReportComponent } from './report/report.component';

const APP_ROUTES: Routes = [
    { path: '', component: ReportComponent },
    // { path: 'report', component: ReportComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(APP_ROUTES)],
    exports: [RouterModule]
})
export class AppRouting {}
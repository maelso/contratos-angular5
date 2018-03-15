import { NgModule, Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { AddClientComponent } from './add-client/add-client.component';
import { ListClientComponent } from './list-client/list-client.component';

const clientRoutes = [
	{path:'cliente', component: ListClientComponent},
	{path:'cliente/add', component: AddClientComponent}
];

@NgModule({
	imports: [RouterModule.forChild(clientRoutes)],
	exports: [RouterModule]
})
export class ClientRoutingModule{}
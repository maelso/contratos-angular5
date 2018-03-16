import { NgModule, Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { AddContractComponent } from './add-contract/add-contract.component';
import { ListContractComponent } from './list-contract/list-contract.component';

const contractRoutes = [
	{path:'contrato', component: ListContractComponent},
	{path:'contrato/add', component: AddContractComponent}
];

@NgModule({
	imports: [RouterModule.forChild(contractRoutes)],
	exports: [RouterModule]
})
export class ContractRoutingModule{}
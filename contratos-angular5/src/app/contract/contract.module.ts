import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddContractComponent, SelectClientModalComponent } from './add-contract/add-contract.component';
import { SharedModule } from '../shared/shared.module';
import { ContractRoutingModule } from './contract.routing';
import { ListContractComponent } from './list-contract/list-contract.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ContractRoutingModule,
  ],
  declarations: [AddContractComponent, ListContractComponent, SelectClientModalComponent],
  entryComponents: [SelectClientModalComponent]
})
export class ContractModule { }

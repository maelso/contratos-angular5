import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddContractComponent } from './add-contract/add-contract.component';
import { SharedModule } from '../shared/shared.module';
import { ContractRoutingModule } from './contract.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ContractRoutingModule
  ],
  declarations: [AddContractComponent]
})
export class ContractModule { }

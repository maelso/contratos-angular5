import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddClientComponent } from './add-client/add-client.component';
import { ListClientComponent } from './list-client/list-client.component';
import { ClientRoutingModule } from './client.routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule
  ],
  declarations: [AddClientComponent, ListClientComponent]
})
export class ClientModule { }

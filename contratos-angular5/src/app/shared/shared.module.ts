import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from './services/client.service';
import { ContractService } from './services/contract.service';
import { PaymentService } from './services/payment.service';

import { MatIconModule, MatListModule, MatInputModule, MatFormFieldModule,
  MatTabsModule, MatSlideToggleModule, MatButtonModule,
  MatMenuModule, MatToolbarModule, MatCardModule, MatSortModule,
  MatTooltipModule, MatSnackBarModule, MatExpansionModule,
  MatDialogModule, MatGridListModule,
  MatDatepickerModule, MatNativeDateModule,
  MatAutocompleteModule, MatSelectModule, MatTableModule }  from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,

  ],
  exports: [
    MatIconModule, MatListModule, MatInputModule, MatFormFieldModule,
    MatTabsModule, MatSlideToggleModule, MatButtonModule,
    MatMenuModule, MatToolbarModule, MatCardModule, MatSelectModule,
    MatAutocompleteModule, MatTableModule, MatSortModule,
    MatTooltipModule, MatSnackBarModule, MatDialogModule,
    MatGridListModule, MatExpansionModule, 
    MatDatepickerModule, MatNativeDateModule,
    CommonModule, FormsModule, ReactiveFormsModule,
  ],
  providers: [ ClientService, ContractService, PaymentService ],
  declarations: []
})
export class SharedModule { }

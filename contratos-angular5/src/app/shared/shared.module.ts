import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from './services/client.service';

import { MatIconModule, MatListModule, MatInputModule, MatFormFieldModule,
  MatTabsModule, MatSlideToggleModule, MatButtonModule,
  MatMenuModule, MatToolbarModule, MatCardModule,
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
    MatAutocompleteModule, MatTableModule,
    CommonModule, FormsModule, ReactiveFormsModule,
  ],
  providers: [ ClientService ],
  declarations: []
})
export class SharedModule { }

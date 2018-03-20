import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Address } from '../../shared/models/address';
import { Contract } from '../../shared/models/contract';
import { ContractService } from '../../shared/services/contract.service';
import { Client } from '../../shared/models/client';
import { ClientService } from '../../shared/services/client.service';
import { Payment } from '../../shared/models/payment';
import { PaymentService } from '../../shared/services/payment.service';

@Component({
  selector: 'app-select-client-modal',
  template: `
    <h4>Selecione um Cliente para o Contrato:</h4>
      <mat-list *ngFor="let client of data">
        <mat-list-item (click)=selectClient(client)>
          {{ client.name }}
        </mat-list-item>
      </mat-list>
    `,
  styleUrls: ['./add-contract.component.scss']
})
export class SelectClientModalComponent {
  constructor(private dialogRef: MatDialogRef<Client>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  selectClient(client: Client) {
    this.dialogRef.close({ data: client });
  }
}

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit {

  contractForm: FormGroup;
  contractId: string;
  selectedContract: Contract;
  clientFromSelectedContract: Client;
  selectedClientId: string;
  clientList: Client[];
  contractParamsSubscription: Subscription;
  editMode: boolean = false;
  clientName: string;

  constructor(private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contractService: ContractService,
    private clientService: ClientService,
    private dialog: MatDialog,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.createForm();

    this.contractParamsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      //Has ID, Edit Mode
      if (params.id) {
        this.editMode = true;
        this.contractId = params.id;
        this.getContractData(params.id);
        if(this.contractForm){
          this.contractForm.get('client_name').disable();
          this.contractForm.get('value').disable();
          this.contractForm.get('number_installments').disable();
        }
      }
      //No ID Parameter, Create Mode
      else {
        this.editMode = false;
        this.contractId = "";
      }
    });
  }

  showClients() {
    const dialogRef = this.dialog.open(SelectClientModalComponent, {
      data: this.clientList,
      height: '350px'
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.selectedClientId = data.data.id;
          this.clientFromSelectedContract = data.data;
          this.setClientData();
        }
      },
    );
  }

  searchClientByName() {
    this.clientService.getByName(this.contractForm.get('client_name').value).subscribe(
      data => {
        this.clientList = data;
        this.showClients();
      }
    )
  }

  clearClient() {
    this.clientFromSelectedContract = null;
  }

  onSubmit() {
    if (this.contractForm.valid) {
      let _contract: Contract = this.createContract();
      if (!this.editMode) {
        this.contractService.save(_contract).subscribe(
          res => {
            this.generatePayment(res);
            this.clearForm();
            this.router.navigate(['/contrato']);
          },
          err => alert(err.message)
        );
      }
      else if (this.editMode) {
        this.contractService.put(this.contractId, _contract).subscribe(
          res => {
            this.clearForm();
            this.router.navigate(['/contrato']);
          },
          err => alert(err.message)
        );
      }
    }
    else {
      this.showErrors(this.contractForm);
    }
  }

  generatePayment(contract: any) {
    let _payment: Payment;
    let _rest = contract.value % contract.number_installments;
    let _value = (contract.value - _rest) / contract.number_installments;
    let _newDate = new Date(contract.creation_date);
    for (let installment = 0; installment < contract.number_installments; installment++) {
      _newDate = new Date(_newDate.getTime() + 30 * 24 * 3600 * 1000);
      if (installment == 0) {
        _payment = new Payment(contract.id, _value+_rest, _newDate);
      }
      else{
        _payment = new Payment(contract.id, _value, _newDate);
      }
      this.paymentService.save(_payment).subscribe(
        data => console.log(data.contractId),
        err => alert(err.message)
      );
    }
  }

  clearForm() {
    this.contractForm.reset();
    this.clientFromSelectedContract = null;
  }

  showErrors(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const ctrl = formGroup.get(field);
      ctrl.markAsTouched();
      if (ctrl instanceof FormGroup) {
        this.showErrors(ctrl);
      }
    });
  }

  createForm() {
    this.contractForm = this.fb.group({
      client_name: [null, [Validators.required, Validators.pattern("[a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]*"), Validators.minLength(3), Validators.maxLength(40)]],
      name: [null, [Validators.required, Validators.pattern("[a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]*"), Validators.minLength(3), Validators.maxLength(80)]],
      address: this.fb.group({
        country: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        state: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        city: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      }),
      value: [null, [Validators.required, Validators.pattern("[0-9,.]*")]],
      number_installments: [null, [Validators.required, Validators.pattern("[0-9]*")]]
    });
  }

  getAddress() {
    let address = new Address(
      this.contractForm.get('address.country').value,
      this.contractForm.get('address.state').value,
      this.contractForm.get('address.city').value
    );
    return address;
  }

  createContract() {
    let contract = new Contract(
      this.selectedClientId,
      this.contractForm.get('name').value,
      this.getAddress(),
      parseInt(this.contractForm.get('value').value.replace(/\./g, '').replace(/\,/g, '')),
      this.contractForm.get('number_installments').value,
    );
    if (this.editMode && this.selectedContract) {
      contract.creation_date = this.selectedContract.creation_date;
    }
    return contract;
  }

  setClientData() {
    this.contractForm.patchValue({
      client_name: this.clientFromSelectedContract.name,
    });
  }

  getContractData(id: string) {
    this.contractService.get(id).subscribe(
      data => {
        this.selectedContract = data;
        this.selectedClientId = this.selectedContract.clientId;
        this.clientService.get(this.selectedContract.clientId).subscribe(
          data => {
            this.clientFromSelectedContract = data;
            this.setClientData();
          },
          err => alert(err.message)
        );
        this.contractForm.patchValue({
          name: this.selectedContract.name,
          address: this.selectedContract.address,
          value: (this.selectedContract.value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          number_installments: this.selectedContract.number_installments,
        });
      },
      err => alert(err.message)
    );
  }

  formatCurrency() { //This function will format the inserted amount for currency format
    if (this.contractForm.get('value').value) {
      this.contractForm.patchValue({
        value: (this.contractForm.get('value').value.replace(/\./g, '').replace(/\,/g, '') / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
      });
    }
  }

}

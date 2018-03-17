import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Address } from '../../shared/models/address';
import { Contract } from '../../shared/models/contract';
import { ContractService } from '../../shared/services/contract.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit {

  contractForm: FormGroup;
  contractId: string;
  selectedContract: Contract;
  contractParamsSubscription: Subscription;
  editMode: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private contractService: ContractService
            ) { }

  ngOnInit() {
    this.createForm();

    this.contractParamsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      //Has ID, Edit Mode
      if (params.id) {
        this.editMode = true;
        this.contractId = params.id;
        this.getContractData(params.id);
      }
      //No ID Parameter, Create Mode
      else {
        this.editMode = false;
        this.contractId = "";
      }
    });
  }

  onSubmit(){
    if (this.contractForm.valid) {
      let _contract: Contract = this.createContract();
      if (!this.editMode) {
        this.contractService.save(_contract).subscribe(
          res => {
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

  clearForm(){
    this.contractForm.reset();
  }

  showErrors(formGroup: FormGroup){
		Object.keys(formGroup.controls).forEach(field => {
			const ctrl = formGroup.get(field);
			ctrl.markAsTouched();
			if (ctrl instanceof FormGroup) {
				this.showErrors(ctrl);
			}
		});
	}

  createForm(){
		this.contractForm = this.fb.group({

      name: [null, [Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(3), Validators.maxLength(40)]],
      address: this.fb.group({
				country: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
		    state: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        city: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      }),      
      value: [null, [Validators.required, Validators.pattern("[0-9,.]*")]],
      number_installments: [null, [Validators.required, Validators.pattern("[0-9]*")]]
		});
  }
  
  getAddress(){
    let address = new Address(
      this.contractForm.get('address.country').value,
      this.contractForm.get('address.state').value,
      this.contractForm.get('address.city').value
    );
		return address;
  }
  
  createContract() {
    let contract = new Contract(
      this.contractForm.get('name').value,
      this.getAddress(),
      parseInt(this.contractForm.get('value').value.replace(/\./g, '').replace(/\,/g, '')),
      this.contractForm.get('number_installments').value,
    );
    if(this.editMode && this.selectedContract){
      contract.creation_date = this.selectedContract.creation_date;
    }
    return contract;
  }

  getContractData(id: string) {
    this.contractService.get(id).subscribe(
      data => {
        this.selectedContract = data;
        this.contractForm.patchValue({
          name: data.name,
          value: (data.value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          number_installments: data.number_installments,
          address: data.address
        });
      },
      err => alert(err.message)
    );
  }

  formatCurrency(){
    this.contractForm.patchValue({
      value: (this.contractForm.get('value').value.replace(/\./g, '').replace(/\,/g, '') / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    });
  }

}

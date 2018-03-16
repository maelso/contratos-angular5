import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from '../../shared/models/address';
import { Contract } from '../../shared/models/contract';
import { ContractService } from '../../shared/services/contract.service';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit {

  contractForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private contractService: ContractService
            ) { }

  ngOnInit() {
    this.createForm();
  }

  onSubmit(){
    if(this.contractForm.valid){
      let _contract: Contract = this.createContract();
      this.contractService.save(_contract).subscribe(
        res => {
          this.clearForm();
          // this.router.navigate(['/contratos']);
        },
				err => alert(err.message)
      );
    }
    else{
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
      value: [null, [Validators.required]],
      number_installments: [null, [Validators.required]]
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
      this.contractForm.get('value').value,
      this.contractForm.get('number_installments').value,
    );    
    return contract;
  }

}

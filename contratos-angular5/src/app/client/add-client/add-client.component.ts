import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../shared/models/address';
import { Client } from '../../shared/models/client';
import { ClientService } from '../../shared/services/client.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  clientForm: FormGroup;

  constructor(private fb: FormBuilder,
              private clientService: ClientService
            ) { }

  ngOnInit() {
    this.createForm();
  }

  onSubmit(){
    if(this.clientForm.valid){
      console.log('Valid Form!');
      let _client = this.createClient();
      this.clientService.save(_client).subscribe(
        res => {
          this.clearForm();
        },
				err => console.log('err ', err)
      );
    }
    else{
      this.showErrors(this.clientForm);
    }
  }

  clearForm(){
    this.clientForm.reset();
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
		this.clientForm = this.fb.group({

      name: [null, [Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(3), Validators.maxLength(40)]],
      
      address: this.fb.group({
				country: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
		    state: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        city: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
			})
		});
  }
  
  getAddress(){
    let address = new Address(
      this.clientForm.get('address.country').value,
      this.clientForm.get('address.state').value,
      this.clientForm.get('address.city').value
    );
		return address;
  }
  
  createClient() {
    let client = new Client(
      this.clientForm.get('name').value,
      this.getAddress()
    );
    
    return client;
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../shared/models/address';
import { Client } from '../../shared/models/client';
import { ClientService } from '../../shared/services/client.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  clientForm: FormGroup;
  clientId: string;
  clientParamsSubscription: Subscription;
  editMode: boolean = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.createForm();
    this.clientParamsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      //Has ID, Edit Mode
      if (params.id) {
        this.editMode = true;
        this.clientId = params.id;
        this.getClientData(params.id);
      }
      //No ID Parameter, Create Mode
      else {
        this.editMode = false;
        this.clientId = "";
      }
    });
  }
  ngOnDestroy() {
    this.clientParamsSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.clientForm.valid) {
      let _client: Client = this.createClient();
      if (!this.editMode) {
        this.clientService.save(_client).subscribe(
          res => {
            this.clearForm();
            this.router.navigate(['/cliente']);
          },
          err => alert(err.message)
        );
      }
      else if (this.editMode) {
        this.clientService.put(this.clientId, _client).subscribe(
          res => {
            this.clearForm();
            this.router.navigate(['/cliente']);
          },
          err => alert(err.message)
        );
      }
    }
    else {
      this.showErrors(this.clientForm);
    }
  }

  clearForm() {
    this.clientForm.reset();
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
    this.clientForm = this.fb.group({

      name: [null, [Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(3), Validators.maxLength(40)]],

      address: this.fb.group({
        country: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        state: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        city: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      })
    });
  }

  getAddress() {
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

  getClientData(id: string) {
    this.clientService.get(id).subscribe(
      data => {
        this.clientForm.patchValue({
          name: data.name,
          address: data.address
        });
      },
      err => alert(err.message)
    );
  }

}

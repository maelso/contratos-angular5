import { Component, OnInit } from '@angular/core';
import { ClientService } from '../shared/services/client.service';
import { Client } from '../shared/models/client';
import { ContractService } from '../shared/services/contract.service';
import { PaymentService } from '../shared/services/payment.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  clients: Client[];
  clientsWithContracts: any;
  groupByCity = {};

  constructor(private clientService: ClientService,
              private contractService: ContractService,
              private paymentService: PaymentService ) { }

  ngOnInit() {
    //Get Clients, Contracts and Payments
    this.clientService.getClientsWithContracts().subscribe(
      data => {
        this.clientsWithContracts = data;
        this.reportByCity();
        for (let client of this.clientsWithContracts) {
          for(let contract of client.contracts){
            this.paymentService.getPaymentsByContractId(contract.id).subscribe(
              response => contract['payments'] = response,
              err => alert(err.message)
            );
          }
        }
        console.log("payments together: ", this.clientsWithContracts);
      },
      err => alert(err.message)
    );
  }

  reportByCity() {
    this.clientsWithContracts.forEach(client => {
      this.groupByCity[client.address.city] = this.groupByCity[client.address.city] || [];
      this.groupByCity[client.address.city].push({ date:client.name });
    });
    console.log('reportByCity: ', this.groupByCity);
  }

  _parseCurrency(value: any) {
    return (value.toString().replace(/\./g, '').replace(/\,/g, '') / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

}

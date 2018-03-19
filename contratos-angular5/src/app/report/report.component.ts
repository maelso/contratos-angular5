import { Component, OnInit } from '@angular/core';
import { ClientService } from '../shared/services/client.service';
import { Client } from '../shared/models/client';
import { ContractService } from '../shared/services/contract.service';
import { PaymentService } from '../shared/services/payment.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  clients: Client[];
  clientsWithContracts: any;
  clientsByCity = {};
  contractsByCity = {};
  clientCities: string[];
  contractCities: string[];
  contractsChart: Chart;

  constructor(private clientService: ClientService,
              private contractService: ContractService,
              private paymentService: PaymentService ) { }

  ngOnInit() {
    //Get Clients, Contracts and Payments
    this.clientService.getClientsWithContracts().subscribe(
      data => {
        this.clientsWithContracts = data;
        console.log("clientsWithContracts ", this.clientsWithContracts)
        this.reportByCity();
        for (let client of this.clientsWithContracts) {
          client['total_payments'] = 0;
          for(let contract of client.contracts){
            this.paymentService.getPaymentsByContractId(contract.id).subscribe(
              response => {
                contract['payments'] = response;
                for(let payment of contract['payments']){
                  client['total_payments'] += payment.value;
                }
              },
              err => alert(err.message)
            );
          }
        }
      },
      err => alert(err.message)
    );
  }

  reportByCity() {
    // Clients
    this.clientsWithContracts.forEach(client => {
      this.clientsByCity[client.address.city] = this.clientsByCity[client.address.city] || [];
      this.clientsByCity[client.address.city].push({ client:client.name });
    });
    console.log("this.clientsByCity ", this.clientsByCity);
    this.clientCities = Object.keys(this.clientsByCity);
    
    // Contracts
    this.clientsWithContracts.forEach(client => {
      client.contracts.forEach(contract => {
        this.contractsByCity[contract.address.city] = this.contractsByCity[contract.address.city] || [];
        this.contractsByCity[contract.address.city].push({ contract:contract.name });
      })
    });
    this.contractCities = Object.keys(this.contractsByCity);
    this.showChart("contractsChart", this.getContractsData(), this.contractCities);
    this.showChart("clientsChart", this.getCLientsData(), this.clientCities);
  }

  showChart(id: string, dataSource: any, labels: any): void {
		let ctx = document.getElementById(id);
		this.contractsChart = this.createChart(ctx, 'pie', dataSource, labels);
  }
  
  
  createChart(context: any, typeChart: string, data: any, labels: any): Chart {
		return new Chart(context, {
			type: typeChart,
			data: {
				labels: labels,
				datasets: data,
				fill: false
			},
		});
	}

  _parseCurrency(value: any) {
    return (value.toString().replace(/\./g, '').replace(/\,/g, '') / 100)
    .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  getContractsData(){
    let _data = [];
    for(let city of this.contractCities){
      _data.push(this.contractsByCity[city].length);
      console.log("this.groupByCity[city] ", this.contractsByCity[city]);
    }
    console.log("_data ", _data);

		let data = [
			{
				data: _data,
				label: 'Quantidade de contratos firmados por Cidade',
				borderColor: 'rgba(255, 33, 47,1)',
        borderWidth: 1,
        backgroundColor: [
          'rgba(0, 71, 171, 1)',
          'rgba(255, 250, 5, 1)',
          'rgba(255, 33, 47, 1)',
          'rgba(1, 255, 1, 1)',
          'rgba(153, 73, 63, 1)',
          'rgba(65, 129, 193, 1)',
          'rgba(212, 4, 2, 1)',
          'rgba(90, 53, 134, 1)',
          'rgba(245, 128, 45, 1)',
          ],
				fill: false
			}
    ];
		return data;
  }


  getCLientsData(){
    let _data = [];
    for(let city of this.clientCities){
      _data.push(this.clientsByCity[city].length);
    }

		let data = [
			{
				data: _data,
				label: 'Quantidade de Clientes por Cidade',
				borderColor: 'rgba(255, 33, 47,1)',
        borderWidth: 1,
        backgroundColor: [
          'rgba(0, 71, 171, 1)',
          'rgba(255, 250, 5, 1)',
          'rgba(255, 33, 47, 1)',
          'rgba(1, 255, 1, 1)',
          'rgba(153, 73, 63, 1)',
          'rgba(65, 129, 193, 1)',
          'rgba(212, 4, 2, 1)',
          'rgba(90, 53, 134, 1)',
          'rgba(245, 128, 45, 1)',
          ],
				fill: false
			}
    ];
		return data;
  }

}

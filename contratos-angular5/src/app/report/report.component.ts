import { Component, OnInit } from '@angular/core';
import { ClientService } from '../shared/services/client.service';
import { Client } from '../shared/models/client';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  clients: Client[];
  groupByCity = {};

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.clientService.getClients().subscribe(
      data => {
        this.clients = data;
        this.reportByCity();
      },
      err => alert(err.message)
    );
  }

  reportByCity() {
    this.clients.forEach(client => {
      this.groupByCity[client.address.city] = this.groupByCity[client.address.city] || [];
      this.groupByCity[client.address.city].push({ date:client.name });
    });
    console.log('reportByCity: ', this.groupByCity);
  }

}

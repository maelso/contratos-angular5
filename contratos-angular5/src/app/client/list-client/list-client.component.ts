import { Component, ViewChild, OnInit } from '@angular/core';
import { Client } from '../../shared/models/client';
import { ClientService } from '../../shared/services/client.service';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {

  clients :Client[];
  data = new MatTableDataSource(this.clients);;
  displayedColumns = ['name', 'country', 'state', 'city', 'creation_date', 'modified_date'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientService: ClientService) { }

  ngOnInit() {
      this.clientService.getClientes().subscribe(
        data => {
          this.clients = data;
          console.log("Clients: ", this.clients);
          this.data = new MatTableDataSource(this.clients);
          this.data.sort = this.sort;
        },
        err => console.log('err ', err)
      )

  }

}
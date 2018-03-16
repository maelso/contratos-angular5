import { Component, ViewChild, OnInit } from '@angular/core';
import { Client } from '../../shared/models/client';
import { ClientService } from '../../shared/services/client.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {

  clients: Client[];
  dataSource = [];
  data;
  displayedColumns = ['name', 'country', 'state', 'city', 'creation_date', 'modified_date'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientService: ClientService,
              private router: Router) { }

  ngOnInit() {
    this.clientService.getClients().subscribe(
      data => {
        this.clients = data;
        this.setUpGrid();
      },
      err => alert(err.message)
    );
  }

  setUpGrid(){
    let _dataGrid = [];
    for(let client of this.clients){
      this.dataSource = [];
      this.toString(client)
      _dataGrid.push(this.dataSource);
    }
    this.data = new MatTableDataSource(_dataGrid);
    console.log("Data ", _dataGrid);
    this.data.sort = this.sort;
  }

  toString(obj) {
    for (let ele in obj) {
      if (typeof (obj[ele]) == 'object') {
        this.toString(obj[ele]);
      }
      else {
        this.dataSource[ele] = obj[ele];
      }
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.data.filter = filterValue;
    console.log("data.filter ", this.data);
  }

  newClient(){
    this.router.navigate(['/cliente/add']);
  }

}
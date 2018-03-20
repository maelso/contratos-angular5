import { Component, ViewChild, OnInit } from '@angular/core';
import { Client } from '../../shared/models/client';
import { ClientService } from '../../shared/services/client.service';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {

  clients: Client[];
  dataSource = [];
  data;
  initialDate;
  finalDate;
  filterBy;
  displayedColumns = ['name', 'country', 'state', 'city', 'creation_date', 'modified_date', 'action'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientService: ClientService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.clientService.getClients().subscribe(
      data => {
        this.clients = data;
        this.setUpGrid();
      },
      err => alert(err.message)
    );
    this.adapter.setLocale('pt-BR');
  }

  filterByDate(){
    let _filter = "";
    let _date;
    let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    if(this.filterBy){
      if(this.initialDate){
        this.initialDate.setHours(0);
        _date = new Date(this.initialDate.getTime() - tzoffset);
        _filter += this.filterBy+"_gte="+_date.toISOString()+"&";
      }
      if(this.finalDate){
        this.finalDate.setHours(23);
        this.finalDate.setMinutes(59);
        _date = new Date(this.finalDate.getTime() - tzoffset);
        _filter += this.filterBy+"_lte="+(_date.toISOString());
      }
    }
    console.log("Filter: ", _filter);
    this.clientService.getClientsWithFilters(_filter).subscribe(
      data => {
        this.clients = data;
        this.setUpGrid();
      },
      err => alert(err.message)
    );
  }

  setUpGrid() {
    let _dataGrid = [];
    for (let client of this.clients) {
      this.dataSource = [];
      this.toString(client)
      _dataGrid.push(this.dataSource);
    }
    this.data = new MatTableDataSource(_dataGrid);
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
  }

  customFilter(filter: string): boolean {
    this.data.filterPredicate = (filter: string) => this.data.name.indexOf(filter) != -1;
    if (this.data.name.indexOf(filter) != -1) {
      this.data.filter = filter;
    }
    return this.data.name.indexOf(filter) != -1;
  }

  newClient() {
    this.router.navigate(['/cliente/add']);
  }

  remove(id: string) {
    this.clientService.delete(id).subscribe(
      res => {
        const _data = this.data.data;
        for (let item of _data) {
          if (item.id == id) {
            _data.splice(_data.indexOf(item), 1);
          }
        }
        this.data.data = _data;
        /* >this.data.data.splice(id, 1) Doesn't updates dynamically, but if you replace the complete array then it works fine.*/
        this.openSnackBar("Cliente Removido");
      },
      err => alert(err.message)
    );
  }

  openSnackBar(msg: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = ['snack-custom-class'];
    config.duration = 1000;
    this.snackBar.open(msg, "", config);    
  }

  editClient(id: string): void {
    let editUrl = `cliente/add;id=${id}`;
    window.location.href = editUrl;
  }

}
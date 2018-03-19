import { Component, ViewChild, OnInit } from '@angular/core';
import { Client } from '../../shared/models/client';
import { ClientService } from '../../shared/services/client.service';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';
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
  displayedColumns = ['name', 'country', 'state', 'city', 'creation_date', 'modified_date', 'action'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientService: ClientService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.clientService.getClients().subscribe(
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
        /* >this.data.data.splice(id, 1) Doesn't works dynamically, but if you replace the complete array then it works fine.*/
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
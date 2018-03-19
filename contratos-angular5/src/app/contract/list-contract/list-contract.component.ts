import { Component, ViewChild, OnInit } from '@angular/core';
import { Contract } from '../../shared/models/contract';
import { ContractService } from '../../shared/services/contract.service';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ClientService } from '../../shared/services/client.service';

@Component({
  selector: 'app-list-contract',
  templateUrl: './list-contract.component.html',
  styleUrls: ['./list-contract.component.scss']
})
export class ListContractComponent implements OnInit {

  contracts: Contract[];
  dataSource = [];
  data;
  displayedColumns = ['name', 'city', 'value', 'number_installments', 'creation_date', 'modified_date', 'action'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private contractService: ContractService,
              private clientService: ClientService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.contractService.getContracts().subscribe(
      data => {
        this.contracts = data;
        this.setUpGrid();
      },
      err => alert(err.message)
    );
  }

  setUpGrid() {
    let _dataGrid = [];
    for (let contract of this.contracts) {
      this.dataSource = [];
      this.toString(contract);
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

  newContract() {
    this.router.navigate(['/contrato/add']);
  }

  remove(id: string) {
    this.contractService.delete(id).subscribe(
      res => {
        const _data = this.data.data;
        for (let item of _data) {
          if (item.id == id) {
            _data.splice(_data.indexOf(item), 1);
          }
        }
        this.data.data = _data;
        /* >this.data.data.splice(id, 1) Doesn't works dynamically, but if you replace the complete array then it works fine.*/
        this.openSnackBar("Contrato Removido");
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

  editContract(id: string): void {
    let editUrl = `contrato/add;id=${id}`;
    window.location.href = editUrl;
  }

  _parseCurrency(value: any) {
    return (value.toString().replace(/\./g, '').replace(/\,/g, '') / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

}

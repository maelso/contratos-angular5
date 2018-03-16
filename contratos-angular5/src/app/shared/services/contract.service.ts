import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../models/contract';

@Injectable()
export class ContractService {

  protected apiUrl: string = 'http://0.0.0.0:3000/contract';

  getAPI() {
    return this.apiUrl;
  }

  constructor(private http: HttpClient) { }

  save(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(this.getAPI(), contract);
  }

}

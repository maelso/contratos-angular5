import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../models/contract';

@Injectable()
export class ContractService {

  protected apiUrl: string = 'http://0.0.0.0:3000/contracts';

  getAPI() {
    return this.apiUrl;
  }

  constructor(private http: HttpClient) { }

  save(contract: Contract): Observable<Contract> {
    contract.setCreationDate();
    contract.setModifiedDate();
    return this.http.post<Contract>(this.getAPI(), contract);
  }

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.getAPI());
  }

  getContractsWithFilters(filter: string): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.getAPI()}?${filter}`);
  }

  getContractsWithClients(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.getAPI()}?_expand=client`);
  }

  getContractsWithPayments():Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.getAPI()}?_embed=payments`);
  }

  get(id: string): Observable<Contract> {
    return this.http.get<Contract>(`${this.getAPI()}/${id}`);
  }

  delete(id: string): Observable<Contract> {
    return this.http.delete<Contract>(`${this.getAPI()}/${id}`);
  }

  put(id: string, contract: Contract): Observable<Contract> {
    contract.setModifiedDate();
    return this.http.put<Contract>(`${this.getAPI()}/${id}`, contract);
  }

}

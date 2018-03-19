import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Client } from '../models/client';

@Injectable()
export class ClientService {

    protected apiUrl: string = 'http://0.0.0.0:3000/clients';

    constructor(private http: HttpClient) { }

    save(client: Client): Observable<Client> {
        client.setCreationDate();
        client.setModifiedDate();
        return this.http.post<Client>(this.apiUrl, client);
    }

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.apiUrl);
    }

    getClientsWithContracts(): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.apiUrl}?_embed=contracts`);
    }

    get(id: string): Observable<Client> {
        return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }

    getByName(name: string): Observable<Client[]>{
        return this.http.get<Client[]>(`${this.apiUrl}?name_like=${name}`);
    }

    delete(id: string): Observable<Client> {
        return this.http.delete<Client>(`${this.apiUrl}/${id}`);
    }

    put(id: string, client: Client): Observable<Client>{
        client.setModifiedDate();
        return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
    }

}

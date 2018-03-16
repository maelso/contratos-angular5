import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Client } from '../models/client';

@Injectable()
export class ClientService {

    protected apiUrl: string = 'http://0.0.0.0:3000/client';

    constructor(private http: HttpClient) { }

    getAPI() {
        return this.apiUrl;
    }

    save(client: Client): Observable<Client> {
        return this.http.post<Client>(this.getAPI(), client);
    }

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.getAPI());
    }

    get(id: string): Observable<Client> {
        return this.http.get<Client>(`${this.getAPI()}/${id}`);
    }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Client } from '../models/client';

@Injectable()
export class ClientService {

    protected apiUrl: string = 'http://0.0.0.0:3000/client';

    constructor(private http: Http) { }

    getAPI() {
        return this.apiUrl;
    }

    save(client: Client) {
        let url = `${this.getAPI()}`;
        return this.http.post(url, client.getApiPostData()).map((res: Response) => {
            let results = res.json();
            return results;
        }).catch((error: Response | any) => {
            let errorResponse = error.json(),
                errorMessage = (errorResponse.ErrorId && errorResponse.Message) ?
                    'Error ' + errorResponse.ErrorId + ': ' + errorResponse.Message : 'Error connecting to the API. Please try again.';
            alert(errorMessage); window.location.reload(true);
            return Observable.throw(error);
        });

    }

    getClientes() {
        let url = `${this.getAPI()}`;
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            }).catch((error: Response | any) => {
                return Observable.throw(error);
            });
    }

}

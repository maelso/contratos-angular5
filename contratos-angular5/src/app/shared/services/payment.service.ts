import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../models/payment';

@Injectable()
export class PaymentService {

  protected apiUrl: string = 'http://0.0.0.0:3000/payments';

  constructor(private http: HttpClient) { }

  save(payment: Payment): Observable<Payment> {
    payment.setCreationDate();
    payment.setModifiedDate();
    console.log("SAVE PAY");
    return this.http.post<Payment>(this.apiUrl, payment);
  }

}

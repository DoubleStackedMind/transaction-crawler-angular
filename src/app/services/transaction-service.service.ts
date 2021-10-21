import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ITransaction } from '../@models/transaction.interface';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionServiceService {
  constructor(private http: HttpClient, private route: Router) {}

  getTransactions(): Observable<ITransaction[]> {
    let params = new HttpParams();
    params = params.append(
      'address',
      '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8'
    );
    params = params.append('action', 'txlist');

    return this.http
      .get<ITransaction[]>(environment.apiUrl + '/web3/get-transaction', {
        params,
      })
      .pipe(catchError(this.HandleError));
  }

  getBalance(address: string, date: string): any {
    let params = new HttpParams();
    params = params.append('address', address);
    params = params.append('date', date);
    console.log(environment.apiUrl + '/web3/get-balance');
    return this.http
      .get<BalanceAPI>(environment.apiUrl + '/web3/get-balance', { params })
      .pipe(
        tap((data) => console.log('All In One: ' + JSON.stringify(data.data))),
        catchError(this.HandleError)
      );
  }

  private HandleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(JSON.stringify(errorMessage));
    alert('Bad Request with a correct wallet address or not a future date');
    return throwError(errorMessage);
  }
}

export interface BalanceAPI {
  data: string;
}

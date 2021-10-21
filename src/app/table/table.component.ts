import { AfterViewInit, OnInit, Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSort, SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { ITransaction } from '../@models/transaction.interface';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements AfterViewInit {
  displayedColumns: string[] = ['from', 'to', 'value'];
  exampleDatabase: HttpDatabase | null;
  data: ITransaction[] = [];
  refresh: boolean = false;
  address: string;
  action: string;
  block: string;

  resultsLength = 20;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private _httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private _location: Location
  ) {
    this.address = this.activatedRoute.snapshot.params.address;
    this.action = this.activatedRoute.snapshot.params.action;
    this.block = this.activatedRoute.snapshot.params.block;
  }

  ngAfterViewInit() {
    this.exampleDatabase = new HttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 1));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getTransacions(
            this.address,
            this.action,
            this.block,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex + 1
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          console.log(data.data);
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = 200;
          return data.data;
        })
      )
      .subscribe((data) => (this.data = data));
  }

  GoBack() {
    this._location.back();
  }

  public LoadMoreTransactions(event?: PageEvent) {
    return event;
  }
}

export interface TransactionAPI {
  items: ITransaction[];
  total_count: number;
}

export class HttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getTransacions(
    address,
    action,
    block,
    sort: string,
    order: SortDirection,
    page: number
  ): Observable<TransactionAPI> {
    const href = environment.apiUrl + '/web3/get-transaction';
    const requestUrl = `${href}?address=${address}&action=${action}&page=${page}&block=${block}`;
    return this._httpClient.get<TransactionAPI>(requestUrl);
  }
}

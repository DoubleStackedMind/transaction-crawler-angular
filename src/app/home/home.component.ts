import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { TransactionServiceService } from '../services/transaction-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'transaction-crawler-angular';
  value = '';
  block = '';
  action = '';
  givenDate = '';
  balance = '';
  address = '';
  constructor(
    private router: Router,
    private transactionService: TransactionServiceService
  ) {}

  ngOnInit(): void {}

  public GetTransactions() {
    this.router.navigate([
      'transactions',
      { address: this.value, action: this.action, block: this.block },
    ]);
  }

  getBalance() {
    const momentDate = new Date(this.givenDate); // Replace event.value with your date value
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');

    console.log(formattedDate);
    this.transactionService
      .getBalance(this.address, formattedDate)
      .subscribe((result: any) => {
        console.log(result);
        alert(
          `The wallet balance at the give date is ${JSON.stringify(
            result.data
          )} ETH`
        );
      });
  }
}

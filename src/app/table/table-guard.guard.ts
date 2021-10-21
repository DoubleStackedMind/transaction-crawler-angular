import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableGuardGuard implements CanActivate {
  constructor(private route: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let address = next.paramMap.get('address');
    let action = next.paramMap.get('action');
    let block = next.paramMap.get('block');
    if (
      (typeof address != 'undefined' && address) ||
      (typeof action != 'undefined' && action) ||
      (typeof block != 'undefined' && block)
    ) {
      this.route.navigate(['/']);
      return false;
    }
    return true;
  }
}

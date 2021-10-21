import { TestBed } from '@angular/core/testing';

import { TableGuardGuard } from './table-guard.guard';

describe('TableGuardGuard', () => {
  let guard: TableGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TableGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed, async, inject } from '@angular/core/testing';

import { SchoolAdminGuard } from './school-admin.guard';

describe('SchoolAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchoolAdminGuard]
    });
  });

  it('should ...', inject([SchoolAdminGuard], (guard: SchoolAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});

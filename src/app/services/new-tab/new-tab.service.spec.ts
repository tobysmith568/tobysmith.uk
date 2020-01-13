import { TestBed } from '@angular/core/testing';

import { NewTabService } from './new-tab.service';

describe('NewTabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewTabService = TestBed.get(NewTabService);
    expect(service).toBeTruthy();
  });
});

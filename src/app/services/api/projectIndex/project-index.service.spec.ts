import { TestBed } from '@angular/core/testing';

import { ProjectIndexService } from './project-index.service';

describe('ProjectIndexService', () => {
  let service: ProjectIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

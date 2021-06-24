import { TestBed } from "@angular/core/testing";

import { FourOhFourService } from "./four-oh-four.service";

describe("FourOhFourService", () => {
  let service: FourOhFourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FourOhFourService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

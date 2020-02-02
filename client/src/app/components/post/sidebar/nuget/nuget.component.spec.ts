import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NugetComponent } from "./nuget.component";

describe("NugetComponent", () => {
  let component: NugetComponent;
  let fixture: ComponentFixture<NugetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NugetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NugetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

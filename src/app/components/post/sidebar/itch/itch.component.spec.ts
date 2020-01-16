import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ItchComponent } from "./itch.component";

describe("ItchComponent", () => {
  let component: ItchComponent;
  let fixture: ComponentFixture<ItchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

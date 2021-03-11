import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SmallPostComponent } from "./small-post.component";

describe("SmallPostComponent", () => {
  let component: SmallPostComponent;
  let fixture: ComponentFixture<SmallPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

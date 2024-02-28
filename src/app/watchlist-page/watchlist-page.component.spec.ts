import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistPageComponent } from './watchlist-page.component';

describe('WatchlistPageComponent', () => {
  let component: WatchlistPageComponent;
  let fixture: ComponentFixture<WatchlistPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WatchlistPageComponent]
    });
    fixture = TestBed.createComponent(WatchlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

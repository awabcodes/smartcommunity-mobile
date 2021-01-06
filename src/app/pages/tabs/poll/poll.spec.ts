import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PollPage } from './poll';

describe('PollPage', () => {
  let component: PollPage;
  let fixture: ComponentFixture<PollPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PollPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot(), NgxWebstorageModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

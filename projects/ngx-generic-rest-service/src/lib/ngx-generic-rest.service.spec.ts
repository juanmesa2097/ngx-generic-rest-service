import { TestBed } from '@angular/core/testing';
import { NgxGenericRestService } from './ngx-generic-rest.service';

describe('NgxGenericRestServiceService', () => {
  let service: NgxGenericRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxGenericRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

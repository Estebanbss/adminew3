import { TestBed } from '@angular/core/testing';

import { AtractivosService } from './atractivos.service';

describe('AtractivosService', () => {
  let service: AtractivosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtractivosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

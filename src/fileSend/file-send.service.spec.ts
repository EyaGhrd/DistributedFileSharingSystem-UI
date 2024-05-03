import { TestBed } from '@angular/core/testing';

import { FileSendService } from './file-send.service';

describe('FileSendService', () => {
  let service: FileSendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileSendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

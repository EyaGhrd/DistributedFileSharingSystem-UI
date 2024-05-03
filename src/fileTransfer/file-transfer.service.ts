  import { Injectable } from '@angular/core';
  import {HttpClient} from "@angular/common/http";
  import {Observable} from "rxjs";

  @Injectable({
    providedIn: 'root'
  })
  export class FileTransferService {

    constructor(private http: HttpClient) {}


    getFiles(): Observable<string[]> {
      return this.http.get<string[]>('http://localhost:8088/api/files');
    }
  }

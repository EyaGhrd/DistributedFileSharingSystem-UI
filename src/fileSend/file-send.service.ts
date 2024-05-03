import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileSendService {

  private apiUrl = 'http://localhost:8089/request-file'; // URL to web API

  constructor(private http: HttpClient) {}

  requestFile(fileName: string): Observable<any> {
    // Specify content type as text/plain in the headers
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });

    return this.http.post(this.apiUrl, fileName, { headers, responseType: 'text' });
  }
}

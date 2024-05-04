import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor(private http: HttpClient) {}
  downloadFile(filename: string): Observable<Blob> {
    const url = `http://localhost:8091/download-file?filename=${filename}`;
    return this.http.get(url, {
      responseType: 'blob'
    });
  }
}

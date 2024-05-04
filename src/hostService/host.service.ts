import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HostService {

  private hostUrl = 'http://localhost:8090/host-id'; // Adjust as needed

  constructor(private http: HttpClient) { }

  getHostID(): Observable<{ hostID: string }> {
    return this.http.get<{ hostID: string }>(this.hostUrl);
  }
}

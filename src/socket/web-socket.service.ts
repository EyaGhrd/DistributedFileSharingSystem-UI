import { Injectable } from '@angular/core';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {catchError, EMPTY, Observable, share, Subject, switchAll, switchMap, tap, throwError} from "rxjs";
import {webSocket} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable().pipe(share());

  constructor() {
    this.socket$ = this.createWebSocket();
    this.listenMessages();
  }

  private createWebSocket(): WebSocketSubject<any> {
    return webSocket({
      url: 'ws://localhost:8081/ws',
      deserializer: msg => msg.data
    });
  }

  private listenMessages(): void {
    this.socket$.subscribe(
      message => this.messagesSubject.next(message),
      error => {
        console.error('WebSocket error:', error);
        this.reconnect();
      },
      () => console.log('WebSocket connection closed')
    );
  }

  private reconnect(): void {
    setTimeout(() => {
      this.socket$ = this.createWebSocket();
      this.listenMessages();
    }, 1000);
  }

  public sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      console.error('WebSocket connection not established');
    }
  }

  public closeConnection(): void {
    this.socket$.complete();
  }
}

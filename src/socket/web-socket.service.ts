import { Injectable } from '@angular/core';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {catchError, EMPTY, Observable, share, Subject, switchAll, switchMap, tap, throwError} from "rxjs";
import {webSocket} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<PeerMessage>;
  private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable().pipe(share());

  constructor() {
    this.socket$ = this.createWebSocket();
    this.listenMessages();
  }

  private createWebSocket(): WebSocketSubject<any> {
    return webSocket({
      url: 'ws://localhost:8082/ws',
      deserializer: msg => this.parseMessage(msg.data)
    });
  }

  private parseMessage(data: string): PeerMessage | null {
    const regex = /Status: (\w+), Peer ID: ([\w\d]+), Addresses: (\[.*?\])/;
    const matches = regex.exec(data);
    if (matches && matches.length === 4) {
      const status = matches[1];
      const peerId = matches[2];
      const addressesString = matches[3];

      // Parse addresses manually
      const addresses = this.parseAddresses(addressesString);

      return { status, peerId, addresses };
    }
    return null;
  }

  private parseAddresses(addressesString: string): string[] {
    // Remove the surrounding brackets and split by space
    return addressesString.replace(/[\[\]]/g, '').split(' ');
  }


  private extractAddresses(addressesString: string): string[] {
    // Remove the surrounding brackets
    addressesString = addressesString.substring(1, addressesString.length - 1);

    // Split by comma and trim spaces
    return addressesString.split(/\s*,\s*/);
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
interface PeerMessage {
  status: string;
  peerId: string;
  addresses: string[];
}

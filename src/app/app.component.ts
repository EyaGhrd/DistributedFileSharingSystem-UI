import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {catchError, EMPTY, Observable, of, Subscription, switchMap, timer} from "rxjs";
import { CommonModule } from '@angular/common';
import {WebSocketService} from "../socket/web-socket.service";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  private messagesSubscription: Subscription = EMPTY.subscribe();
  files: any[] = [{name: 'Sample.pdf'}, {name: 'Example.txt'}]; // Example files
  selectedFile: any;

  discoveredPeers: PeerMessage[] = [];
  connectedPeers: PeerMessage[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.messagesSubscription = this.webSocketService.messages$.subscribe(
      message => {
        if (message.status === 'discovered') {
          this.updateDiscoveredPeers(message);
        } else if (message.status === 'connected') {
          this.updateConnectedPeers(message);
        }
      },
      error => console.error('Error receiving messages:', error)
    );
  }

  private updateDiscoveredPeers(peer: PeerMessage): void {
    // Optionally, check if the peer is already in the list to avoid duplicates
    if (!this.discoveredPeers.some(p => p.peerId === peer.peerId)) {
      this.discoveredPeers.push(peer);
    }
  }

  private updateConnectedPeers(peer: PeerMessage): void {
    // Add to connected peers, possibly removing from discovered if necessary
    if (!this.connectedPeers.some(p => p.peerId === peer.peerId)) {
      this.connectedPeers.push(peer);
      // Optionally, remove from discovered
      this.discoveredPeers = this.discoveredPeers.filter(p => p.peerId !== peer.peerId);
    }
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
  }

  selectFile(file: any): void {
    this.selectedFile = file;
  }

  downloadFile(): void {
    if (this.selectedFile) {
      console.log('Downloading:', this.selectedFile.name);
      // Implement file download logic here
    }
  }
}
interface PeerMessage {
  status: string;
  peerId: string;
  addresses: string[];
}

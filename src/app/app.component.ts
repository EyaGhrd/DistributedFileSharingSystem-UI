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

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.messagesSubscription = this.webSocketService.messages$.subscribe(
      message => this.messages.push(message),
      error => console.error('Error receiving messages:', error)
    );
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
    this.webSocketService.closeConnection();
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

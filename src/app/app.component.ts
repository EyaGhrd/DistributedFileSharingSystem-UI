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
}

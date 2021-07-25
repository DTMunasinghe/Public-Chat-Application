import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  txtMessage: string;
  public messages: Message[];
  message: Message;
  public history: Message[];
  private destroyed$: Subject<void>;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.initializeData();
    this.subscribeToEvents();
    this.chatService.getHistoryOfMessages()
      .pipe(takeUntil(this.destroyed$), map(val => <Message[]>val))
        .subscribe(res => {
          this.history = res;
        },
        error => {
          console.log(error);
        });
  }

  private initializeData(): void {
    this.txtMessage = '';
    this.message = new Message();
    this.history = [];
    this.messages = [];
    this.destroyed$ = new Subject();
  }

  // Used NgZone for better performance.
  // So basically, handlers won't run inside Angular's Zone, 
  // Angular won't get notified that a task is done and therefore no change detection will be performed
  private subscribeToEvents(): void {
    this.chatService.messageReceived
      .subscribe((message: Message) => {
        this.ngZone.run(() => {    
          this.messages.push(message);  
        });
    });
  }

  public sendMessage(): void {
    if (this.txtMessage) {
      this.message.sender = localStorage.getItem('userName');
      this.message.message = this.txtMessage;
      this.message.date = new Date();
      this.chatService.sendMessage(this.message);
      this.txtMessage = '';
    }
  }

  public onLogout(): void {
    this.userService.logout();
  } 

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.chatService.stopSignalR();
  }

}

import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Observable } from "rxjs";
import { Message } from "../models/message.model";

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    messageReceived = new EventEmitter<Message>();
    readonly BaseURI = 'http://localhost:5000/api';

    private _hubConnection: HubConnection;

    constructor(
        private http: HttpClient) {
            this.init();
        }

    init(): void {
        this.createConnection();
        this.startConnection();
    }

    private createConnection(): void {
        this._hubConnection = new HubConnectionBuilder()
          .withUrl('http://localhost:5000/chat')
          .build();
    }

    private async startConnection(): Promise<void> {
        await this._hubConnection
          .start()
          .then(() => {
            console.log('Hub connection started');   
            this.registerOnServerEvents();
          })
          .catch(error => {
            console.log('Error while establishing connection, retrying...');
            setTimeout(function () { this.startConnection(); }, 5000);
          });
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on('MessageReceived', (data: Message) => {
          this.messageReceived.emit(data);
        });
    }

    public sendMessage(message: Message): void {
        this._hubConnection.onclose(() => {
            this.init();
        });
        this._hubConnection.invoke('NewMessage', message);
    }

    public getHistoryOfMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(this.BaseURI + '/messages');
    }

    public stopSignalR(): void {
        this._hubConnection.stop();
    }
}

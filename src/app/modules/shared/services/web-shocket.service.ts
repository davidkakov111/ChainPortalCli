import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class WebShocketService {
  private serverSocket!: Socket;

  constructor(private serverSrv: ServerService) {}

  connect() {
    this.serverSocket = new Socket({url: this.serverSrv.serverEndpoint, options: {}});
  }

  disConnect() {
    this.serverSocket.disconnect();
  }

  sendMessageToServerSocket(event: string, data: any) {
    this.serverSocket.emit(event, data);
  }

  receiveMessageFromServerSocket<T>(event: string) {
    return this.serverSocket.fromEvent<T>(event);
  }
}

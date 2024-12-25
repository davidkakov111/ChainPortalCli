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

  receiveMessageFromServerSocket(event: string) {
    return this.serverSocket.fromEvent(event);
  }
}

// ? How to use it? Example:
// updates: string[] = [];

// mintNft() {
//   this.wsSrv.connect();
//   this.wsSrv.sendMessageToServerSocket('mint-nft', { data: 'Start minting NFT' });

//   this.wsSrv.receiveMessageFromServerSocket('mint-nft-status').subscribe((message: any) => {
//     this.updates.push('NFT Minting Status: ' + message);
//   });

//   this.wsSrv.receiveMessageFromServerSocket('mint-nft-error').subscribe((message: any) => {
//     this.updates.push('NFT Minting Error: ' + message);
//   });
// }
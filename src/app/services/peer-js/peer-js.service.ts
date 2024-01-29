import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PeerConfiguration } from 'src/app/shared/peerjs/peer-configuration';
import { PeerInstance } from 'src/app/shared/peerjs/peer-instance';

@Injectable({
  providedIn: 'root'
})
export class PeerJsService {
  public connectionSubject = new BehaviorSubject<PeerInstance>(null!);
  readonly connection = this.connectionSubject.asObservable();
  peerConnection: PeerInstance | undefined = undefined;
  peerConfiguration: PeerConfiguration | undefined = undefined;

  constructor() {
    this.peerConfiguration = new PeerConfiguration();
    this.peerConfiguration.host = '0.peerjs.com';
    this.peerConfiguration.port = 443;
    this.peerConfiguration.secure = true;
    this.peerConfiguration.pingInterval = 2000;
    this.peerConfiguration.iceServers = ['stun:stun.l.google.com:19302'];
  }

  connect(nickname: string, connectedCallback: () => void) {
    if(this.peerConnection !== undefined) {
      this.peerConnection.connected.unsubscribe();
    }
    console.log('Create PeerConnection Instance');

    this.peerConnection = new PeerInstance(nickname, this.peerConfiguration!);
    this.peerConnection.connected.subscribe((isConnected) => {
      if(isConnected) {
        console.log('Notify new peerConnection instance');
        connectedCallback();
        this.connectionSubject.next(this.peerConnection!);
      }
    });
  }

  disconnect() {
    if(this.connectionSubject.value !== null) {
      this.connectionSubject.getValue().destroy();
      this.connectionSubject.next(null!);
      console.log('Disconnect.');
    }
  }
}

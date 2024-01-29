import { Component, inject, OnInit, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy, EventEmitter, AfterViewInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Clipboard } from '@capacitor/clipboard';

import { Subscription } from 'rxjs';

import { PeerJsService } from '../services/peer-js/peer-js.service';
import { PeerInstance } from '../shared/peerjs/peer-instance';
import { PeerConnection } from '../shared/peerjs/peer-connection';
import { PeerConfiguration } from '../shared/peerjs/peer-configuration';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy, AfterContentInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  nickname!: string;
  peerId!: string;
  connectionList!: Array<PeerConnection>;
  mediaStreams!: Array<PeerConnection>;
  newPeerId = '';
  streaming = false;
  connection: PeerInstance = undefined!;
  peerConnectionSubscription!: Subscription;
  newConnection: PeerConnection = undefined!;
  showConnectionDialog = false;
  configuration!: PeerConfiguration;
  focusedConnection: PeerConnection = undefined!;
  hasFocusedConnection = false;

  mediaStreamSelected: EventEmitter<MediaStream> = new EventEmitter();

  media!: MediaStream;
  @ViewChild('streamVideo') videoElement!: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private peerJsService: PeerJsService,
  ) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;

    this.connectionList = new Array<PeerConnection>();
    this.hasFocusedConnection = false;
    this.focusedConnection = undefined!;

    this.nickname = '';
    this.peerId = '';
  }

  ngOnDestroy() {
    this.peerConnectionSubscription.unsubscribe();
  }

  ngAfterContentInit() {
    this.peerConnectionSubscription = this.peerJsService.connection.subscribe(
      (connection: PeerInstance | null) => {
        if (connection === null || connection === undefined) {
          console.log('No peer connection exists');
          this.connection = undefined!;
          setTimeout(() => {
            // this.router.navigate(['home']);
            this.cdr.detectChanges();
          }, 200);
          return;
        }
        if (this.connection !== undefined) {
          return;
        }
        console.log('PeerInstance: ', connection);

        this.connection = connection;

        connection?.onNewPeerConnectedEvent.subscribe(
          (newConnection: PeerConnection) => {
            this.connectionList.push(newConnection);
            // TODO: If another peer connects, the previous popup gets overwritten.
            if (newConnection.selfInitiated) {
              this.newConnection = newConnection;
              this.showConnectionDialog = true;
            }
            console.log(newConnection.nickname, 'Peer connected');
          }
        );
        connection?.onPeerDisconnectedEvent.subscribe(
          (removedPeer: PeerConnection) => {
            const n = this.connectionList.findIndex(
              (value) => value.id === removedPeer.id
            );
            console.log(n);
            if (n !== -1) {
              console.log(removedPeer.nickname, 'Peer disconnected');
              this.connectionList.splice(n, 1);
            }
          }
        );
        connection?.onMediaStreamsChanged.subscribe(
          (mediaStreams: PeerConnection[]) => {
            console.log(mediaStreams);
            this.mediaStreams = mediaStreams;
          }
        );
        connection?.onStoppedStreaming.subscribe(() => {
          this.streaming = false;
        });
        this.nickname = connection?.nickname;
        this.peerId = connection?.id;
        this.cdr.detectChanges();
      }
    );
    this.configuration = this.peerJsService.peerConfiguration!;
  }

  onStreamSelected(stream: MediaStream) {
    this.connection?.startStream(stream);
    this.streaming = true;
    this.cdr.detectChanges();
  }

  async copyMyId() {
    await Clipboard.write({
      string: this.peerId
    });
    console.log('Copied ID!');
  }

  disconnect() {
    this.peerJsService.disconnect();
  }

  addPeer() {
    this.connection?.addPeer(this.newPeerId);
    this.newPeerId = '';
  }

  removePeer(peerId: string) {
    this.connection?.removePeer(peerId);
  }

  openStreamScreenPicker() {
    if (this.streaming) {
      this.connection?.stopStream();
    } else {
      navigator.mediaDevices.getDisplayMedia().then((stream) => {
        console.log('stream', stream);
        
        this.mediaStreamSelected.emit(stream);
      });
    }
  }

  toggleFocus(connection: PeerConnection) {
    console.log('focus');
    if (this.focusedConnection === undefined && connection !== undefined) {
      this.focusedConnection = connection;
      this.hasFocusedConnection = true;
    } else {
      this.hasFocusedConnection = false;
      this.focusedConnection = undefined!;
    }
  }

}

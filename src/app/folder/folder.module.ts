import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { StreamPeerBlockModule } from '../components/stream-peer-block/stream-peer-block.module';

// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// const config: SocketIoConfig = { url: 'http://localhost:443/', options: {} };

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    // SocketIoModule.forRoot(config),
    StreamPeerBlockModule
  ],
  declarations: [FolderPage]
})
export class FolderPageModule {}

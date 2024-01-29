import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamPeerBlockComponent } from './stream-peer-block.component';

@NgModule({
  declarations: [StreamPeerBlockComponent],
  imports: [
    CommonModule
  ],
  exports: [StreamPeerBlockComponent]
})
export class StreamPeerBlockModule { }

import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-stream-peer-block',
  templateUrl: './stream-peer-block.component.html',
  styleUrls: ['./stream-peer-block.component.scss'],
})
export class StreamPeerBlockComponent implements OnInit, AfterViewInit {
  @Input() media!: MediaStream;
  @Input() title!: string;
  @Input() focused!: boolean;
  @ViewChild('streamVideo') videoElement!: ElementRef;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.videoElement.nativeElement.onloadedmetadata = () => this.videoElement.nativeElement.play();
  }
}

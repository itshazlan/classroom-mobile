import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stream-screen-picker',
  templateUrl: './stream-screen-picker.component.html',
  styleUrls: ['./stream-screen-picker.component.scss'],
})
export class StreamScreenPickerComponent  implements OnInit {
  @Output() mediaStreamSelected: EventEmitter<MediaStream> = new EventEmitter();
  display = false;
  sources: any;

  constructor() { }

  ngOnInit() {}


}

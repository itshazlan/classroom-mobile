import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeerJsService } from 'src/app/services/peer-js/peer-js.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  nicknameField = '';
  missingNickname = false;
  loading = false;

  constructor(
    private peerJsService: PeerJsService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  tryConnect() {
    // Check nickname not empty
    if(this.nicknameField === '') {
      this.missingNickname = true;
      return;
    }
    this.missingNickname = false;

    this.loading = true;
    this.peerJsService.connect(this.nicknameField, () => {
      console.log('Connected?');
      this.loading = false;
      this.router.navigate(['folder']);
    });
  }
}

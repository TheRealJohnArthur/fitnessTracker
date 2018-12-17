import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import  { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getAuth);
  }

  onSidenavClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.authService.logout();
    this.onSidenavClose();
  }
}

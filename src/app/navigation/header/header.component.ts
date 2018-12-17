import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
  authSubscription: Subscription;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getAuth)
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

}

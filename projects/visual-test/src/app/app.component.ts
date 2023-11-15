import { Component } from '@angular/core';
import { NotificationService, Theme } from 'projects/angular-notification/src/public-api';

@Component({
  selector: 'bbb-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private readonly _notificationService: NotificationService) {
    NotificationService.setDefaultTheme(Theme.LIGHT);
  }

  showNotification() {
    this._notificationService.open({
      className: 'optional-class-name',
      content: 'This notification is <strong>important</strong>',
      theme: Theme.DARK
    });
  }
}

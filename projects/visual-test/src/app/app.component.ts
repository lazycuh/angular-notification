import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from 'projects/angular-notification/src/public-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'lc-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly _notificationService = inject(NotificationService);

  constructor() {
    NotificationService.setDefaultTheme('light');
  }

  showNotification() {
    this._notificationService.open({
      className: 'optional-class-name',
      content: 'This notification is <strong>important</strong>',
      theme: 'dark'
    });
  }
}

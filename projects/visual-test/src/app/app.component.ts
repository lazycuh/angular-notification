import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationService } from 'projects/angular-notification/src/public-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'lc-root',
  standalone: true,
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private readonly _notificationService: NotificationService) {
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

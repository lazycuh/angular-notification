import { ApplicationRef, createComponent, Injectable } from '@angular/core';

import { NotificationComponent } from './notification.component';
import { NotificationConfiguration } from './notification-configuration';
import { Theme } from './theme';

/**
 * A singleton service to programmatically show notifications.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /**
   * The number of milliseconds after which the notification is closed.
   */
  static readonly DEFAULT_AUTO_CLOSE_MS = 10_000;

  private static _defaultTheme: Theme = 'light';
  private static _defaultCloseButtonLabel = 'Close';

  constructor(private readonly _applicationRef: ApplicationRef) {}

  /**
   * Set the default theme that will be used for all notifications created in the future.
   *
   * @param theme The new theme to be used as the default.
   */
  static setDefaultTheme(theme: Theme) {
    NotificationService._defaultTheme = theme;
  }

  /**
   * Set the default label for the close button. Default is `Close`.
   */
  static setDefaultCloseButtonLabel(label: string) {
    NotificationService._defaultCloseButtonLabel = label;
  }

  /**
   * Open a notification using the provided configuration. The opened notification
   * will be closed automatically after 10 seconds by default.
   *
   * @param notificationConfiguration The notification configuration object.
   */
  open(notificationConfiguration: NotificationConfiguration) {
    const notificationComponentRef = createComponent(NotificationComponent, {
      environmentInjector: this._applicationRef.injector
    });
    const notificationComponent = notificationComponentRef.instance;

    notificationComponent.setAfterClosedListener(() => {
      notificationComponentRef.destroy();
    });

    if (notificationConfiguration.theme === undefined) {
      notificationConfiguration.theme = NotificationService._defaultTheme;
    }

    if (notificationConfiguration.closeButtonLabel === undefined) {
      notificationConfiguration.closeButtonLabel = NotificationService._defaultCloseButtonLabel;
    }

    notificationComponent.open(notificationConfiguration);

    this._applicationRef.attachView(notificationComponentRef.hostView);

    document.body.appendChild(notificationComponentRef.location.nativeElement);

    setTimeout(() => {
      notificationComponent.close();
    }, notificationConfiguration.autoCloseMs || NotificationService.DEFAULT_AUTO_CLOSE_MS);
  }
}

import { Component, HostListener, ViewEncapsulation } from '@angular/core';

import { NotificationConfiguration } from './notification-configuration';
import { Theme } from './theme';

@Component({
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class]':
      '"bbb-notification " + (_theme + " ") + (_enter ? "enter" : "leave") + (_className ? " " + _className : "")'
  },
  selector: 'bbb-notification',
  styleUrls: ['./notification.component.scss'],
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  /**
   * The notification content.
   *
   * @private Used by template
   */
  _content!: string;

  /**
   * @private Used by template
   */
  _closeButtonLabel!: string;

  /**
   * Whether or not the notification is entering into view.
   *
   * @private Used by template
   */
  _enter = false;

  /**
   * @private Used by template
   */
  _theme = Theme.LIGHT;

  _className?: string;

  private _afterClosedListener?: () => void;

  open(notificationConfiguration: NotificationConfiguration) {
    const defaultCloseButtonLabel = 'Close';
    const defaultTheme = Theme.LIGHT;

    this._className = notificationConfiguration.className;
    this._closeButtonLabel = notificationConfiguration.closeButtonLabel || defaultCloseButtonLabel;
    this._content = notificationConfiguration.content;
    this._theme = notificationConfiguration.theme || defaultTheme;
    this._enter = true;
  }

  setAfterClosedListener(fn: () => void) {
    this._afterClosedListener = fn;
  }

  close() {
    this._enter = false;
  }

  @HostListener('animationend')
  _onAnimationEnd() {
    if (!this._enter) {
      this._afterClosedListener?.();
    }
  }
}

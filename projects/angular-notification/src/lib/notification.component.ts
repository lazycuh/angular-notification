import { ChangeDetectionStrategy, Component, HostListener, signal, ViewEncapsulation } from '@angular/core';

import { NotificationConfiguration } from './notification-configuration';
import { Theme } from './theme';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class]':
      // eslint-disable-next-line max-len
      '"lc-notification " + (_theme() + " ") + (_enter() ? "enter" : "leave") + (_className() ? " " + _className() : "")'
  },
  selector: 'lc-notification',
  styleUrls: ['./notification.component.scss'],
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  protected readonly _content = signal('');
  protected readonly _closeButtonLabel = signal('');
  /**
   * Whether or not the notification is entering into view.
   */
  protected readonly _enter = signal(false);
  protected readonly _theme = signal<Theme>('light');
  protected readonly _className = signal<string | undefined>(undefined);

  private _afterClosedListener?: () => void;

  open(notificationConfiguration: NotificationConfiguration) {
    const defaultCloseButtonLabel = 'Close';
    const defaultTheme: Theme = 'light';

    this._className.set(notificationConfiguration.className);
    this._closeButtonLabel.set(notificationConfiguration.closeButtonLabel || defaultCloseButtonLabel);
    this._content.set(notificationConfiguration.content);
    this._theme.set(notificationConfiguration.theme || defaultTheme);
    this._enter.set(true);
  }

  setAfterClosedListener(fn: () => void) {
    this._afterClosedListener = fn;
  }

  close() {
    this._enter.set(false);
  }

  @HostListener('click', ['$event'])
  protected _onPreventClickEventFromBubbling(event: Event) {
    event.stopPropagation();
  }

  @HostListener('animationend')
  protected _onAnimationEnd() {
    if (!this._enter()) {
      this._afterClosedListener?.();
    }
  }
}

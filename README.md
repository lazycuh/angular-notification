# angular-notification

A singleton, global Angular service to programmatically render notifications.

## Installation

- `npm`
  ```
  npm i -S @babybeet/angular-notification
  ```
- `pnpm`
  ```
  pnpm i -S @babybeet/angular-notification
  ```
- `yarn`
  ```
  yarn add @babybeet/angular-notification
  ```

## Available APIs

These are the symbols that are available from this package

```typescript
/**
 * A singleton Angular service to programmatically show notifications.
 */
class NotificationService {
  /**
   * Set the default theme that will be used for all notifications created in the future.
   *
   * @param theme The new theme to be used as the default.
   */
  static setDefaultTheme(theme: Theme): void;

  /**
   * Open a notification using the provided configuration. The opened notification
   * will be closed automatically after 10 seconds by default.
   *
   * @param notificationConfiguration The notification configuration object.
   */
  open(notificationConfiguration: NotificationConfiguration);
}
```

<br/>

```typescript
/**
 * The configuration object for the notification to be created.
 */
interface NotificationConfiguration {
  /**
   * The optional number of milliseconds after which the notification is closed. Default is 10 seconds.
   */
  autoCloseMs?: number;

  /**
   * The optional class name to add for this notification.
   */
  className?: string;

  /**
   * The optional label for the notification's close button. Default is `Close`.
   */
  closeButtonLabel?: string;

  /**
   * The required notification content to show. HTML is supported.
   */
  content: string;

  /**
   * The optional theme for the floating box. Default is `Theme.LIGHT`.
   */
  theme?: Theme;
}
```

<br/>

```typescript
const enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
```

<br/>

## Example Usage

### Code example

```typescript
// Import the service into your class to start using it
import { NotificationService } from '@babybeet/angular-notification';

@Component({
  selector: 'test-component',
  template: `
    <button
      type="button"
      (click)="showNotification()">
      Click me
    </button>
  `
})
export class TestComponent {
  constructor(private readonly notificationService: NotificationService) {}

  showNotification() {
    this.notificationService.open({
      content: 'This notification is very <strong>important</strong>'
    });
  }
}
```

### Result

| Theme |                                                                                |
| ----- | ------------------------------------------------------------------------------ |
| Light | ![Example for notification with light theme](./docs/example-1-light-theme.gif) |
| Dark  | ![Example for notification with dark theme](./docs/example-2-dark-theme.gif)   |

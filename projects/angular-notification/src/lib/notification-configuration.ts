import { Theme } from './theme';

/**
 * The configuration object for the notification to be created.
 */
export interface NotificationConfiguration {
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
   * The optional theme for the floating box. Default is `light`.
   */
  theme?: Theme;
}

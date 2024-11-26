import { Theme } from './theme';

/**
 * The configuration object for the notification to be created.
 */
export interface NotificationConfiguration {
  /**
   * The optional number of milliseconds after which the notification is closed. Default is 30 seconds.
   */
  autoCloseMs?: number;

  /**
   * Whether to bypass Angular's default sanitization rules for HTML content (such as removing inline style).
   * Default is `false`.
   */
  bypassHtmlSanitization?: boolean;

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
   *
   * If the HTML content contains inline style, it will be stripped out by Angular's default sanitization step,
   * to bypass this behavior, pass `true` to `bypassHtmlSanitization` option.
   */
  content: string;

  /**
   * The optional theme for the floating box. Default is `light`.
   */
  theme?: Theme;
}

/* eslint-disable @stylistic/quotes */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { delayBy, renderComponent } from 'projects/angular-notification/test/helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotificationService } from './notification.service';
import { NotificationConfiguration } from './notification-configuration';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lc-test',
  template: '<ng-container />'
})
export class TestBedComponent {
  private readonly _service = inject(NotificationService);

  openNotification(config: Partial<NotificationConfiguration> = {}) {
    this._service.open({
      content: 'This notification is important',
      ...config
    });
  }
}

describe('NotificationService', () => {
  const classSelectorPrefix = '.lc-notification';
  let testBedComponent: TestBedComponent;

  beforeEach(async () => {
    const renderResult = await renderComponent(TestBedComponent);
    testBedComponent = renderResult.fixture.componentInstance;
  });

  it('Should render a notification with the provided content', async () => {
    testBedComponent.openNotification({
      content: 'Hello World'
    });

    await delayBy(16);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('Should render a notification with the provided content as HTML', async () => {
    testBedComponent.openNotification({
      content: '<strong>Hello World</strong>'
    });

    await delayBy(16);

    expect(document.body.querySelector(`${classSelectorPrefix}__content`)!.innerHTML).toEqual(
      '<strong>Hello World</strong>'
    );
  });

  it('Should sanitize/strip out inline style by default', async () => {
    testBedComponent.openNotification({
      content: '<strong style="font-weight: bold">Hello World</strong>'
    });

    await delayBy(16);

    expect(document.body.querySelector(`${classSelectorPrefix}__content`)!.innerHTML).toEqual(
      '<strong>Hello World</strong>'
    );
  });

  it('Should not sanitize/strip out inline style when bypass option is provided', async () => {
    testBedComponent.openNotification({
      bypassHtmlSanitization: true,
      content: '<strong style="font-weight: bold">Hello World</strong>'
    });

    await delayBy(16);

    expect(document.body.querySelector(`${classSelectorPrefix}__content`)!.innerHTML).toEqual(
      '<strong style="font-weight: bold">Hello World</strong>'
    );
  });

  it("Should render a notification whose close button's label has the provided value", async () => {
    testBedComponent.openNotification({
      closeButtonLabel: 'Dismiss'
    });

    await delayBy(16);

    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('Should use light theme by default', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    expect(document.body.querySelector(`${classSelectorPrefix}.light`)).toBeInTheDocument();
  });

  it('Should be able to configure a different default theme', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    expect(document.body.querySelector(`${classSelectorPrefix}.dark`)!).not.toBeInTheDocument();
    expect(document.body.querySelector(`${classSelectorPrefix}.light`)!).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByText('Close'));

    await delayBy(500);

    NotificationService.setDefaultTheme('dark');

    testBedComponent.openNotification();

    await delayBy(16);

    expect(document.body.querySelector(`${classSelectorPrefix}.light`)!).not.toBeInTheDocument();
    expect(document.body.querySelector(`${classSelectorPrefix}.dark`)!).toBeInTheDocument();

    // Set back to the expected default
    NotificationService.setDefaultTheme('light');
  });

  it('Should render with the provided theme', async () => {
    testBedComponent.openNotification({
      theme: 'dark'
    });

    await delayBy(16);

    expect(document.body.querySelector(`${classSelectorPrefix}.light`)!).not.toBeInTheDocument();
    expect(document.body.querySelector(`${classSelectorPrefix}.dark`)!).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByText('Close'));

    await delayBy(500);

    testBedComponent.openNotification({
      theme: 'light'
    });

    await delayBy(16);

    expect(document.body.querySelector(`${classSelectorPrefix}.dark`)!).not.toBeInTheDocument();
    expect(document.body.querySelector(`${classSelectorPrefix}.light`)!).toBeInTheDocument();
  });

  it('Should add the provided class name', async () => {
    testBedComponent.openNotification({
      className: 'hello-world'
    });

    await delayBy(16);

    expect(document.body.querySelector(`${classSelectorPrefix}.hello-world`)!).toBeInTheDocument();
  });

  it('Should auto close by default', async () => {
    vi.useFakeTimers();

    testBedComponent.openNotification({
      content: 'Hello World'
    });

    await vi.advanceTimersByTimeAsync(16);

    expect(screen.getByText('Hello World')).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(NotificationService.DEFAULT_AUTO_CLOSE_MS);

    vi.useRealTimers();

    await delayBy(500);

    expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
  });

  it('Should auto close after the provided value', async () => {
    vi.useFakeTimers();

    testBedComponent.openNotification({
      autoCloseMs: 500,
      content: 'Hello World'
    });

    await vi.advanceTimersByTimeAsync(16);

    expect(screen.getByText('Hello World')).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(10_000);

    vi.useRealTimers();

    await delayBy(500);

    expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
  });

  it('Should insert the rendered notification as the direct child of body element', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    expect(document.body.lastElementChild).toEqual(document.querySelector(classSelectorPrefix));
  });

  it('Should use "Close" as label for close button by default', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('Should be able to configure a different default label for close button', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    expect(screen.getByText('Close')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByText('Close'));

    await delayBy(500);

    NotificationService.setDefaultCloseButtonLabel('Dismiss');

    testBedComponent.openNotification();

    await delayBy(16);

    expect(screen.getByText('Dismiss')).toBeInTheDocument();

    // Set back to the expected default
    NotificationService.setDefaultCloseButtonLabel('Close');
  });

  it('Should prevent click events from bubbling up', async () => {
    const clickHandlerSpy = vi.fn();

    window.addEventListener('click', clickHandlerSpy, false);

    testBedComponent.openNotification();

    await delayBy(16);

    expect(document.querySelector(`${classSelectorPrefix}.light`)).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByText('Close'));

    await delayBy(500);

    expect(document.querySelector(`${classSelectorPrefix}.light`)).not.toBeInTheDocument();

    expect(clickHandlerSpy).not.toHaveBeenCalled();

    window.removeEventListener('click', clickHandlerSpy, false);
  });

  it('Should close currently opened notification before opening a new one', async () => {
    testBedComponent.openNotification({
      autoCloseMs: 500,
      content: 'Hello World 1'
    });

    await delayBy(500);

    expect(
      document.body.querySelector(`${classSelectorPrefix}:first-of-type ${classSelectorPrefix}__content`)
    ).toHaveTextContent('Hello World 1');

    testBedComponent.openNotification({
      autoCloseMs: 500,
      content: 'Hello World 2'
    });

    await delayBy(500);

    expect(document.querySelectorAll(classSelectorPrefix)).toHaveLength(1);

    expect(
      document.body.querySelector(`${classSelectorPrefix}:first-of-type ${classSelectorPrefix}__content`)
    ).toHaveTextContent('Hello World 2');

    expect(
      document.body.querySelector(`${classSelectorPrefix}:last-of-type ${classSelectorPrefix}__content`)
    ).toHaveTextContent('Hello World 2');
  });

  it('Can change the default auto close ms', async () => {
    vi.useFakeTimers();

    NotificationService.setGlobalAutoCloseMs(3000);

    testBedComponent.openNotification({
      content: 'Hello World'
    });

    await vi.advanceTimersByTimeAsync(16);

    expect(screen.getByText('Hello World')).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(3000);

    vi.useRealTimers();

    await delayBy(500);

    expect(screen.queryByText('Hello World')).not.toBeInTheDocument();

    NotificationService.setGlobalAutoCloseMs(NotificationService.DEFAULT_AUTO_CLOSE_MS);
  });
});

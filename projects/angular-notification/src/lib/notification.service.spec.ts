/* eslint-disable @typescript-eslint/quotes */
import { Component, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  assertThat,
  delayBy,
  extractTextContent,
  fireEvent,
  getElementBySelector
} from '@babybeet/angular-testing-kit';

import { NotificationService } from './notification.service';
import { NotificationConfiguration } from './notification-configuration';

@Component({
  selector: 'lc-test',
  template: `<ng-container></ng-container>`
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TestBedComponent {
  constructor(private readonly _service: NotificationService) {}

  openNotification(config: Partial<NotificationConfiguration> = {}) {
    this._service.open({
      content: 'This notification is important',
      ...config
    });
  }
}

describe('NotificationService', () => {
  const classSelectorPrefix = '.lc-notification';
  let fixture: ComponentFixture<TestBedComponent>;
  let testBedComponent: TestBedComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestBedComponent],
      providers: [NotificationService, provideExperimentalZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestBedComponent);
    testBedComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('Should render a notification with the provided content', async () => {
    testBedComponent.openNotification({
      content: 'Hello World'
    });

    await delayBy(16);

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');
  });

  it('Should render a notification with the provided content as HTML', async () => {
    testBedComponent.openNotification({
      content: '<strong>Hello World</strong>'
    });

    await delayBy(16);

    expect(getElementBySelector(`${classSelectorPrefix}__content`).innerHTML.trim()).toEqual(
      '<strong>Hello World</strong>'
    );

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');
  });

  it(`Should render a notification whose close button's label has the provided value`, async () => {
    testBedComponent.openNotification({
      closeButtonLabel: 'Dismiss'
    });

    await delayBy(16);

    expect(extractTextContent(`${classSelectorPrefix}__action`).trim()).toEqual('Dismiss');
  });

  it('Should use light theme by default', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    assertThat(`${classSelectorPrefix}.light`).exists();
  });

  it('Should be able to configure a different default theme', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    assertThat(`${classSelectorPrefix}.dark`).doesNotExist();
    assertThat(`${classSelectorPrefix}.light`).exists();

    fireEvent(`${classSelectorPrefix}__action.close`, 'click');

    await delayBy(500);

    NotificationService.setDefaultTheme('dark');

    testBedComponent.openNotification();

    await delayBy(16);

    assertThat(`${classSelectorPrefix}.light`).doesNotExist();
    assertThat(`${classSelectorPrefix}.dark`).exists();

    // Set back to the expected default
    NotificationService.setDefaultTheme('light');
  });

  it('Should render with the provided theme', async () => {
    testBedComponent.openNotification({
      theme: 'dark'
    });

    await delayBy(16);

    assertThat(`${classSelectorPrefix}.light`).doesNotExist();
    assertThat(`${classSelectorPrefix}.dark`).exists();

    fireEvent(`${classSelectorPrefix}__action`, 'click');

    await delayBy(500);

    testBedComponent.openNotification({
      theme: 'light'
    });

    await delayBy(16);

    assertThat(`${classSelectorPrefix}.dark`).doesNotExist();
    assertThat(`${classSelectorPrefix}.light`).exists();
  });

  it('Should add the provided class name', async () => {
    testBedComponent.openNotification({
      className: 'hello-world'
    });

    await delayBy(16);

    assertThat(`${classSelectorPrefix}.hello-world`).exists();
  });

  it('Should auto close by default', async () => {
    jasmine.clock().install();

    testBedComponent.openNotification({
      content: 'Hello World'
    });

    jasmine.clock().tick(16);

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');

    jasmine.clock().tick(10_000);

    jasmine.clock().uninstall();

    await delayBy(500);

    assertThat(classSelectorPrefix).doesNotExist();
  });

  it('Should auto close after the provided value', async () => {
    jasmine.clock().install();

    testBedComponent.openNotification({
      autoCloseMs: 500,
      content: 'Hello World'
    });

    jasmine.clock().tick(16);

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');

    jasmine.clock().tick(10_000);

    jasmine.clock().uninstall();

    await delayBy(500);

    assertThat(classSelectorPrefix).doesNotExist();
  });

  it('Should insert the rendered notification as the direct child of body element', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    expect(document.body.lastElementChild).toEqual(getElementBySelector(classSelectorPrefix));
  });

  it('Should use "Close" as label for close button by default', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    assertThat(`${classSelectorPrefix}__action.close`).hasTextContentMatching('Close');
  });

  it('Should be able to configure a different default label for close button', async () => {
    testBedComponent.openNotification();

    await delayBy(16);

    assertThat(`${classSelectorPrefix}__action.close`).hasTextContentMatching('Close');

    fireEvent(`${classSelectorPrefix}__action.close`, 'click');

    await delayBy(500);

    NotificationService.setDefaultCloseButtonLabel('Dismiss');

    testBedComponent.openNotification();

    await delayBy(16);

    assertThat(`${classSelectorPrefix}__action.close`).hasTextContentMatching('Dismiss');

    // Set back to the expected default
    NotificationService.setDefaultCloseButtonLabel('Close');
  });

  it('Should prevent click events from bubbling up', async () => {
    const clickHandlerSpy = jasmine.createSpy();

    window.addEventListener('click', clickHandlerSpy, false);

    testBedComponent.openNotification();

    await delayBy(16);

    assertThat(`${classSelectorPrefix}.light`).exists();

    fireEvent(`${classSelectorPrefix}__action.close`, 'click');

    await delayBy(500);

    assertThat(`${classSelectorPrefix}.light`).doesNotExist();

    expect(clickHandlerSpy).not.toHaveBeenCalled();

    window.removeEventListener('click', clickHandlerSpy, false);
  });

  it('Should close currently opened notification before opening a new one', async () => {
    testBedComponent.openNotification({
      autoCloseMs: 500,
      content: 'Hello World 1'
    });

    await delayBy(500);

    expect(extractTextContent(`${classSelectorPrefix}:first-of-type ${classSelectorPrefix}__content`).trim()).toEqual(
      'Hello World 1'
    );

    testBedComponent.openNotification({
      autoCloseMs: 500,
      content: 'Hello World 2'
    });

    await delayBy(500);

    expect(document.querySelectorAll(classSelectorPrefix).length).toEqual(1);

    expect(extractTextContent(`${classSelectorPrefix}:first-of-type ${classSelectorPrefix}__content`).trim()).toEqual(
      'Hello World 2'
    );

    expect(extractTextContent(`${classSelectorPrefix}:last-of-type ${classSelectorPrefix}__content`).trim()).toEqual(
      'Hello World 2'
    );
  });
});

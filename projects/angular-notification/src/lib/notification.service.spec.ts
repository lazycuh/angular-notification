/* eslint-disable @typescript-eslint/quotes */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  assertThat,
  delayBy,
  extractTextContent,
  fireEvent,
  getElementBySelector
} from '@babybeet/angular-testing-kit';

import { NotificationService } from './notification.service';
import { NotificationConfiguration } from './notification-configuration';
import { Theme } from './theme';

@Component({
  selector: 'bbb-test',
  template: `<ng-container></ng-container>`
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TestComponentRenderer {
  constructor(readonly service: NotificationService) {}

  openNotification(config: Partial<NotificationConfiguration> = {}) {
    this.service.open({
      content: 'This notification is important',
      ...config
    });
  }
}

describe('NotificationService', () => {
  const classSelectorPrefix = '.bbb-notification';
  let fixture: ComponentFixture<TestComponentRenderer>;
  let testComponentRenderer: TestComponentRenderer;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponentRenderer],
      providers: [NotificationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentRenderer);
    testComponentRenderer = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('Should render a notification with the provided content', () => {
    testComponentRenderer.openNotification({
      content: 'Hello World'
    });

    fixture.detectChanges();

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');
  });

  it('Should render a notification with the provided content as HTML', () => {
    testComponentRenderer.openNotification({
      content: '<strong>Hello World</strong>'
    });

    fixture.detectChanges();

    expect(getElementBySelector(`${classSelectorPrefix}__content`).innerHTML.trim()).toEqual(
      '<strong>Hello World</strong>'
    );

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');
  });

  it(`Should render a notification whose close button's label has the provided value`, () => {
    testComponentRenderer.openNotification({
      closeButtonLabel: 'Dismiss'
    });

    fixture.detectChanges();

    expect(extractTextContent(`${classSelectorPrefix}__action`).trim()).toEqual('Dismiss');
  });

  it('Should use light theme by default', () => {
    testComponentRenderer.openNotification();

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.light`).exists();
  });

  it('Should render with the provided theme', async () => {
    testComponentRenderer.openNotification({
      theme: Theme.DARK
    });

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.light`).doesNotExist();
    assertThat(`${classSelectorPrefix}.dark`).exists();

    fireEvent(`${classSelectorPrefix}__action`, 'pointerup');

    await delayBy(1000);

    testComponentRenderer.openNotification({
      theme: Theme.LIGHT
    });

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.dark`).doesNotExist();
    assertThat(`${classSelectorPrefix}.light`).exists();
  });

  it('Should add the provided class name', () => {
    testComponentRenderer.openNotification({
      className: 'hello-world'
    });

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.hello-world`).exists();
  });

  it('Should auto close by default', async () => {
    jasmine.clock().install();

    testComponentRenderer.openNotification({
      content: 'Hello World'
    });

    fixture.detectChanges();

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');

    jasmine.clock().tick(10_000);

    fixture.detectChanges();

    jasmine.clock().uninstall();

    await delayBy(1000);

    assertThat(classSelectorPrefix).doesNotExist();
  });

  it('Should auto close after the provided value', async () => {
    jasmine.clock().install();

    testComponentRenderer.openNotification({
      autoCloseMs: 500,
      content: 'Hello World'
    });

    fixture.detectChanges();

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');

    jasmine.clock().tick(10_000);

    fixture.detectChanges();

    jasmine.clock().uninstall();

    await delayBy(1000);

    assertThat(classSelectorPrefix).doesNotExist();
  });

  it('Should insert the rendered notification as the direct child of body element', () => {
    testComponentRenderer.openNotification();

    fixture.detectChanges();

    expect(document.body.lastElementChild).toEqual(getElementBySelector(classSelectorPrefix));
  });
});

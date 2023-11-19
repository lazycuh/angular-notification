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
  const classSelectorPrefix = '.bbb-notification';
  let fixture: ComponentFixture<TestBedComponent>;
  let testBedComponent: TestBedComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestBedComponent],
      providers: [NotificationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBedComponent);
    testBedComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('Should render a notification with the provided content', () => {
    testBedComponent.openNotification({
      content: 'Hello World'
    });

    fixture.detectChanges();

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');
  });

  it('Should render a notification with the provided content as HTML', () => {
    testBedComponent.openNotification({
      content: '<strong>Hello World</strong>'
    });

    fixture.detectChanges();

    expect(getElementBySelector(`${classSelectorPrefix}__content`).innerHTML.trim()).toEqual(
      '<strong>Hello World</strong>'
    );

    expect(extractTextContent(`${classSelectorPrefix}__content`).trim()).toEqual('Hello World');
  });

  it(`Should render a notification whose close button's label has the provided value`, () => {
    testBedComponent.openNotification({
      closeButtonLabel: 'Dismiss'
    });

    fixture.detectChanges();

    expect(extractTextContent(`${classSelectorPrefix}__action`).trim()).toEqual('Dismiss');
  });

  it('Should use light theme by default', () => {
    testBedComponent.openNotification();

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.light`).exists();
  });

  it('Should be able to configure a different default theme', async () => {
    testBedComponent.openNotification();

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.dark`).doesNotExist();
    assertThat(`${classSelectorPrefix}.light`).exists();

    fireEvent(`${classSelectorPrefix}__action.close`, 'click');

    await delayBy(1000);

    NotificationService.setDefaultTheme(Theme.DARK);

    testBedComponent.openNotification();

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.light`).doesNotExist();
    assertThat(`${classSelectorPrefix}.dark`).exists();

    // Set back to the expected default
    NotificationService.setDefaultTheme(Theme.LIGHT);
  });

  it('Should render with the provided theme', async () => {
    testBedComponent.openNotification({
      theme: Theme.DARK
    });

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.light`).doesNotExist();
    assertThat(`${classSelectorPrefix}.dark`).exists();

    fireEvent(`${classSelectorPrefix}__action`, 'pointerup');

    await delayBy(1000);

    testBedComponent.openNotification({
      theme: Theme.LIGHT
    });

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.dark`).doesNotExist();
    assertThat(`${classSelectorPrefix}.light`).exists();
  });

  it('Should add the provided class name', () => {
    testBedComponent.openNotification({
      className: 'hello-world'
    });

    fixture.detectChanges();

    assertThat(`${classSelectorPrefix}.hello-world`).exists();
  });

  it('Should auto close by default', async () => {
    jasmine.clock().install();

    testBedComponent.openNotification({
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

    testBedComponent.openNotification({
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
    testBedComponent.openNotification();

    fixture.detectChanges();

    expect(document.body.lastElementChild).toEqual(getElementBySelector(classSelectorPrefix));
  });
});

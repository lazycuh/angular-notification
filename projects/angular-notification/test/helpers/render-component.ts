import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideZonelessChangeDetection, Type } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderComponentOptions, RenderResult } from '@testing-library/angular';

export async function renderComponent<T>(
  component: Type<T>,
  options: RenderComponentOptions<T> = {}
): Promise<RenderResult<T>> {
  options.providers ??= [];
  // Have to add these providers to the beginning of the array to avoid weird failures during testing
  options.providers.unshift(provideNoopAnimations(), provideZonelessChangeDetection(), {
    provide: DATE_PIPE_DEFAULT_OPTIONS,
    useValue: { timezone: '-1200' }
  });

  // Tell Angular to render `@defer` blocks too
  options.deferBlockBehavior = 1;

  const renderResult = await render(component, options);

  return renderResult;
}

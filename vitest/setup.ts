import '@testing-library/jest-dom';

import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, vi } from 'vitest';

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

afterEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

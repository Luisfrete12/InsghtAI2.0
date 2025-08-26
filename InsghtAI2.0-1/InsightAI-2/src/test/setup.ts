import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock MSW for tests
beforeAll(() => {
  // Setup MSW if needed for tests
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  // Cleanup MSW if setup
});
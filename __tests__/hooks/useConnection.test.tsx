import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import React from 'react';
import { useConnection } from '@/hooks/useConnection';

function ConnectionDisplay() {
  const conn = useConnection();
  if (!conn) return <div data-testid="status">loading</div>;
  return (
    <div data-testid="status">
      <span data-testid="effectiveType">{conn.effectiveType}</span>
      <span data-testid="downlink">{conn.downlink}</span>
      <span data-testid="saveData">{String(conn.saveData)}</span>
    </div>
  );
}

describe('useConnection', () => {
  let originalConnection: PropertyDescriptor | undefined;

  afterEach(() => {
    cleanup();
    if (originalConnection) {
      Object.defineProperty(navigator, 'connection', originalConnection);
    } else {
      delete (navigator as any).connection;
    }
  });

  it('returns fallback values when Network Information API is unsupported', () => {
    originalConnection = Object.getOwnPropertyDescriptor(navigator, 'connection');
    delete (navigator as any).connection;

    render(<ConnectionDisplay />);

    expect(screen.getByTestId('effectiveType')).toHaveTextContent('4g');
    expect(screen.getByTestId('downlink')).toHaveTextContent('10');
    expect(screen.getByTestId('saveData')).toHaveTextContent('false');
  });

  it('reads values from navigator.connection when available', () => {
    const listeners: Record<string, Function[]> = {};
    const mockConnection = {
      effectiveType: '3g',
      downlink: 1.5,
      saveData: true,
      addEventListener: (event: string, fn: Function) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(fn);
      },
      removeEventListener: (event: string, fn: Function) => {
        listeners[event] = (listeners[event] || []).filter((f) => f !== fn);
      },
    };

    originalConnection = Object.getOwnPropertyDescriptor(navigator, 'connection');
    Object.defineProperty(navigator, 'connection', {
      value: mockConnection,
      configurable: true,
      writable: true,
    });

    render(<ConnectionDisplay />);

    expect(screen.getByTestId('effectiveType')).toHaveTextContent('3g');
    expect(screen.getByTestId('downlink')).toHaveTextContent('1.5');
    expect(screen.getByTestId('saveData')).toHaveTextContent('true');
  });

  it('updates when navigator.connection fires a change event', () => {
    const listeners: Record<string, Function[]> = {};
    const mockConnection = {
      effectiveType: '4g',
      downlink: 10,
      saveData: false,
      addEventListener: (event: string, fn: Function) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(fn);
      },
      removeEventListener: (event: string, fn: Function) => {
        listeners[event] = (listeners[event] || []).filter((f) => f !== fn);
      },
    };

    originalConnection = Object.getOwnPropertyDescriptor(navigator, 'connection');
    Object.defineProperty(navigator, 'connection', {
      value: mockConnection,
      configurable: true,
      writable: true,
    });

    render(<ConnectionDisplay />);

    expect(screen.getByTestId('effectiveType')).toHaveTextContent('4g');

    act(() => {
      mockConnection.effectiveType = '2g';
      mockConnection.downlink = 0.25;
      mockConnection.saveData = true;
      listeners['change']?.forEach((fn) => fn());
    });

    expect(screen.getByTestId('effectiveType')).toHaveTextContent('2g');
    expect(screen.getByTestId('downlink')).toHaveTextContent('0.25');
    expect(screen.getByTestId('saveData')).toHaveTextContent('true');
  });

  it('cleans up the event listener on unmount', () => {
    const listeners: Record<string, Function[]> = {};
    const mockConnection = {
      effectiveType: '4g',
      downlink: 10,
      saveData: false,
      addEventListener: (event: string, fn: Function) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(fn);
      },
      removeEventListener: (event: string, fn: Function) => {
        listeners[event] = (listeners[event] || []).filter((f) => f !== fn);
      },
    };

    originalConnection = Object.getOwnPropertyDescriptor(navigator, 'connection');
    Object.defineProperty(navigator, 'connection', {
      value: mockConnection,
      configurable: true,
      writable: true,
    });

    const { unmount } = render(<ConnectionDisplay />);
    expect(listeners['change']).toHaveLength(1);

    unmount();
    expect(listeners['change']).toHaveLength(0);
  });
});

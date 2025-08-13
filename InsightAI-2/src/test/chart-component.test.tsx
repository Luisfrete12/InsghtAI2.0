import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Simple chart component test
function SimpleChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <div data-testid="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line type="monotone" dataKey="value" stroke="#2563EB" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

describe('Chart Component', () => {
  it('renders chart container', () => {
    const mockData = [
      { name: 'Jan', value: 100 },
      { name: 'Feb', value: 200 },
      { name: 'Mar', value: 150 },
    ];

    render(<SimpleChart data={mockData} />);
    
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
  });
});
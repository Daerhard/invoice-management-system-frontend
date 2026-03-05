import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfitPieChart from './ProfitPieChart';

const twoEntries = [
    { label: 'Set A', value: 60 },
    { label: 'Set B', value: 40 },
];

describe('ProfitPieChart', () => {
    it('renders the title', () => {
        render(<ProfitPieChart title="Best Sets" entries={twoEntries} total={100} />);
        expect(screen.getByText('Best Sets')).toBeInTheDocument();
    });

    it('renders legend entries with correct percentages', () => {
        render(<ProfitPieChart title="Best Sets" entries={twoEntries} total={100} />);
        expect(screen.getByText(/Set A \(60\.0 %\)/)).toBeInTheDocument();
        expect(screen.getByText(/Set B \(40\.0 %\)/)).toBeInTheDocument();
    });

    it('renders total value below the chart', () => {
        render(<ProfitPieChart title="Best Sets" entries={twoEntries} total={100} />);
        expect(screen.getByText('Gesamt: 100.00 €')).toBeInTheDocument();
    });

    it('renders SVG element with correct accessible name', () => {
        render(<ProfitPieChart title="Best Sets" entries={twoEntries} total={100} />);
        expect(screen.getByRole('img', { name: 'Best Sets' })).toBeInTheDocument();
    });

    it('renders a full circle for a single-entry pie chart', () => {
        const { container } = render(
            <ProfitPieChart title="Best Sets" entries={[{ label: 'Only Set', value: 100 }]} total={100} />
        );
        expect(container.querySelector('circle')).toBeInTheDocument();
        expect(container.querySelector('path')).not.toBeInTheDocument();
    });

    it('renders arc paths for multiple entries', () => {
        const { container } = render(<ProfitPieChart title="Best Sets" entries={twoEntries} total={100} />);
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBe(2);
    });

    it('shows disabled state when entries array is empty', () => {
        render(<ProfitPieChart title="Best Sets" entries={[]} total={0} />);
        expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Best Sets' })).toBeInTheDocument();
    });

    it('shows disabled state when disabled prop is true', () => {
        render(<ProfitPieChart title="Worst Sets" entries={twoEntries} total={100} disabled />);
        expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Worst Sets' })).toBeInTheDocument();
    });

    it('renders correct total for negative values', () => {
        render(
            <ProfitPieChart
                title="Worst Sets"
                entries={[{ label: 'Bad Set', value: 5 }]}
                total={-5}
            />
        );
        expect(screen.getByText('Gesamt: -5.00 €')).toBeInTheDocument();
    });
});

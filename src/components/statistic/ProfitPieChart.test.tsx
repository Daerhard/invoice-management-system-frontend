import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfitPieChart from './ProfitPieChart';

const twoEntries = [
    { label: 'Set A', value: 60 },
    { label: 'Set B', value: 40 },
];

describe('ProfitPieChart', () => {
    it('renders the title', () => {
        render(<ProfitPieChart title="Best Sets" entries={twoEntries} />);
        expect(screen.getByText('Best Sets')).toBeInTheDocument();
    });

    it('renders an optional subtitle below the title', () => {
        render(<ProfitPieChart title="Best Sets" subtitle="Gesamtgewinn: 2.50 €" entries={twoEntries} />);
        expect(screen.getByText('Gesamtgewinn: 2.50 €')).toBeInTheDocument();
    });

    it('does not render a subtitle element when subtitle prop is omitted', () => {
        render(<ProfitPieChart title="Best Sets" entries={twoEntries} />);
        expect(screen.queryByText(/Gesamtgewinn/)).not.toBeInTheDocument();
    });

    it('renders legend entries with correct percentages', () => {
        render(<ProfitPieChart title="Best Sets" entries={twoEntries} />);
        expect(screen.getByText(/Set A \(60\.0 %\)/)).toBeInTheDocument();
        expect(screen.getByText(/Set B \(40\.0 %\)/)).toBeInTheDocument();
    });

    it('renders SVG element with correct accessible name', () => {
        render(<ProfitPieChart title="Best Sets" entries={twoEntries} />);
        expect(screen.getByRole('img', { name: 'Best Sets' })).toBeInTheDocument();
    });

    it('renders a full circle for a single-entry pie chart', () => {
        const { container } = render(
            <ProfitPieChart title="Best Sets" entries={[{ label: 'Only Set', value: 100 }]} />
        );
        expect(container.querySelector('circle')).toBeInTheDocument();
        expect(container.querySelector('path')).not.toBeInTheDocument();
    });

    it('renders arc paths for multiple entries', () => {
        const { container } = render(<ProfitPieChart title="Best Sets" entries={twoEntries} />);
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBe(2);
    });

    it('renders set name labels inside SVG segments for entries with pct >= 5%', () => {
        const { container } = render(<ProfitPieChart title="Best Sets" entries={twoEntries} />);
        const texts = container.querySelectorAll('svg text');
        // Both entries are >= 5% so both get a label
        expect(texts.length).toBe(2);
        expect(texts[0].textContent).toBe('Set A');
        expect(texts[1].textContent).toBe('Set B');
    });

    it('truncates long set names inside SVG segments', () => {
        const { container } = render(
            <ProfitPieChart
                title="Best Sets"
                entries={[
                    { label: 'VeryLongSetName', value: 60 },
                    { label: 'Short', value: 40 },
                ]}
            />
        );
        const texts = container.querySelectorAll('svg text');
        expect(texts[0].textContent).toBe('VeryLongSe\u2026');
    });

    it('renders a label inside the circle for single-entry pie chart', () => {
        const { container } = render(
            <ProfitPieChart title="Best Sets" entries={[{ label: 'Only Set', value: 100 }]} />
        );
        const texts = container.querySelectorAll('svg text');
        expect(texts.length).toBe(1);
        expect(texts[0].textContent).toBe('Only Set');
    });

    it('shows disabled state when entries array is empty', () => {
        render(<ProfitPieChart title="Best Sets" entries={[]} />);
        expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Best Sets' })).toBeInTheDocument();
    });

    it('shows disabled state when disabled prop is true', () => {
        render(<ProfitPieChart title="Worst Sets" entries={twoEntries} disabled />);
        expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Worst Sets' })).toBeInTheDocument();
    });
});

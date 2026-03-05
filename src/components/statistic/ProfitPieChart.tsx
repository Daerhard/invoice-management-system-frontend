import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

export const PIE_COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f'];

export interface PieEntry {
    label: string;
    value: number;
}

interface ProfitPieChartProps {
    title: string;
    entries: PieEntry[];
    total: number;
    disabled?: boolean;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildArcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)} Z`;
}

export default function ProfitPieChart({ title, entries, total, disabled = false }: ProfitPieChartProps) {
    const validEntries = entries.filter((e) => e.value > 0);

    if (disabled || validEntries.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', p: 2, minWidth: 220 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Keine Daten vorhanden.
                </Typography>
            </Box>
        );
    }

    const totalValue = validEntries.reduce((sum, e) => sum + e.value, 0);
    const cx = 100, cy = 100, r = 80;
    let currentAngle = 0;

    const segments = validEntries.map((entry, i) => {
        const pct = totalValue > 0 ? (entry.value / totalValue) * 100 : 0;
        const angleSweep = (pct / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angleSweep;
        currentAngle = endAngle;
        return { ...entry, pct, startAngle, endAngle, color: PIE_COLORS[i % PIE_COLORS.length] };
    });

    return (
        <Box sx={{ textAlign: 'center', p: 1, minWidth: 220 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {title}
            </Typography>
            <svg
                viewBox="0 0 200 200"
                width="200"
                height="200"
                aria-label={title}
                role="img"
            >
                {validEntries.length === 1 ? (
                    <circle cx={cx} cy={cy} r={r} fill={PIE_COLORS[0]} />
                ) : (
                    segments.map((seg, i) => (
                        <path
                            key={i}
                            d={buildArcPath(cx, cy, r, seg.startAngle, seg.endAngle)}
                            fill={seg.color}
                        />
                    ))
                )}
            </svg>
            <Stack spacing={0.5} sx={{ mt: 1, textAlign: 'left', display: 'inline-flex' }}>
                {segments.map((seg, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1}>
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: seg.color,
                                flexShrink: 0,
                            }}
                        />
                        <Typography variant="caption">
                            {seg.label} ({seg.pct.toFixed(1)} %)
                        </Typography>
                    </Stack>
                ))}
            </Stack>
            <Typography variant="body2" sx={{ mt: 1 }}>
                Gesamt: {total.toFixed(2)} €
            </Typography>
        </Box>
    );
}

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

export const PIE_COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f'];

export interface PieEntry {
    label: string;
    value: number;
}

interface ProfitPieChartProps {
    title: string;
    subtitle?: string;
    entries: PieEntry[];
    disabled?: boolean;
}

const SVG_SIZE = 300;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;
const R = 120;
const LABEL_RADIUS_RATIO = 0.62;
const MIN_PCT_FOR_LABEL = 5;
const MAX_LABEL_CHARS = 10;

function truncateLabel(label: string): string {
    return label.length > MAX_LABEL_CHARS ? label.slice(0, MAX_LABEL_CHARS) + '\u2026' : label;
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

export default function ProfitPieChart({ title, subtitle, entries, disabled = false }: ProfitPieChartProps) {
    const validEntries = entries.filter((e) => e.value > 0);
    const isDisabled = disabled || validEntries.length === 0;

    const totalValue = validEntries.reduce((sum, e) => sum + e.value, 0);
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, minWidth: SVG_SIZE }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: subtitle ? 0 : 1 }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {subtitle}
                </Typography>
            )}
            <svg
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                width={SVG_SIZE}
                height={SVG_SIZE}
                aria-label={title}
                role="img"
                style={{ opacity: isDisabled ? 0.25 : 1 }}
            >
                {isDisabled ? (
                    <circle cx={CX} cy={CY} r={R} fill="#9e9e9e" />
                ) : validEntries.length === 1 ? (
                    <>
                        <circle cx={CX} cy={CY} r={R} fill={PIE_COLORS[0]} />
                        <text
                            x={CX}
                            y={CY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="10"
                            fill="white"
                            fontWeight="bold"
                        >
                            {truncateLabel(validEntries[0].label)}
                        </text>
                    </>
                ) : (
                    segments.map((seg, i) => {
                        const labelPos = polarToCartesian(
                            CX, CY, R * LABEL_RADIUS_RATIO,
                            (seg.startAngle + seg.endAngle) / 2
                        );
                        return (
                            <g key={i}>
                                <path
                                    d={buildArcPath(CX, CY, R, seg.startAngle, seg.endAngle)}
                                    fill={seg.color}
                                />
                                {seg.pct >= MIN_PCT_FOR_LABEL && (
                                    <text
                                        x={labelPos.x}
                                        y={labelPos.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="9"
                                        fill="white"
                                        fontWeight="bold"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {truncateLabel(seg.label)}
                                    </text>
                                )}
                            </g>
                        );
                    })
                )}
            </svg>
            {isDisabled ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Keine Daten vorhanden.
                </Typography>
            ) : (
                <Stack spacing={0.5} sx={{ mt: 1 }}>
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
            )}
        </Box>
    );
}

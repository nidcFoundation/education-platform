import { useId } from "react";
import { cn } from "@/lib/utils";

export interface BreakdownItem {
    label: string;
    value: number;
    color: string;
    description?: string;
    meta?: string;
}

export interface TrendPoint {
    label: string;
    value: number;
}

export function DonutBreakdownChart({
    items,
    totalLabel,
    totalValue,
    className,
}: {
    items: BreakdownItem[];
    totalLabel: string;
    totalValue: string;
    className?: string;
}) {
    const total = items.reduce((sum, item) => sum + item.value, 0);
    const safeTotal = total || 1;
    const segments = items.reduce<{ current: number; values: string[] }>(
        (acc, item) => {
            const start = acc.current;
            const end = start + (item.value / safeTotal) * 100;
            return {
                current: end,
                values: [...acc.values, `${item.color} ${start}% ${end}%`],
            };
        },
        { current: 0, values: [] }
    ).values;
    const donutBackground = segments.length > 0 ? `conic-gradient(${segments.join(", ")})` : "var(--color-muted)";

    return (
        <div className={cn("grid gap-6 lg:grid-cols-[190px_1fr] lg:items-center", className)}>
            <div className="mx-auto">
                <div
                    className="relative h-44 w-44 rounded-full border border-border/60 shadow-inner"
                    style={{ background: donutBackground }}
                >
                    <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-background shadow-sm">
                        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{totalLabel}</span>
                        <span className="mt-2 text-2xl font-bold tracking-tight">{totalValue}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.label} className="flex items-start gap-3 rounded-xl border bg-background p-3">
                        <span className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-medium">{item.label}</p>
                                <span className="text-sm font-semibold">{item.value}%</span>
                            </div>
                            {item.description && <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>}
                            {item.meta && <p className="mt-2 text-xs font-medium text-foreground/80">{item.meta}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function HorizontalBarChart({
    items,
    valueSuffix = "%",
    className,
}: {
    items: BreakdownItem[];
    valueSuffix?: string;
    className?: string;
}) {
    const max = Math.max(...items.map((item) => item.value), 1);

    return (
        <div className={cn("space-y-4", className)}>
            {items.map((item) => (
                <div key={item.label} className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-medium">{item.label}</p>
                            {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                        </div>
                        <span className="shrink-0 text-sm font-semibold">
                            {item.value}
                            {valueSuffix}
                        </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted/70">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${(item.value / max) * 100}%`,
                                backgroundColor: item.color,
                            }}
                        />
                    </div>
                    {item.meta && <p className="text-xs text-muted-foreground">{item.meta}</p>}
                </div>
            ))}
        </div>
    );
}

export function GrowthLineChart({
    data,
    valueLabel,
    accent = "#16a34a",
}: {
    data: TrendPoint[];
    valueLabel: string;
    accent?: string;
}) {
    const gradientId = useId().replace(/:/g, "");
    const width = 420;
    const height = 220;
    const paddingX = 28;
    const paddingY = 28;
    const max = Math.max(...data.map((point) => point.value), 1);
    const min = Math.min(...data.map((point) => point.value), 0);
    const range = max - min || 1;

    const points = data.map((point, index) => {
        const x = paddingX + (index * (width - paddingX * 2)) / Math.max(data.length - 1, 1);
        const y = height - paddingY - ((point.value - min) / range) * (height - paddingY * 2);
        return { ...point, x, y };
    });

    const linePath = points.map((point) => `${point.x},${point.y}`).join(" ");
    const lastPoint = points[points.length - 1];
    const areaPath = `M ${points[0]?.x ?? 0} ${height - paddingY} ` +
        points.map((point) => `L ${point.x} ${point.y}`).join(" ") +
        ` L ${lastPoint?.x ?? 0} ${height - paddingY} Z`;

    return (
        <div className="space-y-3">
            <div className="relative rounded-2xl border bg-background p-4">
                <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full">
                    <defs>
                        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
                            <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
                        </linearGradient>
                    </defs>
                    {[0, 1, 2, 3].map((step) => {
                        const y = paddingY + (step * (height - paddingY * 2)) / 3;
                        return (
                            <line
                                key={step}
                                x1={paddingX}
                                y1={y}
                                x2={width - paddingX}
                                y2={y}
                                stroke="currentColor"
                                className="text-border"
                                strokeDasharray="4 6"
                            />
                        );
                    })}

                    <path d={areaPath} fill={`url(#${gradientId})`} />
                    <polyline
                        fill="none"
                        stroke={accent}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={linePath}
                    />

                    {points.map((point) => (
                        <g key={point.label}>
                            <circle cx={point.x} cy={point.y} r="4.5" fill={accent} />
                            <circle cx={point.x} cy={point.y} r="8" fill={accent} opacity="0.12" />
                        </g>
                    ))}
                </svg>
            </div>

            <div
                className="grid gap-2 text-center text-xs text-muted-foreground"
                style={{ gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))` }}
            >
                {data.map((point) => (
                    <div key={point.label} className="rounded-lg border bg-background px-2 py-2">
                        <p className="font-medium text-foreground">{point.value}</p>
                        <p className="mt-1">{point.label}</p>
                    </div>
                ))}
            </div>

            <p className="text-xs text-muted-foreground">{valueLabel}</p>
        </div>
    );
}

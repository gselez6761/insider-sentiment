import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { SECTOR_ORDER, SECTOR_WEIGHT, SECTOR_ETF, getSector } from "./sectors";

interface RawItem {
  ticker: string;
  day: string;
  amount: number;
}

interface SentimentChartProps {
  buys: RawItem[];
  sells: RawItem[];
  loading: boolean;
}

// ── Dimensions ───────────────────────────────────────────────────────────────
const W = 900;
const TOP_H = 280;
const M = { top: 20, right: 40, bottom: 36, left: 50 };
const IW = W - M.left - M.right;
const IH = TOP_H - M.top - M.bottom;

const BOT_H = 340;
const BM = { top: 14, right: 40, bottom: 36, left: 110 };
const BIW = W - BM.left - BM.right;
const BIH = BOT_H - BM.top - BM.bottom;

// Rolling heat strip dimensions
const ROLL_H = 360;
const RM = { top: 14, right: 40, bottom: 36, left: 110 };
const RIW = W - RM.left - RM.right;
const RIH = ROLL_H - RM.top - RM.bottom;

// Candlestick chart dimensions (same left/right as rolling strip)
const CAND_H = 225;
const CM = { top: 20, right: 40, bottom: 36, left: 110 };
const CIW = W - CM.left - CM.right;
const CIH = CAND_H - CM.top - CM.bottom;

// ── Weekly bucket helper ─────────────────────────────────────────────────────
function mondayOf(d: Date): Date {
  const copy = new Date(d);
  const dow = copy.getDay();
  copy.setDate(copy.getDate() - dow + (dow === 0 ? -6 : 1));
  copy.setHours(0, 0, 0, 0);
  return copy;
}

interface WeekBucket {
  weekStart: Date;
  weekEnd: Date;
  nBuys: number;
  nSells: number;
  ratio: number;
  total: number;
}

interface HeatCell {
  sector: string;
  period: Date;
  periodEnd: Date;
  periodLabel: string;
  nBuys: number;
  nSells: number;
  ratio: number;
  total: number;
}

interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface RollingDayCell {
  sector: string;
  date: Date;
  nBuys: number;
  nSells: number;
  ratio: number;
  total: number;
}

export default function SentimentChart({ buys, sells, loading }: SentimentChartProps) {
  const brushGroupRef = useRef<SVGGElement>(null);
  const brushRef = useRef<d3.BrushBehavior<unknown> | null>(null);
  const [brushExtent, setBrushExtent] = useState<[Date, Date] | null>(null);
  const [topHover, setTopHover] = useState<WeekBucket | null>(null);
  const [topHoverPos, setTopHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [botHover, setBotHover] = useState<HeatCell | null>(null);
  const [botHoverPos, setBotHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [rollHover, setRollHover] = useState<RollingDayCell | null>(null);
  const [rollHoverPos, setRollHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Candlestick hover tooltip
  const [candleHover, setCandleHover] = useState<{ x: number; y: number } | null>(null);

  // Candlestick + cross-brush state
  const [activeSector, setActiveSector] = useState<string>("Total*");
  const [candleLoading, setCandleLoading] = useState(true);
  const [heatBrush, setHeatBrush] = useState<[Date, Date] | null>(null);
  const [candleBrush, setCandleBrush] = useState<[Date, Date] | null>(null);
  const heatBrushGroupRef = useRef<SVGGElement>(null);
  const heatBrushRef = useRef<d3.BrushBehavior<unknown> | null>(null);
  const candleBrushGroupRef = useRef<SVGGElement>(null);
  const candleBrushRef = useRef<d3.BrushBehavior<unknown> | null>(null);
  const isBrushing = useRef(false);

  // ── Date bounds ──────────────────────────────────────────────────────────
  const today = useMemo(() => new Date("2026-02-28"), []);
  const yearAgo = useMemo(() => new Date("2025-02-28"), []);

  // ── X scale ──────────────────────────────────────────────────────────────
  const xScale = useMemo(
    () => d3.scaleTime().domain([yearAgo, today]).range([0, IW]),
    [yearAgo, today]
  );

  // ── Weekly aggregation (unique tickers) ──────────────────────────────────
  const weeklyData = useMemo<WeekBucket[]>(() => {
    const map = new Map<number, { weekStart: Date; buyTickers: Set<string>; sellTickers: Set<string> }>();

    for (const b of buys) {
      const d = new Date(b.day);
      if (d < yearAgo || d > today) continue;
      const mon = mondayOf(d);
      const key = mon.getTime();
      if (!map.has(key)) map.set(key, { weekStart: new Date(mon), buyTickers: new Set(), sellTickers: new Set() });
      map.get(key)!.buyTickers.add(b.ticker);
    }
    for (const s of sells) {
      const d = new Date(s.day);
      if (d < yearAgo || d > today) continue;
      const mon = mondayOf(d);
      const key = mon.getTime();
      if (!map.has(key)) map.set(key, { weekStart: new Date(mon), buyTickers: new Set(), sellTickers: new Set() });
      map.get(key)!.sellTickers.add(s.ticker);
    }

    return Array.from(map.values())
      .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime())
      .map((w) => {
        const nBuys = w.buyTickers.size;
        const nSells = w.sellTickers.size;
        const total = nBuys + nSells;
        const weekEnd = new Date(w.weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return {
          weekStart: w.weekStart,
          weekEnd,
          nBuys,
          nSells,
          ratio: total > 0 ? (nBuys / total) * 100 : 50,
          total,
        };
      });
  }, [buys, sells, yearAgo, today]);

  // ── Y scale (0–100%) ────────────────────────────────────────────────────
  const yScale = useMemo(
    () => d3.scaleLinear().domain([0, 100]).range([IH, 0]),
    []
  );

  // ── Area paths (split at 50%) ────────────────────────────────────────────
  const areaAbove = useMemo(() => {
    return d3.area<WeekBucket>()
      .x((d) => xScale(d.weekStart))
      .y0(yScale(50))
      .y1((d) => yScale(Math.max(d.ratio, 50)))
      .curve(d3.curveMonotoneX)(weeklyData) ?? "";
  }, [weeklyData, xScale, yScale]);

  const areaBelow = useMemo(() => {
    return d3.area<WeekBucket>()
      .x((d) => xScale(d.weekStart))
      .y0((d) => yScale(Math.min(d.ratio, 50)))
      .y1(yScale(50))
      .curve(d3.curveMonotoneX)(weeklyData) ?? "";
  }, [weeklyData, xScale, yScale]);

  const linePath = useMemo(() => {
    return d3.line<WeekBucket>()
      .x((d) => xScale(d.weekStart))
      .y((d) => yScale(d.ratio))
      .curve(d3.curveMonotoneX)(weeklyData) ?? "";
  }, [weeklyData, xScale, yScale]);

  // ── Dot radius scale ────────────────────────────────────────────────────
  const maxTotal = useMemo(
    () => Math.max(1, ...weeklyData.map((w) => w.total)),
    [weeklyData]
  );
  const rScale = useCallback(
    (n: number) => 2 + Math.sqrt(n / maxTotal) * 5,
    [maxTotal]
  );

  // ── Month ticks ──────────────────────────────────────────────────────────
  const xMonthTicks = useMemo(() => xScale.ticks(d3.timeMonth.every(1)!), [xScale]);
  const yTicks = [0, 25, 50, 75, 100];

  // ── Half-month periods for heat strip ────────────────────────────────────
  const halfMonths = useMemo(() => {
    const all: { start: Date; end: Date; label: string }[] = [];
    let cur = new Date(yearAgo.getFullYear(), yearAgo.getMonth(), 1);
    const endDate = today;
    while (cur <= endDate) {
      const y = cur.getFullYear();
      const m = cur.getMonth();
      const monthAbbr = d3.timeFormat("%b '%y")(cur);
      const h1Start = new Date(y, m, 1);
      const h1End = new Date(y, m, 15, 23, 59, 59);
      all.push({ start: h1Start, end: h1End, label: `${monthAbbr} 1H` });
      const h2Start = new Date(y, m, 16);
      const h2End = new Date(y, m + 1, 0, 23, 59, 59);
      all.push({ start: h2Start, end: h2End, label: `${monthAbbr} 2H` });
      cur = new Date(y, m + 1, 1);
    }
    return all.filter((hm) => hm.start >= yearAgo && hm.start <= endDate);
  }, [yearAgo, today]);

  const heatData = useMemo<HeatCell[]>(() => {
    const map = new Map<string, { nBuys: number; nSells: number }>();
    const key = (sector: string, pi: number) => `${sector}|${pi}`;

    const bucketIndex = (d: Date): number => {
      for (let i = 0; i < halfMonths.length; i++) {
        if (d >= halfMonths[i].start && d <= halfMonths[i].end) return i;
      }
      return -1;
    };

    const process = (items: RawItem[], type: "buy" | "sell") => {
      for (const item of items) {
        const d = new Date(item.day);
        if (d < yearAgo || d > today) continue;
        const pi = bucketIndex(d);
        if (pi < 0) continue;
        const sector = getSector(item.ticker);
        const k = key(sector, pi);
        if (!map.has(k)) map.set(k, { nBuys: 0, nSells: 0 });
        const e = map.get(k)!;
        if (type === "buy") e.nBuys++;
        else e.nSells++;
      }
    };

    process(buys, "buy");
    process(sells, "sell");

    const realSectors = SECTOR_ORDER.filter((s) => s !== "Total*");
    const cells: HeatCell[] = [];

    const sectorRatiosByPeriod: number[][] = [];
    const sectorTotalsByPeriod: number[][] = [];

    for (const sector of realSectors) {
      const ratios: number[] = [];
      const totals: number[] = [];
      for (let pi = 0; pi < halfMonths.length; pi++) {
        const hm = halfMonths[pi];
        const k = key(sector, pi);
        const e = map.get(k) ?? { nBuys: 0, nSells: 0 };
        const total = e.nBuys + e.nSells;
        const ratio = total > 0 ? e.nBuys / total : 0.5;
        ratios.push(ratio);
        totals.push(total);
        cells.push({
          sector,
          period: hm.start,
          periodEnd: hm.end,
          periodLabel: hm.label,
          nBuys: e.nBuys,
          nSells: e.nSells,
          ratio,
          total,
        });
      }
      sectorRatiosByPeriod.push(ratios);
      sectorTotalsByPeriod.push(totals);
    }

    for (let pi = 0; pi < halfMonths.length; pi++) {
      const hm = halfMonths[pi];
      let weightedSum = 0, weightSum = 0, totalN = 0;
      for (let si = 0; si < realSectors.length; si++) {
        const w = SECTOR_WEIGHT[realSectors[si]] ?? 0;
        weightedSum += w * sectorRatiosByPeriod[si][pi];
        weightSum += w;
        totalN += sectorTotalsByPeriod[si][pi];
      }
      const ratio = weightSum > 0 ? weightedSum / weightSum : 0.5;
      cells.push({
        sector: "Total*",
        period: hm.start,
        periodEnd: hm.end,
        periodLabel: hm.label,
        nBuys: Math.round(ratio * totalN),
        nSells: Math.round((1 - ratio) * totalN),
        ratio,
        total: totalN,
      });
    }

    return cells;
  }, [buys, sells, halfMonths, yearAgo, today]);

  // ── Heat strip scales ────────────────────────────────────────────────────
  const xHeatScale = useMemo(
    () => d3.scaleBand<number>().domain(halfMonths.map((_, i) => i)).range([0, BIW]).padding(0.04),
    [halfMonths]
  );
  const yHeatScale = useMemo(
    () => d3.scaleBand<string>().domain(SECTOR_ORDER).range([0, BIH]).padding(0.08),
    []
  );


  // ── Brush-highlighted half-months ────────────────────────────────────────
  const highlightedPeriods = useMemo<Set<number> | null>(() => {
    if (!brushExtent) return null;
    const [d0, d1] = brushExtent;
    const set = new Set<number>();
    for (let i = 0; i < halfMonths.length; i++) {
      const hm = halfMonths[i];
      if (hm.end >= d0 && hm.start <= d1) set.add(i);
    }
    return set;
  }, [brushExtent, halfMonths]);

  // ── Rolling 14-day heat strip data ─────────────────────────────────────
  const daysList = useMemo(() => {
    const days: Date[] = [];
    const cur = new Date(yearAgo);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(0, 0, 0, 0);
    while (cur <= end) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [yearAgo, today]);

  const rollingData = useMemo(() => {
    const dayCounts = new Map<string, { nBuys: number; nSells: number }>();
    const dayKey = (sector: string, d: Date) =>
      `${sector}|${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

    for (const b of buys) {
      const d = new Date(b.day);
      d.setHours(0, 0, 0, 0);
      const sector = getSector(b.ticker);
      const k = dayKey(sector, d);
      if (!dayCounts.has(k)) dayCounts.set(k, { nBuys: 0, nSells: 0 });
      dayCounts.get(k)!.nBuys++;
    }
    for (const s of sells) {
      const d = new Date(s.day);
      d.setHours(0, 0, 0, 0);
      const sector = getSector(s.ticker);
      const k = dayKey(sector, d);
      if (!dayCounts.has(k)) dayCounts.set(k, { nBuys: 0, nSells: 0 });
      dayCounts.get(k)!.nSells++;
    }

    const realSectors = SECTOR_ORDER.filter((s) => s !== "Total*");
    const cells: RollingDayCell[] = [];
    const sectorRatios: number[][] = [];
    const sectorTotals: number[][] = [];

    for (const sector of realSectors) {
      const dailyBuys: number[] = [];
      const dailySells: number[] = [];
      for (const day of daysList) {
        const k = dayKey(sector, day);
        const e = dayCounts.get(k);
        dailyBuys.push(e?.nBuys ?? 0);
        dailySells.push(e?.nSells ?? 0);
      }

      const ratios: number[] = [];
      const totals: number[] = [];
      let sumB = 0, sumS = 0;
      for (let i = 0; i < daysList.length; i++) {
        sumB += dailyBuys[i];
        sumS += dailySells[i];
        if (i >= 14) {
          sumB -= dailyBuys[i - 14];
          sumS -= dailySells[i - 14];
        }
        const total = sumB + sumS;
        const ratio = total > 0 ? sumB / total : 0.5;
        ratios.push(ratio);
        totals.push(total);
        cells.push({
          sector,
          date: daysList[i],
          nBuys: sumB,
          nSells: sumS,
          ratio,
          total,
        });
      }
      sectorRatios.push(ratios);
      sectorTotals.push(totals);
    }

    for (let i = 0; i < daysList.length; i++) {
      let weightedSum = 0;
      let weightSum = 0;
      let totalN = 0;
      for (let si = 0; si < realSectors.length; si++) {
        const w = SECTOR_WEIGHT[realSectors[si]] ?? 0;
        weightedSum += w * sectorRatios[si][i];
        weightSum += w;
        totalN += sectorTotals[si][i];
      }
      const ratio = weightSum > 0 ? weightedSum / weightSum : 0.5;
      cells.push({
        sector: "Total*",
        date: daysList[i],
        nBuys: Math.round(ratio * totalN),
        nSells: Math.round((1 - ratio) * totalN),
        ratio,
        total: totalN,
      });
    }

    return cells;
  }, [buys, sells, daysList]);

  // Per-sector mean +/- 2sigma
  const perSectorStats = useMemo(() => {
    const map: Record<string, { mean: number; lo: number; hi: number }> = {};
    for (const sector of SECTOR_ORDER) {
      const vals = rollingData.filter((c) => c.sector === sector && c.total > 0).map((c) => c.ratio);
      if (vals.length === 0) { map[sector] = { mean: 0.5, lo: 0, hi: 1 }; continue; }
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const variance = vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length;
      const sigma = Math.sqrt(variance);
      map[sector] = { mean, lo: mean - 2 * sigma, hi: mean + 2 * sigma };
    }
    return map;
  }, [rollingData]);

  const cellColor = useCallback((sector: string, ratio: number) => {
    const { mean, lo, hi } = perSectorStats[sector] ?? { mean: 0.5, lo: 0, hi: 1 };
    if (ratio >= hi) return "#00ff6a";
    if (ratio <= lo) return "#ff2020";
    if (ratio >= mean) {
      const t = (ratio - mean) / (hi - mean);
      return d3.interpolateRgb("#374151", "#00ff6a")(t);
    }
    const t = (mean - ratio) / (mean - lo);
    return d3.interpolateRgb("#374151", "#ff2020")(t);
  }, [perSectorStats]);

  // Per-sector average total for opacity scaling
  const sectorAvgTotal = useMemo(() => {
    const map: Record<string, number> = {};
    for (const sector of SECTOR_ORDER) {
      const vals = rollingData.filter((c) => c.sector === sector && c.total > 0).map((c) => c.total);
      map[sector] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 1;
    }
    return map;
  }, [rollingData]);

  // Rolling strip scales
  const xRollScale = useMemo(
    () => d3.scaleTime().domain([yearAgo, today]).range([0, RIW]),
    [yearAgo, today]
  );
  const yRollScale = useMemo(
    () => d3.scaleBand<string>().domain(SECTOR_ORDER).range([0, RIH]).padding(0.08),
    []
  );

  // Brush-highlighted days for rolling strip
  const rollBrushRange = useMemo<[Date, Date] | null>(() => {
    return heatBrush ?? candleBrush ?? brushExtent ?? null;
  }, [brushExtent, heatBrush, candleBrush]);

  // ── Fetch all ETF candlestick data on mount ────────────────────────────
  const activeETF = SECTOR_ETF[activeSector] ?? "SPY";
  const [allCandles, setAllCandles] = useState<Record<string, Candle[]>>({});

  useEffect(() => {
    const etfs = [...new Set(Object.values(SECTOR_ETF))];
    Promise.all(
      etfs.map((sym) =>
        fetch(`${import.meta.env.BASE_URL}data/${sym.toLowerCase()}-prices.json`)
          .then((r) => r.json())
          .then((json) => ({ sym, candles: (json.candles || []) as Candle[] }))
          .catch(() => ({ sym, candles: [] as Candle[] }))
      )
    ).then((results) => {
      const map: Record<string, Candle[]> = {};
      for (const r of results) map[r.sym] = r.candles;
      setAllCandles(map);
      setCandleLoading(false);
    });
  }, []);

  const candleData = allCandles[activeETF] || [];

  // ── Candlestick scales ─────────────────────────────────────────────────
  const xCandleScale = useMemo(
    () => d3.scaleTime().domain([yearAgo, today]).range([0, CIW]),
    [yearAgo, today]
  );
  const candleParsed = useMemo(
    () => candleData.map((c) => ({ ...c, d: new Date(c.date) })),
    [candleData]
  );
  const yCandleScale = useMemo(() => {
    if (candleParsed.length === 0) return d3.scaleLinear().domain([0, 100]).range([CIH, 0]);
    const lo = d3.min(candleParsed, (c) => c.low) ?? 0;
    const hi = d3.max(candleParsed, (c) => c.high) ?? 100;
    const pad = (hi - lo) * 0.05;
    return d3.scaleLinear().domain([lo - pad, hi + pad]).nice().range([CIH, 0]);
  }, [candleParsed]);
  const candleWidth = useMemo(
    () => Math.max(1, CIW / Math.max(1, candleParsed.length) - 1),
    [candleParsed]
  );
  const xCandleMonthTicks = useMemo(() => xCandleScale.ticks(d3.timeMonth.every(1)!), [xCandleScale]);
  const yCandleTicks = useMemo(() => yCandleScale.ticks(6), [yCandleScale]);

  // ── D3 brush ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!brushGroupRef.current || weeklyData.length === 0) return;

    const brush = d3
      .brushX()
      .extent([[0, 0], [IW, IH]])
      .on("brush end", (event: d3.D3BrushEvent<unknown>) => {
        if (!event.selection) {
          setBrushExtent(null);
          return;
        }
        const [x0, x1] = event.selection as [number, number];
        setBrushExtent([xScale.invert(x0), xScale.invert(x1)]);
      });

    brushRef.current = brush;
    const g = d3.select(brushGroupRef.current);
    g.call(brush as d3.BrushBehavior<unknown>);
    g.select(".selection")
      .attr("fill", "#ffffff")
      .attr("fill-opacity", "0.12")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", "1");
    g.selectAll(".handle").attr("fill", "#64748b");

    return () => { g.on(".brush", null); };
  }, [weeklyData.length, xScale]);

  // ── Heat strip brush ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!heatBrushGroupRef.current || rollingData.length === 0) return;

    const brush = d3
      .brushX()
      .extent([[0, 0], [RIW, RIH]])
      .on("start", (event: d3.D3BrushEvent<unknown>) => {
        if (!event.sourceEvent) return;
        isBrushing.current = true;
        setRollHover(null);
        setRollHoverPos(null);
        const [, y] = d3.pointer(event.sourceEvent, heatBrushGroupRef.current);
        for (const sector of SECTOR_ORDER) {
          const sy = yRollScale(sector);
          if (sy === undefined) continue;
          if (y >= sy && y <= sy + yRollScale.bandwidth()) {
            setActiveSector(sector);
            break;
          }
        }
      })
      .on("brush end", (event: d3.D3BrushEvent<unknown>) => {
        if (event.type === "end") isBrushing.current = false;
        if (!event.selection) {
          setHeatBrush(null);
          return;
        }
        const [x0, x1] = event.selection as [number, number];
        setHeatBrush([xRollScale.invert(x0), xRollScale.invert(x1)]);
        try {
          if (candleBrushGroupRef.current && candleBrushRef.current) {
            d3.select(candleBrushGroupRef.current).call(candleBrushRef.current.move as never, null);
          }
        } catch {}
        setCandleBrush(null);
      });

    heatBrushRef.current = brush;
    const g = d3.select(heatBrushGroupRef.current);
    g.call(brush as d3.BrushBehavior<unknown>);
    g.select(".selection")
      .attr("fill", "#ffffff")
      .attr("fill-opacity", "0")
      .attr("stroke", "none");
    g.selectAll(".handle")
      .attr("fill", "#ffffff")
      .attr("fill-opacity", "0")
      .attr("stroke", "none");

    g.select(".overlay")
      .on("mousemove.hover", (event: MouseEvent) => {
        if (isBrushing.current) { setRollHover(null); setRollHoverPos(null); return; }
        const [mx, my] = d3.pointer(event, heatBrushGroupRef.current);
        let hoveredSector: string | null = null;
        for (const sector of SECTOR_ORDER) {
          const sy = yRollScale(sector);
          if (sy === undefined) continue;
          if (my >= sy && my <= sy + yRollScale.bandwidth()) {
            hoveredSector = sector;
            break;
          }
        }
        if (!hoveredSector) { setRollHover(null); setRollHoverPos(null); return; }
        const hoveredDate = xRollScale.invert(mx);
        const cell = rollingData.find(
          (c) => c.sector === hoveredSector &&
            Math.abs(c.date.getTime() - hoveredDate.getTime()) < 24 * 60 * 60 * 1000
        );
        if (!cell) { setRollHover(null); setRollHoverPos(null); return; }
        const svg = (heatBrushGroupRef.current as SVGGElement).closest("svg")!;
        const rect = svg.getBoundingClientRect();
        const svgX = xRollScale(cell.date) + RM.left;
        const svgY = (yRollScale(cell.sector) ?? 0) + RM.top;
        const pxX = (svgX / W) * rect.width;
        const pxY = (svgY / ROLL_H) * rect.height;
        setRollHover(cell);
        setRollHoverPos({ x: rect.left + pxX, y: rect.top + pxY });
      })
      .on("mouseleave.hover", () => { setRollHover(null); setRollHoverPos(null); });

    return () => {
      g.on(".brush", null);
      g.select(".overlay").on("mousemove.hover", null).on("mouseleave.hover", null);
    };
  }, [rollingData, xRollScale, yRollScale]);

  // ── Candlestick brush ──────────────────────────────────────────────────
  useEffect(() => {
    if (!candleBrushGroupRef.current || candleParsed.length === 0) return;

    const brush = d3
      .brushX()
      .extent([[0, 0], [CIW, CIH]])
      .on("brush end", (event: d3.D3BrushEvent<unknown>) => {
        if (!event.selection) {
          setCandleBrush(null);
          return;
        }
        const [x0, x1] = event.selection as [number, number];
        setCandleBrush([xCandleScale.invert(x0), xCandleScale.invert(x1)]);
        try {
          if (heatBrushGroupRef.current && heatBrushRef.current) {
            d3.select(heatBrushGroupRef.current).call(heatBrushRef.current.move as never, null);
          }
        } catch {}
        setHeatBrush(null);
      });

    candleBrushRef.current = brush;
    const g = d3.select(candleBrushGroupRef.current);
    g.call(brush as d3.BrushBehavior<unknown>);
    g.select(".selection")
      .attr("fill", "#ffffff")
      .attr("fill-opacity", "0.08")
      .attr("stroke", "none");
    g.selectAll(".handle").attr("fill", "#64748b");

    return () => { g.on(".brush", null); };
  }, [candleParsed.length, xCandleScale]);

  // Active highlight range (from either brush)
  const activeRange = heatBrush ?? candleBrush ?? null;

  // ── Clear all selections ─────────────────────────────────────────────
  const clearSelection = useCallback(() => {
    setHeatBrush(null);
    setCandleBrush(null);
    setBrushExtent(null);
    try {
      if (heatBrushGroupRef.current && heatBrushRef.current)
        d3.select(heatBrushGroupRef.current).call(heatBrushRef.current.move as never, null);
    } catch {}
    try {
      if (candleBrushGroupRef.current && candleBrushRef.current)
        d3.select(candleBrushGroupRef.current).call(candleBrushRef.current.move as never, null);
    } catch {}
    try {
      if (brushGroupRef.current && brushRef.current)
        d3.select(brushGroupRef.current).call(brushRef.current.move as never, null);
    } catch {}
  }, []);

  // ESC key to clear selection
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [clearSelection]);

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface shadow-sm p-4 mt-6 h-32 flex items-center justify-center">
        <span className="animate-spin text-2xl text-slate-400">&#9696;</span>
      </div>
    );
  }

  if (buys.length === 0 && sells.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface shadow-sm p-4 mt-6 h-32 flex items-center justify-center">
        <span className="text-slate-400 text-sm">No sentiment data available</span>
      </div>
    );
  }

  const fmt = (d: Date) => d3.timeFormat("%b %d, %Y")(d);

  return (
    <div style={{ fontFamily: "'Roboto', system-ui, sans-serif" }}>
    {/* Insider Sentiment section hidden */}
    <div className="hidden rounded-xl border border-border bg-surface shadow-sm p-4 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Insider Sentiment</h2>
          <span className="text-xs text-slate-500">
            Weekly buy/sell ratio (unique tickers) · drag to filter heat map
          </span>
        </div>
        {brushExtent && (
          <button
            onClick={clearSelection}
            className="text-xs text-slate-400 hover:text-white border border-border rounded px-2.5 py-1 transition-colors flex items-center gap-1.5"
          >
            Clear Selection
            <kbd className="text-[10px] bg-white/10 rounded px-1 py-0.5 font-mono">ESC</kbd>
          </button>
        )}
      </div>

      {/* ── Top: Sentiment Line ────────────────────────────────────────── */}
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${TOP_H}`} className="w-full" style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="sent-clip">
              <rect x={0} y={0} width={IW} height={IH} />
            </clipPath>
          </defs>

          <g transform={`translate(${M.left},${M.top})`}>
            {/* Horizontal grid */}
            {yTicks.map((t) => (
              <line key={t} x1={0} x2={IW} y1={yScale(t)} y2={yScale(t)} stroke="#1e293b" strokeWidth={1} />
            ))}

            {/* 50% neutral line */}
            <line
              x1={0} x2={IW} y1={yScale(50)} y2={yScale(50)}
              stroke="#475569" strokeWidth={1} strokeDasharray="4 3"
            />
            <text x={IW + 4} y={yScale(50)} dominantBaseline="middle" fill="#64748b" fontSize={9}>
              Neutral
            </text>

            {/* Areas */}
            <g clipPath="url(#sent-clip)">
              <path d={areaAbove} fill="#22c55e" fillOpacity={0.25} />
              <path d={areaBelow} fill="#ef4444" fillOpacity={0.25} />
              <path d={linePath} fill="none" stroke="#ffffff" strokeWidth={1.5} strokeOpacity={0.85} />

              {/* Dots */}
              {weeklyData.map((w, i) => (
                <circle
                  key={i}
                  cx={xScale(w.weekStart)}
                  cy={yScale(w.ratio)}
                  r={rScale(w.total)}
                  fill={w.ratio >= 50 ? "#00ff6a" : "#ff2020"}
                  fillOpacity={0.8}
                  stroke="#0f172a"
                  strokeWidth={0.5}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const svg = e.currentTarget.closest("svg")!;
                    const rect = svg.getBoundingClientRect();
                    const svgX = xScale(w.weekStart) + M.left;
                    const svgY = yScale(w.ratio) + M.top;
                    const pxX = (svgX / W) * rect.width;
                    const pxY = (svgY / TOP_H) * rect.height;
                    setTopHover(w);
                    setTopHoverPos({ x: rect.left + pxX, y: rect.top + pxY });
                  }}
                  onMouseLeave={() => { setTopHover(null); setTopHoverPos(null); }}
                />
              ))}
            </g>

            {/* X axis */}
            <line x1={0} x2={IW} y1={IH} y2={IH} stroke="#334155" />
            {xMonthTicks.map((tick) => (
              <g key={tick.toString()} transform={`translate(${xScale(tick)},${IH})`}>
                <line y2={4} stroke="#334155" />
                <text y={17} textAnchor="middle" fill="#64748b" fontSize={10}>
                  {d3.timeFormat("%b")(tick)}
                </text>
              </g>
            ))}

            {/* Y axis */}
            <line x1={0} x2={0} y1={0} y2={IH} stroke="#334155" />
            {yTicks.map((t) => (
              <g key={t} transform={`translate(0,${yScale(t)})`}>
                <line x2={-4} stroke="#334155" />
                <text x={-8} textAnchor="end" dominantBaseline="middle" fill="#64748b" fontSize={10}>
                  {t}%
                </text>
              </g>
            ))}
            <text
              transform="rotate(-90)"
              x={-IH / 2} y={-38}
              textAnchor="middle" fill="#64748b" fontSize={11}
            >
              Buy Ratio %
            </text>

            {/* Brush */}
            <g ref={brushGroupRef} />
          </g>
        </svg>

        {/* Top tooltip */}
        {topHover && topHoverPos && (
          <div
            className="fixed z-50 pointer-events-none bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs shadow-lg"
            style={{ left: topHoverPos.x + 12, top: topHoverPos.y - 60 }}
          >
            <div className="font-semibold text-white mb-1">
              {fmt(topHover.weekStart)} – {fmt(topHover.weekEnd)}
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-emerald-400">Buys:</span>
              <span className="text-white font-medium">{topHover.nBuys} tickers</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-red-400">Sells:</span>
              <span className="text-white font-medium">{topHover.nSells} tickers</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-600 pt-1 mt-1">
              <span className="text-slate-400">Ratio:</span>
              <span className="text-white font-semibold">{topHover.ratio.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Total:</span>
              <span className="text-white">{topHover.total}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom: Sector Heat Strip ─────────────────────────────────── */}
      <div className="mt-4 border-t border-border pt-4 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">
            Sector Heat Map · bi-monthly buy ratio by sector
          </span>
          {brushExtent && (
            <span className="text-xs text-slate-500">
              Highlighting {brushExtent[0].toLocaleDateString()} – {brushExtent[1].toLocaleDateString()}
            </span>
          )}
        </div>

        <svg viewBox={`0 0 ${W} ${BOT_H}`} className="w-full">
          <g transform={`translate(${BM.left},${BM.top})`}>
            {/* Cells */}
            {heatData.map((cell, ci) => {
              const pi = ci % halfMonths.length;
              const cx = xHeatScale(pi);
              const cy = yHeatScale(cell.sector);
              if (cx === undefined || cy === undefined) return null;
              const cw = xHeatScale.bandwidth();
              const ch = yHeatScale.bandwidth();
              const dimmed = highlightedPeriods !== null && !highlightedPeriods.has(pi);
              const opacity = cell.total > 0 ? Math.min(1, cell.total / 20) : 0.05;

              return (
                <rect
                  key={`${cell.sector}-${pi}`}
                  x={cx}
                  y={cy}
                  width={cw}
                  height={ch}
                  fill={cell.total > 0 ? cellColor(cell.sector, cell.ratio) : "#1e293b"}
                  fillOpacity={dimmed ? opacity * 0.2 : opacity}
                  rx={2}
                  stroke={dimmed ? "none" : (highlightedPeriods !== null ? "#94a3b8" : "none")}
                  strokeWidth={highlightedPeriods !== null && !dimmed ? 1 : 0}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const svg = e.currentTarget.closest("svg")!;
                    const rect = svg.getBoundingClientRect();
                    const svgX = cx + cw / 2 + BM.left;
                    const svgY = cy + BM.top;
                    const pxX = (svgX / W) * rect.width;
                    const pxY = (svgY / BOT_H) * rect.height;
                    setBotHover(cell);
                    setBotHoverPos({ x: rect.left + pxX, y: rect.top + pxY });
                  }}
                  onMouseLeave={() => { setBotHover(null); setBotHoverPos(null); }}
                />
              );
            })}

            {/* Y axis labels (sectors) */}
            {SECTOR_ORDER.map((sector) => {
              const cy = yHeatScale(sector);
              if (cy === undefined) return null;
              return (
                <text
                  key={sector}
                  x={-8}
                  y={cy + yHeatScale.bandwidth() / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="#94a3b8"
                  fontSize={10}
                >
                  {sector}
                </text>
              );
            })}

            {/* X axis labels (half-months) */}
            {halfMonths.map((hm, i) => {
              const cx = xHeatScale(i);
              if (cx === undefined) return null;
              const is1H = hm.label.endsWith("1H");
              return (
                <text
                  key={i}
                  x={cx + xHeatScale.bandwidth() / 2}
                  y={BIH + 16}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize={is1H ? 9 : 7}
                >
                  {is1H ? d3.timeFormat("%b")(hm.start) : "·"}
                </text>
              );
            })}
          </g>
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-1 ml-[110px] text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#22c55e" }} />
            <span>More buys</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#6b7280" }} />
            <span>Neutral</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#ef4444" }} />
            <span>More sells</span>
          </div>
          <span className="text-slate-600">· Opacity = activity volume</span>
        </div>

        {/* Bottom tooltip */}
        {botHover && botHoverPos && (
          <div
            className="fixed z-50 pointer-events-none bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs shadow-lg"
            style={{ left: botHoverPos.x + 12, top: botHoverPos.y - 50 }}
          >
            <div className="font-semibold text-white mb-1">
              {botHover.sector} · {botHover.periodLabel}
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-emerald-400">Buys:</span>
              <span className="text-white font-medium">{botHover.nBuys}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-red-400">Sells:</span>
              <span className="text-white font-medium">{botHover.nSells}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-600 pt-1 mt-1">
              <span className="text-slate-400">Ratio:</span>
              <span className="text-white font-semibold">{(botHover.ratio * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Total:</span>
              <span className="text-white">{botHover.total}</span>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ── ETF Candlestick + Rolling Sector Heat Strip ────────────────── */}
    <div className="rounded-xl border border-border bg-surface shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-white">
            {activeETF} — {activeSector}
          </h2>
          <span className="text-sm text-slate-400">
            1Y daily candlestick · drag on heat strip to switch ETF
          </span>
        </div>
        {activeRange && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {d3.timeFormat("%b %d, %Y")(activeRange[0])} – {d3.timeFormat("%b %d, %Y")(activeRange[1])}
            </span>
            <button
              onClick={clearSelection}
              className="text-xs text-slate-400 hover:text-white border border-border rounded px-2.5 py-1 transition-colors flex items-center gap-1.5"
            >
              Clear Selection
              <kbd className="text-[10px] bg-white/10 rounded px-1 py-0.5 font-mono">ESC</kbd>
            </button>
          </div>
        )}
      </div>

      {/* ── Candlestick Chart ──────────────────────────────────────── */}
      {candleLoading ? (
        <div className="h-[200px] flex items-center justify-center">
          <span className="animate-spin text-2xl text-slate-400">&#9696;</span>
        </div>
      ) : (
        <svg viewBox={`0 0 ${W} ${CAND_H}`} className="w-full" style={{ fontFamily: "'Roboto', system-ui, sans-serif" }}>
          <g transform={`translate(${CM.left},${CM.top})`}>
            {/* Horizontal grid */}
            {yCandleTicks.map((t) => (
              <line key={t} x1={0} x2={CIW} y1={yCandleScale(t)} y2={yCandleScale(t)} stroke="#1e293b" strokeWidth={1} />
            ))}

            {/* Candles */}
            {candleParsed.map((c, i) => {
              const cx = xCandleScale(c.d);
              const isUp = c.close >= c.open;
              const bodyTop = yCandleScale(Math.max(c.open, c.close));
              const bodyBot = yCandleScale(Math.min(c.open, c.close));
              const bodyH = Math.max(1, bodyBot - bodyTop);
              const color = isUp ? "#22c55e" : "#ef4444";
              const dimmed = activeRange !== null && (c.d < activeRange[0] || c.d > activeRange[1]);
              return (
                <g key={i} opacity={dimmed ? 0.3 : 1}>
                  <line
                    x1={cx} x2={cx}
                    y1={yCandleScale(c.high)} y2={yCandleScale(c.low)}
                    stroke={color} strokeWidth={1}
                  />
                  <rect
                    x={cx - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyH}
                    fill={color}
                  />
                </g>
              );
            })}

            {/* X axis */}
            <line x1={0} x2={CIW} y1={CIH} y2={CIH} stroke="#334155" />
            {xCandleMonthTicks.map((tick) => (
              <g key={tick.toString()} transform={`translate(${xCandleScale(tick)},${CIH})`}>
                <line y2={4} stroke="#334155" />
                <text y={17} textAnchor="middle" fill="#94a3b8" fontSize={11}>
                  {d3.timeFormat("%b '%y")(tick)}
                </text>
              </g>
            ))}
            <text
              x={CIW / 2} y={CIH + 32}
              textAnchor="middle" fill="#64748b" fontSize={11} letterSpacing="0.04em"
            >
              DATE
            </text>

            {/* Y axis */}
            <line x1={0} x2={0} y1={0} y2={CIH} stroke="#334155" />
            {yCandleTicks.map((t) => (
              <g key={t} transform={`translate(0,${yCandleScale(t)})`}>
                <line x2={-4} stroke="#334155" />
                <text x={-8} textAnchor="end" dominantBaseline="middle" fill="#94a3b8" fontSize={11}>
                  {`$${t.toFixed(0)}`}
                </text>
              </g>
            ))}
            <text
              transform="rotate(-90)"
              x={-CIH / 2} y={-100}
              textAnchor="middle" fill="#64748b" fontSize={11} letterSpacing="0.04em"
            >
              PRICE (USD)
            </text>

            {/* Active range lines (from heat brush) */}
            {activeRange && !candleBrush && (
              <>
                <line
                  x1={xCandleScale(activeRange[0])} x2={xCandleScale(activeRange[0])}
                  y1={0} y2={CIH}
                  stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3"
                />
                <line
                  x1={xCandleScale(activeRange[1])} x2={xCandleScale(activeRange[1])}
                  y1={0} y2={CIH}
                  stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3"
                />
              </>
            )}

            {/* Crosshair */}
            {candleHover && (() => {
              const price = yCandleScale.invert(candleHover.y);
              const date = xCandleScale.invert(candleHover.x);
              const priceLabel = `$${price.toFixed(2)}`;
              const dateLabel = d3.timeFormat("%b %d, %Y")(date);
              const labelW = priceLabel.length * 6 + 10;
              return (
                <>
                  <line x1={candleHover.x} x2={candleHover.x} y1={0} y2={CIH} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" pointerEvents="none" />
                  <line x1={0} x2={CIW} y1={candleHover.y} y2={candleHover.y} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" pointerEvents="none" />
                  {/* Date label on x-axis */}
                  <rect x={candleHover.x - 30} y={CIH + 4} width={60} height={14} fill="#22c55e" rx={2} pointerEvents="none" />
                  <text x={candleHover.x} y={CIH + 13} textAnchor="middle" fill="#000" fontSize={9} fontWeight="600" pointerEvents="none">
                    {dateLabel}
                  </text>
                  {/* Price label on y-axis */}
                  <rect x={-CM.left + 21} y={candleHover.y - 8} width={labelW} height={16} fill="#22c55e" rx={2} pointerEvents="none" />
                  <text x={-CM.left + 21 + labelW / 2} y={candleHover.y + 1} textAnchor="middle" dominantBaseline="middle" fill="#000" fontSize={10} fontWeight="600" pointerEvents="none">
                    {priceLabel}
                  </text>
                </>
              );
            })()}

            {/* Mouse tracking overlay */}
            <rect
              x={0} y={0} width={CIW} height={CIH}
              fill="transparent"
              style={{ cursor: "crosshair" }}
              onMouseMove={(e) => {
                const svg = (e.currentTarget as SVGRectElement).closest("svg")!;
                const rect = svg.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * W - CM.left;
                const y = ((e.clientY - rect.top) / rect.height) * CAND_H - CM.top;
                setCandleHover({ x, y });
              }}
              onMouseLeave={() => setCandleHover(null)}
            />

            {/* Brush overlay */}
            <g ref={candleBrushGroupRef} />
          </g>
        </svg>
      )}

      {/* Divider */}
      <div className="border-t border-border my-1" />

<svg viewBox={`0 0 ${W} ${ROLL_H}`} className="w-full" style={{ fontFamily: "'Roboto', system-ui, sans-serif" }}>
        <g transform={`translate(${RM.left},${RM.top})`}>
          {/* Continuous day strips per sector */}
          {SECTOR_ORDER.map((sector, si) => {
            const sy = yRollScale(sector);
            if (sy === undefined) return null;
            const sh = yRollScale.bandwidth();

            const sectorCells = rollingData.filter((c) => c.sector === sector);
            const isActive = sector === activeSector;

            const avg = sectorAvgTotal[sector] ?? 1;
            const gradId = `roll-grad-${si}`;

            return (
              <g key={sector}>
                {/* Gradient definition */}
                <defs>
                  <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                    {sectorCells.map((cell, di) => {
                      const pct = (xRollScale(cell.date) / RIW) * 100;
                      const color = cell.total > 0 ? cellColor(cell.sector, cell.ratio) : "#1e293b";
                      const opacity = cell.total > 0
                        ? Math.max(0.03, Math.min(1, (cell.total / avg) ** 2))
                        : 0.05;
                      return <stop key={di} offset={`${pct}%`} stopColor={color} stopOpacity={opacity} />;
                    })}
                  </linearGradient>
                </defs>

                {/* Sector label */}
                <text
                  x={-8}
                  y={sy + sh / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill={isActive ? "#ffffff" : "#94a3b8"}
                  fontSize={11}
                  fontWeight={isActive ? 600 : 400}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveSector(sector)}
                >
                  {sector}
                </text>

                {/* Continuous gradient strip */}
                <rect x={0} y={sy} width={RIW} height={sh} fill={`url(#${gradId})`} pointerEvents="none" />

                {/* Dim overlays for brush range */}
                {rollBrushRange && (
                  <>
                    <rect
                      x={0} y={sy}
                      width={Math.max(0, xRollScale(rollBrushRange[0]))}
                      height={sh}
                      fill="#0f172a" fillOpacity={0.85}
                      pointerEvents="none"
                    />
                    <rect
                      x={xRollScale(rollBrushRange[1])} y={sy}
                      width={Math.max(0, RIW - xRollScale(rollBrushRange[1]))}
                      height={sh}
                      fill="#0f172a" fillOpacity={0.85}
                      pointerEvents="none"
                    />
                  </>
                )}

                {/* Per-row brush selection overlay */}
                {isActive && heatBrush && (
                  <>
                    <rect
                      x={xRollScale(heatBrush[0])}
                      y={sy}
                      width={xRollScale(heatBrush[1]) - xRollScale(heatBrush[0])}
                      height={sh}
                      fill="#facc15" fillOpacity={0.08}
                      pointerEvents="none"
                    />
                    <line
                      x1={xRollScale(heatBrush[0])} x2={xRollScale(heatBrush[0])}
                      y1={sy} y2={sy + sh}
                      stroke="#facc15" strokeWidth={0.5} strokeDasharray="3 2"
                      pointerEvents="none"
                    />
                    <line
                      x1={xRollScale(heatBrush[1])} x2={xRollScale(heatBrush[1])}
                      y1={sy} y2={sy + sh}
                      stroke="#facc15" strokeWidth={0.5} strokeDasharray="3 2"
                      pointerEvents="none"
                    />
                  </>
                )}

                {/* Active sector border */}
                {isActive && (
                  <>
                    <line x1={0} x2={RIW} y1={sy} y2={sy} stroke="#facc15" strokeWidth={1.5} pointerEvents="none" />
                    <line x1={0} x2={RIW} y1={sy + sh} y2={sy + sh} stroke="#facc15" strokeWidth={1.5} pointerEvents="none" />
                  </>
                )}
              </g>
            );
          })}

          {/* X axis — month ticks */}
          {xMonthTicks.map((tick) => (
            <g key={tick.toString()} transform={`translate(${xRollScale(tick)},${RIH})`}>
              <line y2={4} stroke="#334155" />
              <text y={17} textAnchor="middle" fill="#94a3b8" fontSize={11}>
                {d3.timeFormat("%b '%y")(tick)}
              </text>
            </g>
          ))}
          <text
            x={RIW / 2} y={RIH + 32}
            textAnchor="middle" fill="#64748b" fontSize={11} letterSpacing="0.04em"
          >
            DATE
          </text>
          <text
            transform="rotate(-90)"
            x={-RIH / 2} y={-100}
            textAnchor="middle" fill="#64748b" fontSize={11} letterSpacing="0.04em"
          >
            SECTOR
          </text>

          {/* Heat brush overlay */}
          <g ref={heatBrushGroupRef} />
        </g>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-md font-medium text-slate-300">
        <span>Ratio of Insider Buying to Selling</span>
        <div className="flex items-center gap-2">
          <span>Low</span>
          <div
            className="h-4 w-32 rounded-sm"
            style={{
              background: "linear-gradient(to right, #ff2020, #374151, #00ff6a)",
            }}
          />
          <span>High</span>
        </div>
        <span>· 14-day rolling window · opacity = transaction volume</span>
      </div>

      {/* Rolling tooltip */}
      {rollHover && rollHoverPos && (
        <div
          className="fixed z-50 pointer-events-none bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs shadow-lg"
          style={{ left: rollHoverPos.x + 12, top: rollHoverPos.y - 50 }}
        >
          <div className="font-semibold text-white mb-1">
            {rollHover.sector} · {d3.timeFormat("%b %d, %Y")(rollHover.date)}
          </div>
          <div className="text-slate-400 mb-1" style={{ fontSize: 10 }}>
            Trailing 14 days
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-emerald-400">Buys:</span>
            <span className="text-white font-medium">{rollHover.nBuys}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-red-400">Sells:</span>
            <span className="text-white font-medium">{rollHover.nSells}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-600 pt-1 mt-1">
            <span className="text-slate-400">Ratio:</span>
            <span className="text-white font-semibold">{(rollHover.ratio * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Total:</span>
            <span className="text-white">{rollHover.total}</span>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

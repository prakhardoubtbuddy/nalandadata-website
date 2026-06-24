import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

/*
 * BenchmarkCharts — SWE-bench++-style pictorial benchmark presentation.
 *
 * Renders, from REAL data passed in via the `benchmark` prop:
 *   1. Model leaderboard (resolve-rate-style horizontal bars; our model highlighted)
 *   2. A grid of task-distribution charts (table type / subject / complexity)
 *
 * Themed to the Nalandadata design system: dark (#0A0A0A / #121212) + blue/indigo
 * accents (#3B82F6 / #6366F1), Inter/JetBrains Mono. No external image assets — all
 * charts are live SVG (Recharts), so the numbers stay bound to real source data.
 */

const BLUE = "#3B82F6";
const INDIGO = "#6366F1";
const GRID = "#27272A";
const TEXT_MUTED = "#A1A1AA";
const PALETTE = ["#3B82F6", "#6366F1", "#8B5CF6", "#0EA5E9", "#14B8A6", "#F59E0B", "#52525B"];

function ChartTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0A0A0A]/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="font-mono text-xs text-gray-300">{label}</p>
      <p className="font-mono text-sm font-semibold text-white">
        {payload[0].value}
        {suffix}
      </p>
    </div>
  );
}

function SectionHeading({ index, title, caption }) {
  return (
    <div className="mb-5">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
        Figure {index}
      </p>
      <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
      {caption && <p className="mt-1 text-sm text-gray-400">{caption}</p>}
    </div>
  );
}

/* ---- 1. Model leaderboard (horizontal, our model highlighted) ---- */
function ModelLeaderboard({ models, metricLabel = "TEDS", metricKey = "score", ours }) {
  const data = [...models].sort((a, b) => b[metricKey] - a[metricKey]);
  return (
    <div className="rounded-xl border border-white/5 bg-[#121212] p-6">
      <SectionHeading
        index={1}
        title={`Benchmark Results — ${metricLabel} by Model`}
        caption="Held-out test set. Higher is better. Our fine-tuned model vs. zero-shot frontier models."
      />
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 46)}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 36, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke={GRID} strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: TEXT_MUTED, fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
            stroke={GRID}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fill: "#EDEDED", fontSize: 12 }}
            stroke={GRID}
          />
          <Tooltip cursor={{ fill: "#ffffff08" }} content={<ChartTooltip suffix="%" />} />
          <Bar dataKey={metricKey} radius={[0, 4, 4, 0]} barSize={22}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.name === ours ? BLUE : "#3F3F46"} />
            ))}
            <LabelList
              dataKey={metricKey}
              position="right"
              formatter={(v) => `${v}%`}
              style={{ fill: "#EDEDED", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---- 2. A single distribution bar chart ---- */
function DistributionChart({ index, title, caption, data, accent = BLUE, colorful = false }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#121212] p-6">
      <SectionHeading index={index} title={title} caption={caption} />
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 36, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke={GRID} strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fill: TEXT_MUTED, fontSize: 12 }} stroke={GRID} />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: "#EDEDED", fontSize: 12 }}
            stroke={GRID}
          />
          <Tooltip cursor={{ fill: "#ffffff08" }} content={<ChartTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((d, i) => (
              <Cell key={i} fill={colorful ? PALETTE[i % PALETTE.length] : accent} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              style={{ fill: "#EDEDED", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BenchmarkCharts({ benchmark }) {
  if (!benchmark) return null;
  const { headline, models, oursLabel, distributions, source } = benchmark;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Benchmark & Composition</h2>
        {headline && <p className="text-gray-400 max-w-3xl">{headline}</p>}
      </div>

      {models?.length > 0 && (
        <ModelLeaderboard
          models={models}
          ours={oursLabel}
          metricLabel={benchmark.metricLabel || "TEDS"}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {distributions?.map((dist, i) => (
          <DistributionChart
            key={dist.title}
            index={i + 2}
            title={dist.title}
            caption={dist.caption}
            data={dist.data}
            colorful={dist.colorful}
            accent={i % 2 === 0 ? BLUE : INDIGO}
          />
        ))}
      </div>

      {source && (
        <p className="font-mono text-xs text-gray-600">
          {source}
        </p>
      )}
    </motion.div>
  );
}

export default BenchmarkCharts;

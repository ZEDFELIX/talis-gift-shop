export function SalesChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const W = 700;
  const H = 220;
  const pad = 28;
  const bw = (W - pad * 2) / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Revenue over the last 14 days" className="w-full">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad} x2={W - pad} y1={pad + (H - pad * 2) * (1 - f)} y2={pad + (H - pad * 2) * (1 - f)} stroke="#D8CBB8" strokeWidth="1" strokeDasharray="3 4" />
      ))}
      {data.map((d, i) => {
        const h = d.value === 0 ? 2 : Math.max(3, ((H - pad * 2) * d.value) / max);
        const x = pad + i * bw + bw * 0.18;
        const y = H - pad - h;
        return (
          <g key={i}>
            <title>{`${d.label}: KSh ${d.value.toLocaleString("en-KE")}`}</title>
            <rect x={x} y={y} width={bw * 0.64} height={h} fill={d.value === 0 ? "#E4D1A5" : i === data.length - 1 ? "#C9A45C" : "#241B16"} opacity={d.value === 0 ? 0.6 : 0.92} rx="1.5" />
            <text x={x + bw * 0.32} y={H - 10} textAnchor="middle" fontSize="9" fill="#241B16" opacity="0.55">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

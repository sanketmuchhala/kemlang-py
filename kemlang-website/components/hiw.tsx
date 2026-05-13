// Shared components for all "How it works" pages.
// Line-height on <pre> is 1.3 so box-drawing characters connect properly.

export const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t scroll-mt-20">{children}</h2>
);

export const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-semibold text-base mt-6 mb-3">{children}</h3>
);

export const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

// ASCII-art diagram block - tight line-height so box-drawing chars connect.
export const Diagram = ({ label, children }: { label: string; children: string }) => (
  <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
    <div className="px-4 py-2 border-b font-mono text-xs text-muted-foreground"
      style={{ borderColor: "hsl(var(--border))" }}>{label}</div>
    <div className="overflow-x-auto">
      <pre
        className="px-6 py-5 font-mono text-xs"
        style={{ color: "hsl(var(--code-fg))", lineHeight: 1.3, whiteSpace: "pre" }}
      >{children}</pre>
    </div>
  </div>
);

// Source-code block (uses relaxed line-height - no box drawing).
export const Block = ({ label, children }: { label?: string; children: string }) => (
  <div className="rounded-xl border overflow-hidden mb-6" style={{ background: "hsl(var(--code-bg))" }}>
    {label && (
      <div className="px-4 py-2 border-b font-mono text-xs text-muted-foreground"
        style={{ borderColor: "hsl(var(--border))" }}>{label}</div>
    )}
    <pre
      className="px-5 py-4 font-mono text-xs leading-relaxed overflow-x-auto"
      style={{ color: "hsl(var(--code-fg))" }}
    >{children}</pre>
  </div>
);

// Stats row shown at the top of stage pages.
export const StageStats = ({ input, output, source, lines }: {
  input: string; output: string; source: string; lines: number;
}) => (
  <div className="grid grid-cols-3 gap-3 mb-10 text-center">
    {[
      { label: "Input",  val: input,  sub: "received from previous stage" },
      { label: "Output", val: output, sub: "passed to next stage" },
      { label: "Source", val: source, sub: `${lines} lines` },
    ].map(c => (
      <div key={c.label} className="rounded-xl border p-4" style={{ background: "hsl(var(--code-bg))" }}>
        <p className="font-mono text-[10px] text-muted-foreground mb-1">{c.label}</p>
        <p className="font-mono text-xs font-semibold" style={{ color: "hsl(var(--kw))" }}>{c.val}</p>
        <p className="font-mono text-[10px] text-muted-foreground mt-1">{c.sub}</p>
      </div>
    ))}
  </div>
);

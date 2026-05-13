import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "The Lexer",
  description: "How kemlang-py's lexer scans source text into tokens. Multi-word keywords, scanning order, and error detection.",
};

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t scroll-mt-20">{children}</h2>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-semibold text-base mt-6 mb-3">{children}</h3>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

const Diagram = ({ label, children }: { label: string; children: string }) => (
  <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
    <div className="px-4 py-2 border-b font-mono text-xs text-muted-foreground"
      style={{ borderColor: "hsl(var(--border))" }}>{label}</div>
    <div className="overflow-x-auto">
      <pre className="px-6 py-5 font-mono text-xs leading-relaxed"
        style={{ color: "hsl(var(--code-fg))" }}>{children}</pre>
    </div>
  </div>
);

const Block = ({ label, children }: { label?: string; children: string }) => (
  <div className="rounded-xl border overflow-hidden mb-6" style={{ background: "hsl(var(--code-bg))" }}>
    {label && (
      <div className="px-4 py-2 border-b font-mono text-xs text-muted-foreground"
        style={{ borderColor: "hsl(var(--border))" }}>{label}</div>
    )}
    <pre className="px-5 py-4 font-mono text-xs leading-relaxed overflow-x-auto"
      style={{ color: "hsl(var(--code-fg))" }}>{children}</pre>
  </div>
);

export default function LexerPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">How it works</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          The Lexer
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The lexer is the first stage of the pipeline. It reads raw source text one character at a time
          and produces a stream of tokens - the atoms from which the parser builds a program tree.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10 text-center">
        {[
          { label: "Input",  val: "str",          sub: "raw source text" },
          { label: "Output", val: "List[Token]",  sub: "ordered token stream" },
          { label: "Source", val: "lexer.py",     sub: "256 lines" },
        ].map(c => (
          <div key={c.label} className="rounded-xl border p-4" style={{ background: "hsl(var(--code-bg))" }}>
            <p className="font-mono text-[10px] text-muted-foreground mb-1">{c.label}</p>
            <p className="font-mono text-xs font-semibold" style={{ color: "hsl(var(--kw))" }}>{c.val}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <H2 id="what-is-a-lexer">What is a lexer?</H2>
      <P>
        A lexer (also called a scanner or tokenizer) converts a flat string of characters into a structured
        sequence of tokens. The parser cannot work directly on raw text - it needs discrete, labeled
        units it can reason about grammatically.
      </P>
      <P>
        Think of it like reading a sentence. Before you can parse &quot;the cat sat on the mat&quot; into
        subject-verb-object structure, your brain first groups the characters into words. The lexer does
        the same thing for source code.
      </P>

      <H2 id="token">What is a token?</H2>
      <P>
        A token is a small, labeled chunk of source text. In kemlang-py, every token carries four pieces
        of information:
      </P>

      <Block label="kemlang/types.py">{`@dataclass
class Token:
    type:    TokenType   # what kind of thing this is
    lexeme:  str         # the exact source text e.g. "bhai bol"
    line:    int         # 1-indexed line number in the source file
    col:     int         # 0-indexed column offset on that line
    literal: Any = None  # parsed value for strings/numbers`}</Block>

      <P>
        The <code className="font-mono text-xs">type</code> field is a <code className="font-mono text-xs">TokenType</code>
        enum member. There are 36 token types total in kemlang-py: 16 keyword types, 5 literal types,
        11 operator types, 4 delimiter types, and EOF.
      </P>

      <H2 id="scanning">How the scanning loop works</H2>
      <P>
        The lexer maintains a cursor (<code className="font-mono text-xs">self.current</code>) that advances
        through the source string. On each iteration of the main loop, it calls
        <code className="font-mono text-xs"> scan_token()</code>, which reads the character at the cursor,
        decides what kind of token starts here, and advances the cursor past it.
      </P>

      <Block label="kemlang/lexer.py - main loop">{`def tokenize(self) -> list[Token]:
    while not self.is_at_end():
        self.start = self.current   # mark start of next token
        self.scan_token()           # consume chars, emit token

    self.tokens.append(Token(TokenType.EOF, "", self.line, self.col))
    return self.tokens`}</Block>

      <P>
        <code className="font-mono text-xs">scan_token()</code> reads the current character and dispatches.
        Whitespace (space, tab, carriage return) is silently skipped. Newlines increment the line counter.
        Everything else triggers token recognition.
      </P>

      <H2 id="multiword">The multi-word keyword problem</H2>
      <P>
        Most programming languages use single-word reserved words: <code className="font-mono text-xs">if</code>,
        <code className="font-mono text-xs"> while</code>, <code className="font-mono text-xs"> print</code>.
        A character-at-a-time scanner can handle these easily: when it sees a letter, it accumulates
        an identifier, then checks if that identifier matches a keyword.
      </P>
      <P>
        kemlang-py&apos;s Gujarati keywords are phrases: <code className="font-mono text-xs">bhai bol</code>
        (print), <code className="font-mono text-xs">kem bhai</code> (program start),
        <code className="font-mono text-xs"> aavjo bhai</code> (program end),
        <code className="font-mono text-xs"> bapu tame bolo</code> (read input). The word
        <code className="font-mono text-xs"> bhai</code> alone is not a valid token - only the full phrase is.
      </P>
      <P>
        kemlang-py solves this by checking for multi-word sequences at the start of every
        <code className="font-mono text-xs"> scan_token()</code> call, before doing anything else.
        It uses Python&apos;s string <code className="font-mono text-xs">startswith()</code> to peek ahead
        without moving the cursor, then advances the cursor only if the full phrase matches.
      </P>

      <Block label="kemlang/lexer.py - multi-word keyword check">{`# In __init__: multi-word keywords listed longest-first
self.multiword_keywords = [
    ("kem bhai",       TokenType.KEM_BHAI),
    ("aavjo bhai",     TokenType.AAVJO_BHAI),
    ("bhai bol",       TokenType.BHAI_BOL),
    ("bapu tame bolo", TokenType.BAPU_TAME_BOLO),
    ("bhai chhe",      TokenType.BHAI_CHHE),
    ("bhai nathi",     TokenType.BHAI_NATHI),
    ("jya sudhi",      TokenType.JYA_SUDHI),
    ("tame jao",       TokenType.TAME_JAO),
    ("aagal vado",     TokenType.AAGAL_VADO),
    ("nahi to",        TokenType.ELSE),
]

# At scan time: try each multi-word keyword before anything else
remaining = self.source[self.current - 1:]
for phrase, token_type in self.multiword_keywords:
    if remaining.startswith(phrase):
        # advance past the full phrase
        self.current += len(phrase) - 1
        self.add_token(token_type)
        return`}</Block>

      <H2 id="scanning-trace">Step-by-step scan trace</H2>
      <P>
        Here is exactly what the lexer does when it processes this two-line program:
      </P>

      <Block label="input source">{`kem bhai
  bhai bol "kem cho!"
aavjo bhai`}</Block>

      <Diagram label="scanning trace - cursor position and tokens emitted">{`  Source (shown with cursor position ^ advancing left-to-right):

  Line 1:  k e m   b h a i \n
           ^
           try multi-word: source starts with "kem bhai"  MATCH
           emit  KEM_BHAI  'kem bhai'  1:0
           advance cursor 8 chars, skip \n, increment line

  Line 2:     b h a i   b o l   " k e m   c h o ! " \n
              ^
              skip leading spaces (positions 0-1)
              ^
              try multi-word: "bhai bol" MATCH at col 2
              emit  BHAI_BOL  'bhai bol'  2:2
              advance cursor 8 chars

              skip space (position 10)
                            ^
              character is '"' -> start string scan
              accumulate chars until closing '"'
              emit  STRING  '"kem cho!"'  2:10
              advance cursor 10 chars

  Line 3:  a a v j o   b h a i
           ^
           try multi-word: "aavjo bhai" MATCH at col 0
           emit  AAVJO_BHAI  'aavjo bhai'  3:0
           advance cursor 10 chars

  End of source -> emit  EOF  ''  4:0

  Final token stream:
  ┌──────────────┬──────────────────────┬───────┐
  │ type         │ lexeme               │ pos   │
  ├──────────────┼──────────────────────┼───────┤
  │ KEM_BHAI     │ 'kem bhai'           │ 1:0   │
  │ BHAI_BOL     │ 'bhai bol'           │ 2:2   │
  │ STRING       │ '"kem cho!"'         │ 2:10  │
  │ AAVJO_BHAI   │ 'aavjo bhai'         │ 3:0   │
  │ EOF          │ ''                   │ 4:0   │
  └──────────────┴──────────────────────┴───────┘`}
      </Diagram>

      <H2 id="all-tokens">All token types</H2>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[180px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>token type</span><span>source text / meaning</span>
        </div>
        {[
          ["Multi-word keywords", ""],
          ["KEM_BHAI",      "kem bhai - program start"],
          ["AAVJO_BHAI",   "aavjo bhai - program end"],
          ["BHAI_BOL",     "bhai bol - print statement"],
          ["BAPU_TAME_BOLO","bapu tame bolo - read input"],
          ["BHAI_CHHE",    "bhai chhe - boolean true"],
          ["BHAI_NATHI",   "bhai nathi - boolean false"],
          ["JYA_SUDHI",    "jya sudhi - while condition"],
          ["TAME_JAO",     "tame jao - break"],
          ["AAGAL_VADO",   "aagal vado - continue"],
          ["ELSE",         "nahi to - else"],
          ["Single-word keywords", ""],
          ["AA",           "aa - variable declaration"],
          ["CHE",          "che - assignment"],
          ["JO",           "jo - if"],
          ["FARVU",        "farvu - loop body"],
          ["Literals", ""],
          ["INTEGER",      "42, 0, -1  (Python int)"],
          ["FLOAT",        "3.14, 0.5  (Python float)"],
          ["STRING",       '"hello"  (Python str, double-quoted)'],
          ["BOOLEAN",      "bhai chhe / bhai nathi  (Python bool)"],
          ["IDENTIFIER",   "x, score, myVar  (variable names)"],
          ["Operators", ""],
          ["PLUS/MINUS/MULTIPLY/DIVIDE/MODULO", "+ - * / %"],
          ["EQUAL/NOT_EQUAL",  "== !="],
          ["LESS/GREATER/LESS_EQUAL/GREATER_EQUAL", "< > <= >="],
          ["Special", ""],
          ["EOF",          "end of file - always the last token"],
          ["NEWLINE",      "line break - filtered out by the parser"],
        ].map(([type, desc], i) => {
          const isHeader = desc === "";
          return (
            <div key={`${type}-${i}`}
              className={`grid grid-cols-[180px_1fr] px-5 py-2 text-xs ${isHeader ? "pt-3" : ""}`}
              style={{
                background: isHeader ? "hsl(var(--muted) / 0.3)" : "hsl(var(--code-bg))",
                borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined,
              }}>
              <span className="font-mono font-semibold"
                style={{ color: isHeader ? "hsl(var(--muted-foreground))" : "hsl(var(--kw))", fontSize: isHeader ? "0.65rem" : undefined }}>
                {isHeader ? type.toUpperCase() : type}
              </span>
              <span style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
            </div>
          );
        })}
      </div>

      <H2 id="scanning-order">Scanning priority order</H2>
      <P>
        When <code className="font-mono text-xs">scan_token()</code> starts on a new character, it checks
        candidates in this exact order. The first match wins.
      </P>

      <Diagram label="scan_token() decision order">{`  On each new character at self.current:

  1.  whitespace?          space / tab / \r         → skip, advance
  2.  newline?             \n                        → emit NEWLINE, advance line
  3.  multi-word keyword?  "bhai bol", "kem bhai"   → emit keyword token
        (10 candidates, checked with startswith())
  4.  comment?             //                        → skip to end of line
  5.  operator / punct?    + - * / % ( ) { }        → emit operator token
        single characters, looked up in a dict
  6.  two-char operator?   == != <= >= / (peek next) → emit operator token
  7.  string literal?      "                         → scan to closing "
  8.  digit?               0-9                       → scan integer or float
  9.  letter?              a-z A-Z _                 → scan identifier or keyword
        after accumulating word: check keywords dict
        if matched: emit keyword token
        if not matched: emit IDENTIFIER
  10. (nothing matched)    any other character       → raise LexerError`}</Diagram>

      <H2 id="errors">What the lexer rejects</H2>
      <P>
        The lexer raises <code className="font-mono text-xs">LexerError</code> immediately when it encounters
        something it cannot tokenize. It does not try to recover - the error carries the exact line and column.
      </P>

      <div className="space-y-3 mb-8">
        {[
          {
            case: "Unexpected character",
            example: 'bhai bol x?2',
            reason: 'The ? character is not part of any token type in kemlang-py.',
          },
          {
            case: "Unterminated string",
            example: 'bhai bol "hello',
            reason: 'The lexer scans for a closing " on the same line. If end-of-line arrives first, it raises LexerError. Multi-line strings are not supported.',
          },
          {
            case: "Invalid number",
            example: '3.14.15',
            reason: 'Numbers may contain at most one decimal point. The second . is not a digit and not the end of the number, so the lexer raises LexerError.',
          },
        ].map(({ case: c, example, reason }) => (
          <div key={c} className="rounded-xl border p-4 bg-muted/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded text-red-400"
                style={{ background: "hsl(0 62% 12% / 0.5)" }}>{c}</span>
              <code className="font-mono text-xs" style={{ color: "hsl(var(--kw))" }}>{example}</code>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
          </div>
        ))}
      </div>

      <H2 id="why-hand-written">Why hand-written over regex?</H2>
      <P>
        Many lexers use regular expressions to match token patterns. kemlang-py uses a hand-written
        scanner for three reasons:
      </P>
      <div className="space-y-3 mb-8">
        {[
          ["Better error messages", "A hand-written scanner knows exactly where it is in the source at all times. It can report the precise line and column of every error, not just a regex match failure."],
          ["Multi-word keyword support", "Regex-based lexers split on word boundaries before checking for keywords. Matching 'bhai bol' as a two-word unit requires either a preprocessing step or a more complex tokenizer design. The hand-written approach handles it naturally with startswith()."],
          ["Full control over scanning", "The scanner can implement context-sensitive behavior (like how string scanning differs from identifier scanning) without complex regex lookahead."],
        ].map(([title, desc]) => (
          <div key={title as string} className="flex gap-3 items-start rounded-xl border p-4 bg-muted/10">
            <span className="text-primary shrink-0 mt-0.5">›</span>
            <div>
              <p className="font-medium text-sm mb-1">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Overview
        </Link>
        <Link href="/docs/how-it-works/parser" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
          The Parser <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

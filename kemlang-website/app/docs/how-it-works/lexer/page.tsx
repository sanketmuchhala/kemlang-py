import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2, H3, P, Diagram, Block, StageStats } from "@/components/hiw";

export const metadata: Metadata = {
  title: "The Lexer",
  description: "How kemlang-py's lexer scans source text into tokens. Multi-word keywords, scanning order, and error detection.",
};

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

      <StageStats input="str" output="List[Token]" source="lexer.py" lines={256} />

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

      <H2 id="multiword">The multi-word keyword problem</H2>
      <P>
        Most programming languages use single-word reserved words: <code className="font-mono text-xs">if</code>,
        <code className="font-mono text-xs"> while</code>, <code className="font-mono text-xs"> print</code>.
        kemlang-py&apos;s Gujarati keywords are phrases: <code className="font-mono text-xs">bhai bol</code>
        (print), <code className="font-mono text-xs">aavjo bhai</code> (program end),
        <code className="font-mono text-xs"> bapu tame bolo</code> (read input).
        The word <code className="font-mono text-xs">bhai</code> alone is not a valid token - only the full phrase is.
      </P>
      <P>
        kemlang-py solves this by checking for multi-word sequences at the start of every
        <code className="font-mono text-xs"> scan_token()</code> call, before doing anything else,
        using Python&apos;s string <code className="font-mono text-xs">startswith()</code> to peek ahead.
      </P>

      <Block label="kemlang/lexer.py - multi-word keyword detection">{`self.multiword_keywords = [
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

# At scan time: check multi-word before anything else
remaining = self.source[self.current - 1:]
for phrase, token_type in self.multiword_keywords:
    if remaining.startswith(phrase):
        self.current += len(phrase) - 1   # advance past full phrase
        self.add_token(token_type)
        return`}</Block>

      <H2 id="scanning-trace">Step-by-step scan trace</H2>

      <Block label="input source">{`kem bhai
  bhai bol "kem cho!"
aavjo bhai`}</Block>

      <Diagram label="scanning trace - cursor advances left-to-right through source">{`
  Line 1:  k e m   b h a i
           ^
           remaining starts with "kem bhai"  -> MATCH
           emit  KEM_BHAI   lexeme='kem bhai'   1:0
           advance 8 chars, hit \n, increment line counter

  Line 2:     b h a i   b o l   " k e m   c h o ! "
           ^
           skip 2 leading spaces
              ^
              remaining starts with "bhai bol"  -> MATCH
              emit  BHAI_BOL  lexeme='bhai bol'  2:2
              advance 8 chars

              skip 1 space
                         ^
                         char is '"'  -> start string scan
                         advance until closing '"' found
                         emit  STRING  lexeme='"kem cho!"'  2:10
                         advance 10 chars

  Line 3:  a a v j o   b h a i
           ^
           remaining starts with "aavjo bhai"  -> MATCH
           emit  AAVJO_BHAI  lexeme='aavjo bhai'  3:0
           advance 10 chars

  End of source:
           emit  EOF  lexeme=''  4:0

  Final stream:
  ┌──────────────┬──────────────────────┬───────┐
  │ type         │ lexeme               │ pos   │
  ├──────────────┼──────────────────────┼───────┤
  │ KEM_BHAI     │ 'kem bhai'           │ 1:0   │
  │ BHAI_BOL     │ 'bhai bol'           │ 2:2   │
  │ STRING       │ '"kem cho!"'         │ 2:10  │
  │ AAVJO_BHAI   │ 'aavjo bhai'         │ 3:0   │
  │ EOF          │ ''                   │ 4:0   │
  └──────────────┴──────────────────────┴───────┘`}</Diagram>

      <H2 id="scanning-order">Scanning priority</H2>
      <Diagram label="scan_token() decision order - first match wins">{`
  On each new character:

  1.  whitespace     space / tab / \r           skip, advance
  2.  newline        \n                          emit NEWLINE, next line
  3.  multi-word kw  "bhai bol", "kem bhai"...  emit keyword token
  4.  comment        //                          skip to end of line
  5.  operator       + - * / % ( ) { }          emit operator token
  6.  two-char op    == != <= >=  (peek next)    emit operator token
  7.  string         "                           scan to closing "
  8.  digit          0-9                         scan integer or float
  9.  letter         a-z A-Z _                   scan word, check keywords
                                                 -> keyword token or IDENTIFIER
  10. (no match)     any other character         raise LexerError`}</Diagram>

      <H2 id="all-tokens">All token types</H2>
      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[180px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>token type</span><span>source text / meaning</span>
        </div>
        {[
          ["Multi-word keywords", ""],
          ["KEM_BHAI",      "kem bhai - program start"],
          ["AAVJO_BHAI",    "aavjo bhai - program end"],
          ["BHAI_BOL",      "bhai bol - print statement"],
          ["BAPU_TAME_BOLO","bapu tame bolo - read input"],
          ["BHAI_CHHE",     "bhai chhe - boolean true"],
          ["BHAI_NATHI",    "bhai nathi - boolean false"],
          ["JYA_SUDHI",     "jya sudhi - while condition"],
          ["TAME_JAO",      "tame jao - break"],
          ["AAGAL_VADO",    "aagal vado - continue"],
          ["ELSE",          "nahi to - else branch"],
          ["Single-word keywords", ""],
          ["AA",            "aa - variable declaration"],
          ["CHE",           "che - assignment"],
          ["JO",            "jo - if"],
          ["FARVU",         "farvu - loop body"],
          ["Literals", ""],
          ["INTEGER",       "42, 0, -1  (Python int)"],
          ["FLOAT",         "3.14, 0.5  (Python float)"],
          ["STRING",        '"hello"  (double-quoted, single-line)'],
          ["BOOLEAN",       "bhai chhe / bhai nathi"],
          ["IDENTIFIER",    "x, score, myVar  (variable names)"],
          ["Operators / delimiters", ""],
          ["PLUS/MINUS/MULTIPLY/DIVIDE/MODULO", "+ - * / %"],
          ["EQUAL / NOT_EQUAL", "== !="],
          ["LESS / GREATER / LESS_EQUAL / GREATER_EQUAL", "< > <= >="],
          ["LEFT_BRACE / RIGHT_BRACE", "{ }"],
          ["Special", ""],
          ["EOF",           "end of file - always the last token emitted"],
          ["NEWLINE",       "line break - filtered out by the parser"],
        ].map(([type, desc], i) => {
          const isHeader = desc === "";
          return (
            <div key={`${type}-${i}`}
              className="grid grid-cols-[180px_1fr] px-5 py-2 text-xs"
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

      <H2 id="errors">What the lexer rejects</H2>
      <div className="space-y-3 mb-8">
        {[
          { case: "Unexpected character", example: "bhai bol x?2", reason: "? is not part of any token type. LexerError raised immediately at the bad position." },
          { case: "Unterminated string", example: 'bhai bol "hello', reason: "The lexer scans for a closing \" on the same line. End-of-line before the closing quote raises LexerError." },
          { case: "Invalid number",      example: "3.14.15",        reason: "Numbers may have at most one decimal point. The second . raises LexerError." },
        ].map(({ case: c, example, reason }) => (
          <div key={c} className="rounded-xl border p-4 bg-muted/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded text-red-400" style={{ background: "hsl(0 62% 12% / 0.5)" }}>{c}</span>
              <code className="font-mono text-xs" style={{ color: "hsl(var(--kw))" }}>{example}</code>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
          </div>
        ))}
      </div>

      <H2 id="why-hand-written">Why hand-written over regex?</H2>
      <div className="space-y-3 mb-8">
        {[
          ["Better error messages", "A hand-written scanner knows exactly where it is in the source at all times. It can report the precise line and column of every error."],
          ["Multi-word keyword support", "Regex-based lexers split on word boundaries before checking for keywords. Matching 'bhai bol' as a two-word unit is much simpler with startswith()."],
          ["Full control over scanning", "The scanner can implement context-sensitive behavior (string scanning differs from identifier scanning) without complex regex lookahead."],
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

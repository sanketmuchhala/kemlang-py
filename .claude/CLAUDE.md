# KemLang — Claude Code Guide

KemLang is a Gujarati-flavored programming language interpreter written in Python. Programs use Gujarati keywords (`kem bhai`, `bhai bol`, `jo`, `farvu`) with English-style syntax and file extension `.jsk`.

---

## Repo Layout

```
kemlang/          Core interpreter package
  lexer.py        Tokenizer — source text → token stream
  parser.py       Parser — token stream → AST
  interpreter.py  Tree-walking interpreter — executes AST
  types.py        Token types (TokenType enum) + AST node dataclasses
  errors.py       Exception classes + diagnostic renderer
  fmt.py          Code formatter
  cli.py          Typer CLI (kem run / repl / fmt / tokens / ast / version)
  version.py      Version string

tests/            Pytest test suite
  test_cli.py     CLI command tests (via typer.testing.CliRunner)
  test_exec.py    Interpreter execution tests
  test_lexer.py   Lexer token tests
  test_parser.py  Parser AST tests
  test_fmt.py     Formatter tests
  test_prop_fuzz.py  Hypothesis property tests (marked @pytest.mark.slow)

docs/
  STATUS.md       Project status — what's done, what's broken, what to build next
  language_design_suggestions.md  Design rationale for future features
  test.md         Test results for documented syntax snippets
  fixing.md       Original bug fix plan (historical)

examples/
  hello.jsk       Hello world with input
  loop_and_if.jsk Loop + conditional example
  errors.jsk      Example that should fail (division by zero)

npm-package/      Node.js wrapper that pip-installs kemlang-py
.github/workflows/
  ci.yml          Lint → Test → Build → Integration test
  publish.yml     Publish to npm, PyPI, Docker (on release or workflow_dispatch)
```

---

## Language Pipeline

```
Source (.jsk)
  → Lexer (lexer.py)       → List[Token]
  → Parser (parser.py)     → Program (AST)
  → Interpreter (interpreter.py) → output / exit code
```

- **Lexer**: scans multi-word keywords first (e.g. `kem bhai`), then single-word keywords, then identifiers, literals, operators.
- **Parser**: recursive-descent, produces dataclass nodes from `types.py` (`Print`, `Declaration`, `If`, `While`, `Binary`, etc.).
- **Interpreter**: tree-walker with an `Environment` dict for variable scoping. `BreakError`/`ContinueError` are exceptions used for control flow.

---

## Dev Setup

```bash
pip install -e ".[dev,test]"   # install with dev + test deps
kem run examples/hello.jsk     # run a file
kem repl                        # interactive REPL
```

---

## Running Tests

```bash
pytest -m "not slow"           # fast suite (CI mode, ~30s)
pytest                         # full suite including fuzz tests (~3-5 min)
pytest -m slow                 # only hypothesis/fuzz tests
pytest tests/test_exec.py      # single file
```

Fuzz tests in `test_prop_fuzz.py` are excluded from CI with `-m "not slow"` to keep runs under 5 minutes.

---

## Code Quality

All changes must pass:

```bash
ruff check kemlang tests       # lint
ruff format --check kemlang tests  # format check
mypy kemlang                   # type check
```

Auto-fix before committing:

```bash
ruff check --fix kemlang tests
ruff format kemlang tests
```

`interpreter.py` and `parser.py` are excluded from mypy strictness (see `mypy.ini`) — they require significant annotation work to type fully.

---

## Publishing

Triggered via GitHub Actions `publish.yml`:
- **Manual**: Actions → Publish Packages → Run workflow
- **Automatic**: on GitHub release published

Requires secrets: `NPM_TOKEN`, `PYPI_TOKEN`, `GITHUB_TOKEN` (built-in).

Package name is `kemlang-py` on both npm and PyPI. Version lives in two places — keep in sync before publishing:
- `kemlang/version.py` — Python package version
- `npm-package/package.json` — npm package version

---

## Adding a Language Feature

The typical pattern for adding a new keyword/statement:

1. **`types.py`** — add `TokenType` value(s) and a new AST node dataclass
2. **`lexer.py`** — add keyword to `self.keywords` dict (or `self.multi_word_keywords` for multi-word)
3. **`parser.py`** — add a parsing method and call it from `parse_statement()`
4. **`interpreter.py`** — add an `execute_*` or `evaluate_*` method and dispatch in `execute()`/`evaluate()`
5. **`tests/test_exec.py`** — add execution tests
6. **`tests/test_lexer.py`** and **`tests/test_parser.py`** — add unit tests
7. **`docs/STATUS.md`** — update "Features To Build" section

See `docs/STATUS.md` for the prioritized list of planned features (functions, `=` operator, while condition-first, string interpolation, arrays/maps).

---

## Key Conventions

- File extension: `.jsk`
- Every program wrapped in `kem bhai` ... `aavjo bhai`
- `KemValue = int | float | str | bool | None` (runtime type in `types.py`)
- `+` coerces to string if either operand is a string
- `bhai chhe` = `true`, `bhai nathi` = `false` (also aliased as `true`/`false`)
- `bapu tame bolo` = read input from stdin

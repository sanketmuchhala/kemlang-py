# KemLang Project Status

Single source of truth for what's done, what's broken, and what needs to be built.

---

## Packages

| Registry | Package | Version | Install |
|----------|---------|---------|---------|
| npm | [kemlang-py](https://www.npmjs.com/package/kemlang-py) | 0.1.3 | `npm install -g kemlang-py` |
| PyPI | [kemlang-py](https://pypi.org/project/kemlang-py/) | 0.1.3 | `pip install kemlang-py` |
| Docker | ghcr.io/sanketmuchhala/kemlang-py | latest | `docker pull ghcr.io/sanketmuchhala/kemlang-py` |

---

## CI/CD

| Job | Status |
|-----|--------|
| Lint (ruff + mypy) | ✅ Passing |
| Tests (3.10 / 3.11 / 3.12) | ✅ Passing (`-m "not slow"`) |
| Build | ✅ Passing |
| Integration test | ✅ Passing |
| Publish (npm + PyPI + Docker) | ✅ On release or `workflow_dispatch` |

Fuzz tests (`test_prop_fuzz.py`) are marked `@pytest.mark.slow` and excluded from CI to keep runs under 5 minutes. Run them locally with `pytest` or `pytest -m slow`.

---

## Bug Fixes — All Resolved ✅

| # | Bug | Fix location |
|---|-----|-------------|
| 1 | `BreakError`/`ContinueError` import mismatch → full crash | `kemlang/errors.py` |
| 2 | `//` comments threw `Unexpected character '/'` | `kemlang/lexer.py` `scan_token` |
| 3 | `true`/`false` threw `Undefined variable` | `kemlang/lexer.py` keywords dict |
| 4 | Single-quote strings threw `Unexpected character '''` | `kemlang/lexer.py` `scan_token` |
| 5 | Decimal literals (`3.14`) threw `Unexpected character '.'` | `kemlang/lexer.py` + `kemlang/types.py` |
| 6 | `"Sum: " + sum` (str + int) crashed with TypeError | `kemlang/interpreter.py` `evaluate_binary` |

---

## Features To Build

Ordered roughly by impact. See `docs/language_design_suggestions.md` for full rationale.

### 1. Functions — `kaam` / `aapo`

```jsk
kaam calculate_sum(a, b) {
    aapo a + b
}

aa result che calculate_sum(5, 10)
```

- `kaam` = `function` / `def`
- `aapo` = `return`
- Needs: lexer keywords, parser `FunctionDef` + `Call` nodes, interpreter scope/closure handling

---

### 2. `=` Assignment Operator

```jsk
aa naam = "Sanket"   // declaration
naam = "Rahul"       // re-assignment
```

Currently `che` is used for both declaration and assignment. `=` is more familiar to newcomers.

- Needs: `EQUALS` token in `kemlang/types.py`, parser assignment rule update

---

### 3. `while` Condition-First Syntax

```jsk
jya sudhi (condition) {
    // code
}
```

Current syntax is do-while style (`farvu { } jya sudhi condition`). `jya sudhi` already exists in the lexer.

- Needs: parser rule reorder only

---

### 4. String Interpolation

```jsk
bhai bol f"kem cho, {naam}!"
```

Currently requires concatenation. F-string style is cleaner.

- Needs: lexer f-string token, parser interpolation node, interpreter evaluation

---

### 5. Arrays and Maps

```jsk
aa nums che [1, 2, 3]
aa person che {"name": "Sanket", "age": 25}
```

- Needs: `[` `]` tokens (single_chars may already have them), parser list/dict nodes, interpreter collection type

---

### 6. Consistent I/O — `bhai sambhal`

```jsk
bhai bol "Output"          // print (works)
aa input che bhai sambhal  // input (new alias for bapu tame bolo)
```

- Needs: `bhai sambhal` multi-word keyword, keep `bapu tame bolo` as alias

---

## Language Design Principles

1. **Gujarati for keywords** — control flow, declarations, directives.
2. **Universal math/symbols** — operators (`=`, `+`, `-`, `*`, `/`, `%`), comparators (`==`, `<`, `>`), collection delimiters (`[ ]`, `{ }`).
3. **Left-to-right readability** — conditions before blocks (`if`, `while`).

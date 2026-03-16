# KemLang v0.1.0 -- First Public Alpha

KemLang is a Gujarati-flavored, English-typed programming language. It lets developers write code using Gujarati keywords (`bhai bol`, `jo`, `farvu`) while keeping standard symbols and operators. Built as a tree-walking interpreter in Python.

## Highlights

- **Full interpreter pipeline**: Lexer, recursive-descent parser, and tree-walking interpreter
- **Gujarati keywords**: `kem bhai` / `aavjo bhai` (program start/end), `bhai bol` (print), `bapu tame bolo` (input), `aa` / `che` (variable declaration/assignment), `jo` / `nahi to` (if/else), `farvu...jya sudhi` (while loop), `tame jao` / `aagal vado` (break/continue)
- **Data types**: Integers, floats, strings (single and double quoted), booleans (`bhai chhe` / `bhai nathi`)
- **Operators**: Arithmetic (`+`, `-`, `*`, `/`, `%`), comparison (`==`, `!=`, `<`, `>`, `<=`, `>=`), unary negation, string concatenation
- **Comments**: Single-line with `//`
- **CLI tooling**: Run files, interactive REPL, token inspection, AST visualization, code formatter (`kem fmt`), version info
- **Rich error messages**: Source context with line/column tracking and diagnostic carets
- **VS Code extension**: Syntax highlighting for `.jsk` files
- **Web playground**: Interactive browser-based editor at kemlang.dev
- **Comprehensive test suite**: 1,600+ lines covering lexer, parser, execution, formatting, CLI, and property-based fuzz testing

## Installation

```bash
# PyPI
pip install kemlang

# NPM
npx kemlang

# Docker
docker pull kemlang
```

## Quick Example

```
kem bhai
aa naam che bapu tame bolo
bhai bol "kem cho, " + naam + "!"
aavjo bhai
```

## Known Limitations

- No user-defined functions (planned)
- No arrays or objects (planned)
- No string interpolation (planned)
- No standard library yet

## What's Next

- Functions (`kaam` keyword with `aapo` for return)
- Arrays and objects
- String interpolation
- Standard library (math, string, file operations)
- Language Server Protocol (LSP) support

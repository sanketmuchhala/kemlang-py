# kemlang-py

**A Gujarati-flavored programming language — install it like Bhailang.**

[![npm](https://img.shields.io/npm/v/kemlang-py.svg)](https://www.npmjs.com/package/kemlang-py)
[![PyPI](https://img.shields.io/pypi/v/kemlang-py.svg)](https://pypi.org/project/kemlang-py/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/sanketmuchhala/Gujju.py/blob/main/LICENSE)

---

## Install

```bash
npm install -g kemlang-py
```

Requires Node.js 14+ and Python 3.10+. The installer automatically detects Python and installs the KemLang interpreter via pip.

---

## After Installing

You get the `kem` command globally:

```bash
# Verify installation
kem version

# Start the interactive REPL
kem repl

# Run a .jsk file
kem run hello.jsk

# Run with token + AST trace
kem run hello.jsk --trace

# Format a file in-place
kem fmt hello.jsk

# Check formatting without modifying
kem fmt --check .

# Show token stream
kem tokens hello.jsk

# Show abstract syntax tree
kem ast hello.jsk
```

---

## Quick Start

Create `hello.jsk`:

```
kem bhai
    bhai bol "kem cho, duniya!"
aavjo bhai
```

Run it:

```bash
kem run hello.jsk
# Output: kem cho, duniya!
```

---

## Language Basics

Every KemLang program is wrapped in `kem bhai` ... `aavjo bhai`.

```
kem bhai
    // Variables
    aa naam che "Sanket"
    aa age che 25
    aa pi che 3.14

    // Print
    bhai bol "Hello, " + naam + "!"

    // Conditionals
    jo age >= 18 {
        bhai bol "adult"
    } nahi to {
        bhai bol "minor"
    }

    // Loop
    aa i che 1
    farvu {
        bhai bol i
        i che i + 1
        jo i > 3 { tame jao }
    } jya sudhi bhai chhe

    // Input
    aa input che bapu tame bolo
    bhai bol "You said: " + input
aavjo bhai
```

### Keywords

| Keyword | Meaning |
|---------|---------|
| `kem bhai` | Program start |
| `aavjo bhai` | Program end |
| `aa <name> che <value>` | Declare variable |
| `<name> che <value>` | Re-assign variable |
| `bhai bol <expr>` | Print |
| `bapu tame bolo` | Read input |
| `jo` | if |
| `nahi to` | else |
| `farvu { } jya sudhi <cond>` | while loop |
| `tame jao` | break |
| `aagal vado` | continue |
| `bhai chhe` | true |
| `bhai nathi` | false |

---

## How It Works

This npm package is a thin wrapper that:

1. Detects Python 3.10+ on your system
2. Installs `kemlang-py` via pip
3. Wraps the `kem` Python CLI so it's accessible from your terminal globally

---

## Troubleshooting

**`kem: command not found`**
```bash
# Verify Python is installed
python3 --version   # needs 3.10+

# Reinstall
npm uninstall -g kemlang-py && npm install -g kemlang-py
```

**Python not found**
```bash
# macOS
brew install python@3.11

# Ubuntu/Debian
sudo apt update && sudo apt install python3.11 python3-pip

# Windows — download from https://www.python.org/downloads/
```

**Permission errors on macOS/Linux**
```bash
sudo npm install -g kemlang-py
```

---

## Also Available on PyPI

If you prefer installing directly with pip:

```bash
pip install kemlang-py
```

---

## Links

- **GitHub**: [github.com/sanketmuchhala/Gujju.py](https://github.com/sanketmuchhala/Gujju.py)
- **PyPI**: [pypi.org/project/kemlang-py](https://pypi.org/project/kemlang-py/)
- **Website & Playground**: [gujju-py.vercel.app](https://gujju-py.vercel.app)
- **Issues**: [github.com/sanketmuchhala/Gujju.py/issues](https://github.com/sanketmuchhala/Gujju.py/issues)

---

MIT License

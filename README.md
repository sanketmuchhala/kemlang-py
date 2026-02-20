# KemLang

**A Gujarati-flavored, English-typed programming language**

KemLang is a fun, educational programming language inspired by Bhailang, featuring Gujarati keywords and expressions while maintaining English-based syntax. It's designed to be approachable for Gujarati speakers learning programming concepts.

[![CI](https://github.com/sanketmuchhala/Gujju.py/actions/workflows/ci.yml/badge.svg)](https://github.com/sanketmuchhala/Gujju.py/actions/workflows/ci.yml)
[![Python](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Website](https://img.shields.io/badge/website-kemlang.dev-blue.svg)](https://kemlang.dev)

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Data Flow](#data-flow)
- [Deployment Architecture](#deployment-architecture)
- [Features](#features)
- [Quick Start](#quick-start)
- [Language Reference](#language-reference)
- [CLI Usage](#cli-usage)
- [Examples](#examples)
- [Development](#development)

---

## System Architecture

KemLang follows a modular architecture with clear separation of concerns across different layers:

```mermaid
graph TB
    subgraph "User Interface Layer"
        CLI[CLI Tool]
        Web[Web Playground]
        VSCode[VS Code Extension]
        Website[Documentation Website]
    end

    subgraph "Core Language Engine"
        Parser[Parser Engine]
        Lexer[Lexical Analyzer]
        AST[AST Generator]
        Interpreter[Interpreter Engine]
    end

    subgraph "Development Tools"
        Formatter[Code Formatter]
        Debugger[Debug Tools]
        REPL[Interactive REPL]
    end

    subgraph "Distribution"
        PyPI[Python Package]
        NPM[Node Package]
        Docker[Docker Images]
    end

    subgraph "Cloud Platform"
        Vercel[Vercel Hosting]
        GitHub[GitHub Actions]
    end

    %% Connections
    CLI --> Parser
    Web --> Parser
    VSCode --> Parser

    Parser --> Lexer
    Lexer --> AST
    AST --> Interpreter

    CLI --> Formatter
    CLI --> Debugger
    CLI --> REPL

    Parser --> PyPI
    Web --> NPM

    Website --> Vercel
    GitHub --> Vercel

    %% Styling
    classDef userInterface fill:#e1f5fe,stroke:#0277bd,stroke-width:3px,color:#000
    classDef coreEngine fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#000
    classDef devTools fill:#e8f5e8,stroke:#388e3c,stroke-width:3px,color:#000
    classDef distribution fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    classDef cloud fill:#fce4ec,stroke:#c2185b,stroke-width:3px,color:#000

    class CLI,Web,VSCode,Website userInterface
    class Parser,Lexer,AST,Interpreter coreEngine
    class Formatter,Debugger,REPL devTools
    class PyPI,NPM,Docker distribution
    class Vercel,GitHub cloud
```

### Component Overview

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Lexical Analyzer** | Tokenizes KemLang source code | Python |
| **Parser Engine** | Generates Abstract Syntax Trees | Recursive Descent Parser |
| **Interpreter** | Executes parsed KemLang programs | Tree-walking Interpreter |
| **CLI Tool** | Command-line interface | Python + Typer |
| **Web Playground** | Browser-based code editor | Next.js + TypeScript |
| **VS Code Extension** | Syntax highlighting & IntelliSense | TypeScript |

---

## Data Flow

The following diagram illustrates how KemLang code flows through the system from source to execution:

```mermaid
flowchart TD
    subgraph "Input Sources"
        File[".jsk Files"]
        REPL_Input[REPL Input]
        Web_Editor[Web Editor]
    end

    subgraph "Lexical Analysis"
        Tokenizer[Tokenizer]
        TokenStream[Token Stream]
    end

    subgraph "Syntax Analysis"
        SyntaxParser[Syntax Parser]
        ASTBuilder[AST Builder]
        SyntaxTree[Abstract Syntax Tree]
    end

    subgraph "Semantic Analysis"
        TypeChecker[Type Checker]
        ScopeAnalyzer[Scope Analyzer]
        ErrorReporter[Error Reporter]
    end

    subgraph "Execution Engine"
        TreeWalker[Tree Walker]
        RuntimeEnv[Runtime Environment]
        BuiltinFunctions[Built-in Functions]
    end

    subgraph "Output Channels"
        Console[Console Output]
        WebOutput[Web Playground Output]
        ErrorOutput[Error Messages]
        DebugInfo[Debug Information]
    end

    %% Data Flow
    File --> Tokenizer
    REPL_Input --> Tokenizer
    Web_Editor --> Tokenizer

    Tokenizer --> TokenStream
    TokenStream --> SyntaxParser

    SyntaxParser --> ASTBuilder
    ASTBuilder --> SyntaxTree

    SyntaxTree --> TypeChecker
    TypeChecker --> ScopeAnalyzer
    ScopeAnalyzer --> ErrorReporter

    SyntaxTree --> TreeWalker
    TreeWalker --> RuntimeEnv
    RuntimeEnv --> BuiltinFunctions

    TreeWalker --> Console
    TreeWalker --> WebOutput
    ErrorReporter --> ErrorOutput
    TreeWalker --> DebugInfo

    %% Error handling flows
    Tokenizer -.->|Lexical Errors| ErrorOutput
    SyntaxParser -.->|Parse Errors| ErrorOutput
    TreeWalker -.->|Runtime Errors| ErrorOutput

    %% Styling
    classDef input fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    classDef lexical fill:#f1f8e9,stroke:#689f38,stroke-width:3px,color:#000
    classDef syntax fill:#fce4ec,stroke:#ad1457,stroke-width:3px,color:#000
    classDef semantic fill:#fff3e0,stroke:#ef6c00,stroke-width:3px,color:#000
    classDef execution fill:#e8eaf6,stroke:#5e35b1,stroke-width:3px,color:#000
    classDef output fill:#e0f2f1,stroke:#00695c,stroke-width:3px,color:#000

    class File,REPL_Input,Web_Editor input
    class Tokenizer,TokenStream lexical
    class SyntaxParser,ASTBuilder,SyntaxTree syntax
    class TypeChecker,ScopeAnalyzer,ErrorReporter semantic
    class TreeWalker,RuntimeEnv,BuiltinFunctions execution
    class Console,WebOutput,ErrorOutput,DebugInfo output
```

### Processing Pipeline

1. **Source Input**: KemLang code from files, REPL, or web editor
2. **Tokenization**: Breaking source code into meaningful tokens
3. **Parsing**: Building an Abstract Syntax Tree (AST)
4. **Analysis**: Type checking and scope validation
5. **Execution**: Tree-walking interpretation with runtime environment
6. **Output**: Results, errors, or debug information

---

## Deployment Architecture

KemLang uses a modern cloud-native deployment strategy across multiple platforms:

```mermaid
graph TB
    subgraph "Developer Workflow"
        DevLocal[Local Development]
        DevCommit[Git Commit]
        DevPR[Pull Request]
    end

    subgraph "CI/CD Pipeline"
        GitHub_Actions[GitHub Actions]
        Tests[Automated Tests]
        Build[Build Artifacts]
        Security[Security Scan]
    end

    subgraph "Package Repositories"
        PyPI_Deploy[PyPI Package]
        NPM_Deploy[NPM Package]
        Docker_Hub[Docker Hub]
    end

    subgraph "Hosting Infrastructure"
        Vercel_Main[Vercel Production]
        Vercel_Preview[Vercel Preview]
        CDN[Global CDN]
    end

    subgraph "User Access Points"
        Website_Users[Website Users]
        CLI_Users[CLI Users]
        VS_Code_Users[VS Code Users]
        Docker_Users[Docker Users]
    end

    subgraph "Monitoring & Analytics"
        Vercel_Analytics[Vercel Analytics]
        GitHub_Insights[GitHub Insights]
        Error_Tracking[Error Tracking]
    end

    %% Workflow
    DevLocal --> DevCommit
    DevCommit --> GitHub_Actions
    DevPR --> GitHub_Actions

    GitHub_Actions --> Tests
    Tests --> Build
    Build --> Security

    Security --> PyPI_Deploy
    Security --> NPM_Deploy
    Security --> Docker_Hub

    Build --> Vercel_Main
    DevPR --> Vercel_Preview

    Vercel_Main --> CDN

    %% User connections
    Website_Users --> CDN
    CLI_Users --> PyPI_Deploy
    VS_Code_Users --> NPM_Deploy
    Docker_Users --> Docker_Hub

    %% Monitoring
    Vercel_Main --> Vercel_Analytics
    GitHub_Actions --> GitHub_Insights
    Vercel_Main --> Error_Tracking

    %% Styling
    classDef developer fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px,color:#000
    classDef cicd fill:#e3f2fd,stroke:#1565c0,stroke-width:3px,color:#000
    classDef packages fill:#fff3e0,stroke:#ef6c00,stroke-width:3px,color:#000
    classDef hosting fill:#fce4ec,stroke:#c2185b,stroke-width:3px,color:#000
    classDef users fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#000
    classDef monitoring fill:#e0f2f1,stroke:#00695c,stroke-width:3px,color:#000

    class DevLocal,DevCommit,DevPR developer
    class GitHub_Actions,Tests,Build,Security cicd
    class PyPI_Deploy,NPM_Deploy,Docker_Hub packages
    class Vercel_Main,Vercel_Preview,CDN hosting
    class Website_Users,CLI_Users,VS_Code_Users,Docker_Users users
    class Vercel_Analytics,GitHub_Insights,Error_Tracking monitoring
```

### Deployment Environments

| Environment | Platform | Purpose | URL |
|-------------|----------|---------|-----|
| **Production** | Vercel | Main website & playground | https://gujju-py.vercel.app/ |
| **Preview** | Vercel | PR previews | Auto-generated URLs |
| **CLI Package** | PyPI | Python package distribution | `pip install kemlang` |
| **Web Assets** | NPM | JavaScript/TypeScript modules | `npm install kemlang` |

---

## Features

- **Gujarati-flavored keywords**: `kem bhai`, `bhai bol`, `bapu tame bolo`
- **English-typed syntax**: Easy to type on any keyboard
- **Simple grammar**: Variables, conditionals, loops, and expressions
- **Rich error messages**: Line/column tracking with diagnostic snippets
- **CLI tools**: Run, format, debug, and analyze KemLang code
- **VS Code support**: Syntax highlighting extension included
- **Web playground**: Interactive browser-based code editor
- **Comprehensive docs**: Full documentation at [https://gujju-py.vercel.app/]([https://kemlang.dev](https://gujju-py.vercel.app/docs))

---

## Quick Start

### Installation

#### **NPM (Recommended - Like Bhailang)**
```bash
npm install -g kemlang
```

#### **One-liner Install Script**
```bash
curl -fsSL https://raw.githubusercontent.com/sanketmuchhala/Gujju.py/main/install.sh | bash
```

#### **Python/Pip (Direct)**
```bash
# From PyPI (when available)
pip install kemlang

# From source
git clone https://github.com/sanketmuchhala/Gujju.py
cd kemlang
pip install -e .
```

#### **Developer Setup**
```bash
git clone https://github.com/sanketmuchhala/Gujju.py
cd kemlang
pip install -e ".[dev,test]"
```

### Hello World

Create a file `hello.jsk`:

```kemlang
kem bhai
aa naam che bapu tame bolo
bhai bol "kem cho, " + naam + "!"
aavjo bhai
```

Run it:

```bash
kem run hello.jsk
# Input: Sanket
# Output: kem cho, Sanket!
```

---

## Language Reference

### Program Structure

Every KemLang program must be enclosed in `kem bhai` ... `aavjo bhai`:

```kemlang
kem bhai
  // Your code here
aavjo bhai
```

### Statements

| Statement | Syntax | Description |
|-----------|---------|-------------|
| **Print** | `bhai bol <expr>` | Print expression to stdout |
| **Declare** | `aa <id> che <expr>` | Declare new variable |
| **Assign** | `<id> che <expr>` | Assign to existing variable |
| **If** | `jo <expr> { ... }` | Conditional execution |
| **If-Else** | `jo <expr> { ... } nahi to { ... }` | Conditional with alternative |
| **While** | `farvu { ... } jya sudhi <expr>` | Loop while condition is truthy |
| **Break** | `tame jao` | Exit current loop |
| **Continue** | `aagal vado` | Skip to next loop iteration |

### Expressions

| Type | Syntax | Example |
|------|---------|---------|
| **Integers** | `42`, `0`, `-5` | Numbers |
| **Strings** | `"hello"`, `"kem cho"` | Text with escapes (`\n`, `\t`, `\"`, `\\`) |
| **Booleans** | `bhai chhe`, `bhai nathi` | true, false |
| **Input** | `bapu tame bolo` | Read line from stdin |
| **Variables** | `naam`, `count` | Identifier references |

### Operators

| Category | Operators | Precedence |
|----------|-----------|------------|
| **Arithmetic** | `+`, `-`, `*`, `/`, `%` | `* / %` > `+ -` |
| **Comparison** | `==`, `!=`, `<`, `>`, `<=`, `>=` | Lower than arithmetic |
| **Unary** | `-` (negation) | Highest |

**Note**: String concatenation uses `+` operator (string + string only).

### Language Grammar (EBNF)

```ebnf
program      := start_fence stmt* end_fence
start_fence  := "kem bhai"
end_fence    := "aavjo bhai"
stmt         := print | decl | assign | if | while | break | continue
print        := "bhai bol" expr
decl         := "aa" IDENT "che" expr
assign       := IDENT "che" expr
if           := "jo" expr block ("nahi to" block)?
while        := "farvu" block "jya sudhi" expr
break        := "tame jao"
continue     := "aagal vado"
block        := "{" stmt* "}"
expr         := equality
equality     := comparison (("=="|"!=") comparison)*
comparison   := term ((">"|"<"|">="|"<=") term)*
term         := factor (("+"|"-") factor)*
factor       := unary (("*"|"/"|"%") unary)*
unary        := ("-") unary | primary
primary      := INT | STRING | BOOL | IDENT | "(" expr ")" | "bapu tame bolo"
BOOL         := "bhai chhe" | "bhai nathi"
```

---

## CLI Usage

```bash
# Run a KemLang file
kem run file.jsk

# Run with tracing (show tokens and AST)
kem run file.jsk --trace

# Interactive REPL
kem repl

# Format code
kem fmt file.jsk
kem fmt --check .  # Check if files need formatting

# Show tokens
kem tokens file.jsk

# Show AST
kem ast file.jsk

# Version info
kem version
```

---

## Examples

### Variables and Arithmetic

```kemlang
kem bhai
aa x che 10
aa y che 5

bhai bol "Sum: " + (x + y)
bhai bol "Product: " + (x * y)
bhai bol "x > y: " + (x > y)
aavjo bhai
```

### Conditionals

```kemlang
kem bhai
aa age che 25

jo age >= 18 {
    bhai bol "You can vote!"
} nahi to {
    bhai bol "Too young to vote"
}
aavjo bhai
```

### Loops

```kemlang
kem bhai
aa i che 1
farvu {
    bhai bol "Count: " + i
    i che i + 1
    jo i > 5 { tame jao }
} jya sudhi bhai chhe
aavjo bhai
```

### Input and Interaction

```kemlang
kem bhai
bhai bol "What's your name?"
aa naam che bapu tame bolo

jo naam == "Sanket" {
    bhai bol "Hello, creator!"
} nahi to {
    bhai bol "Nice to meet you, " + naam + "!"
}
aavjo bhai
```

---

## Error Messages

KemLang provides helpful error messages with source context:

```
Error: Undefined variable 'typo'
--> line 3:9
3 | bhai bol typo
  |          ^^^^

Runtime Error: TypeError: cannot + int and str
--> line 2:15
2 | bhai bol 5 + "hello"
  |               ^^^^^^^
```

---

## Development

### Setup

```bash
git clone https://github.com/sanketmuchhala/Gujju.py
cd kemlang
pip install -e ".[dev,test]"
pre-commit install
```

### Testing

```bash
# Run all tests
pytest

# With coverage
pytest --cov=kemlang

# Property-based fuzz testing
pytest tests/test_prop_fuzz.py

# Lint and type check
ruff check kemlang tests
mypy kemlang
```

### VS Code Extension

1. Navigate to `editor/kemlang-vscode/`
2. Run `npm install && npm run compile`
3. Press F5 to launch Extension Development Host
4. Open a `.jsk` file to see syntax highlighting

### Web Playground

The web playground is available at [kemlang.dev/playground](https://kemlang.dev/playground) and built with Next.js.

For local development:
```bash
cd kemlang-website
npm install
npm run dev
# Open http://localhost:3000
```

---

## Roadmap

### Upcoming Features

```mermaid
gantt
    title KemLang Development Roadmap
    dateFormat  YYYY-MM-DD
    section Language Features
    Functions & Scoping        :2024-01-01, 60d
    Arrays & Objects          :2024-03-01, 45d
    Standard Library          :2024-04-15, 90d
    Comments Support          :2024-06-01, 30d
    section Developer Tools
    Language Server Protocol  :2024-02-01, 120d
    Python Transpiler         :2024-05-01, 75d
    Package Manager          :2024-07-01, 90d
    section Infrastructure
    Mobile Playground        :2024-03-15, 60d
    Desktop App             :2024-06-15, 90d
    Cloud IDE Integration   :2024-08-01, 60d
```

### Feature Checklist

- [ ] **Functions**: `function naam(args) { ... }`
- [ ] **Arrays**: `[1, 2, 3]` and `obj[index]`
- [ ] **Objects/Maps**: `{key: value}` syntax
- [ ] **Standard Library**: Math, string, file operations
- [ ] **Comments**: `// single line` and `/* block */`
- [ ] **Imports**: Module system
- [ ] **Python Transpiler**: Compile KemLang to Python
- [ ] **Package Manager**: Dependency management
- [ ] **Language Server**: IDE integration with LSP
- [ ] **Mobile App**: React Native playground
- [ ] **Desktop App**: Electron-based IDE

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `pytest`
5. Commit changes: `git commit -m "Add amazing feature"`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and inclusive.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by [Bhailang](https://github.com/DulLabs/bhai-lang)
- Built with Python, Typer, and Rich
- Website powered by Next.js and Vercel
- Special thanks to the Gujarati programming community

---

## Support

- **Issues**: [GitHub Issues](https://github.com/sanketmuchhala/Gujju.py/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sanketmuchhala/Gujju.py/discussions)
- **Email**: [Support](mailto:support@kemlang.dev)
- **Website**: [kemlang.dev](https://kemlang.dev)

---

<div align="center">

**Made with love for the Gujarati developer community**

[Website](https://kemlang.dev) • [Docs](https://kemlang.dev/docs) • [Playground](https://kemlang.dev/playground) • [Blog](https://kemlang.dev/changelog)

</div>

import sys
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console
from rich.tree import Tree

from .errors import KemError, render_diagnostic
from .fmt import format_code
from .interpreter import run as interpret
from .lexer import tokenize
from .parser import parse_program
from .version import __version__


app = typer.Typer(help="KemLang - A Gujarati-flavored programming language")
console = Console()


def pretty_print_ast(node, tree=None, name="Program") -> Tree:
    """Pretty print AST as a tree structure."""
    if tree is None:
        tree = Tree(f"[bold blue]{name}[/bold blue]")

    node_type = type(node).__name__

    if hasattr(node, "statements"):
        subtree = tree.add(f"[green]{node_type}[/green]")
        for i, stmt in enumerate(node.statements):
            pretty_print_ast(stmt, subtree, f"Statement {i + 1}")
    elif hasattr(node, "expression"):
        subtree = tree.add(f"[green]{node_type}[/green]")
        pretty_print_ast(node.expression, subtree, "Expression")
    elif hasattr(node, "condition"):
        subtree = tree.add(f"[green]{node_type}[/green]")
        pretty_print_ast(node.condition, subtree, "Condition")
        if hasattr(node, "then_branch"):
            pretty_print_ast(node.then_branch, subtree, "Then")
        if hasattr(node, "else_branch") and node.else_branch:
            pretty_print_ast(node.else_branch, subtree, "Else")
    elif hasattr(node, "left") and hasattr(node, "right"):
        subtree = tree.add(
            f"[green]{node_type}[/green] [yellow]{node.operator.lexeme if hasattr(node, 'operator') else ''}[/yellow]"
        )
        pretty_print_ast(node.left, subtree, "Left")
        pretty_print_ast(node.right, subtree, "Right")
    elif hasattr(node, "value"):
        tree.add(f"[green]{node_type}[/green]: [cyan]{repr(node.value)}[/cyan]")
    elif hasattr(node, "name"):
        tree.add(f"[green]{node_type}[/green]: [cyan]{node.name}[/cyan]")
    else:
        tree.add(f"[green]{node_type}[/green]")

    return tree


@app.command()
def run(
    file: Annotated[Path, typer.Argument(help="KemLang file to run")],
    trace: Annotated[bool, typer.Option("--trace", help="Show tokens and AST before execution")] = False,
):
    """Run a KemLang file."""
    if not file.exists():
        console.print(f"[red]Error: File '{file}' not found[/red]")
        raise typer.Exit(1)

    if file.suffix != ".jsk":
        console.print(f"[yellow]Warning: File '{file}' doesn't have .jsk extension[/yellow]")

    try:
        source = file.read_text()

        if trace:
            console.print("[bold]Tokens:[/bold]")
            tokens = tokenize(source)
            for token in tokens[:20]:  # Limit output
                console.print(
                    f"  {token.type.name:15} {token.lexeme!r:15} {token.line}:{token.col}"
                )
            if len(tokens) > 20:
                console.print(f"  ... and {len(tokens) - 20} more tokens")

            console.print("\n[bold]AST:[/bold]")
            program = parse_program(source)
            tree = pretty_print_ast(program)
            console.print(tree)
            console.print()

        exit_code = interpret(source)
        if exit_code == 0:
            sys.exit(0)
        else:
            sys.exit(exit_code)

    except KemError as e:
        diagnostic = render_diagnostic(source, e.line, e.col, e.message, type(e).__name__)
        console.print(f"[red]{diagnostic}[/red]")
        raise typer.Exit(1) from e
    except Exception as e:
        console.print(f"[red]Error: {str(e)}[/red]")
        raise typer.Exit(1) from e


@app.command()
def repl():
    """Start an interactive KemLang REPL."""
    console.print("[bold green]KemLang REPL v{__version__}[/bold green]")
    console.print("Type your code and press Ctrl+D (Unix) or Ctrl+Z (Windows) to execute.")
    console.print("Add 'kem bhai' and 'aavjo bhai' if not present.")
    console.print()

    while True:
        try:
            lines = []
            console.print("[yellow]>>> [/yellow]", end="")

            # Read multi-line input
            while True:
                try:
                    line = input()
                    lines.append(line)
                except EOFError:
                    break

            if not lines:
                continue

            source = "\n".join(lines)

            # Auto-add fence if not present
            if "kem bhai" not in source:
                source = f"kem bhai\n{source}\naavjo bhai"

            exit_code = interpret(source)
            if exit_code != 0:
                console.print("[red]Execution failed[/red]")

        except KeyboardInterrupt:
            console.print("\n[yellow]Goodbye![/yellow]")
            break
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")


@app.command()
def fmt(
    path: Annotated[Path, typer.Argument(help="File or directory to format")],
    check: Annotated[bool, typer.Option("--check", help="Check if files are formatted without modifying them")] = False,
):
    """Format KemLang files."""
    if path.is_file():
        files = [path]
    elif path.is_dir():
        files = list(path.rglob("*.jsk"))
    else:
        console.print(f"[red]Error: '{path}' is not a file or directory[/red]")
        raise typer.Exit(1)

    if not files:
        console.print("[yellow]No .jsk files found[/yellow]")
        return

    changed_files = []

    for file in files:
        try:
            original = file.read_text()
            formatted = format_code(original)

            if original != formatted:
                changed_files.append(file)
                if not check:
                    file.write_text(formatted)
                    console.print(f"[green]Formatted {file}[/green]")
                else:
                    console.print(f"[yellow]Would format {file}[/yellow]")
            elif not check:
                console.print(f"[dim]Already formatted {file}[/dim]")

        except Exception as e:
            console.print(f"[red]Error formatting {file}: {str(e)}[/red]")
            raise

    if check and changed_files:
        console.print(f"[red]{len(changed_files)} file(s) need formatting[/red]")
        raise typer.Exit(1)


@app.command()
def tokens(file: Annotated[Path, typer.Argument(help="KemLang file to tokenize")]):
    """Show tokens for a KemLang file."""
    if not file.exists():
        console.print(f"[red]Error: File '{file}' not found[/red]")
        raise typer.Exit(1)

    try:
        source = file.read_text()
        tokens = tokenize(source)

        console.print(f"[bold]Tokens for {file}:[/bold]")
        for token in tokens:
            console.print(f"  {token.type.name:15} {token.lexeme!r:15} {token.line}:{token.col}")

    except Exception as e:
        console.print(f"[red]Error: {str(e)}[/red]")
        raise typer.Exit(1) from e


@app.command()
def ast(file: Annotated[Path, typer.Argument(help="KemLang file to parse")]):
    """Show AST for a KemLang file."""
    if not file.exists():
        console.print(f"[red]Error: File '{file}' not found[/red]")
        raise typer.Exit(1)

    try:
        source = file.read_text()
        program = parse_program(source)

        console.print(f"[bold]AST for {file}:[/bold]")
        tree = pretty_print_ast(program)
        console.print(tree)

    except KemError as e:
        diagnostic = render_diagnostic(source, e.line, e.col, e.message, type(e).__name__)
        console.print(f"[red]{diagnostic}[/red]")
        raise typer.Exit(1) from e
    except Exception as e:
        console.print(f"[red]Error: {str(e)}[/red]")
        raise typer.Exit(1) from e


@app.command()
def version():
    """Show KemLang version."""
    console.print(f"KemLang {__version__}")


if __name__ == "__main__":
    app()

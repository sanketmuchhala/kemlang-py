from typing import Dict, Any, Callable, Optional, List
import sys
from io import StringIO

from .types import (
    Program, Block, Stmt, Expr, KemValue,
    Print, Declaration, Assignment, If, While, Break, Continue,
    Binary, Unary, Literal, Variable, Input, TokenType
)
from .errors import RuntimeError, BreakError, ContinueError
from .parser import parse_program


class Environment:
    def __init__(self, enclosing: Optional['Environment'] = None):
        self.values: Dict[str, KemValue] = {}
        self.enclosing = enclosing

    def define(self, name: str, value: KemValue):
        """Define a new variable. Error if already exists in current scope."""
        if name in self.values:
            raise RuntimeError(f"Variable '{name}' already declared in this scope")
        self.values[name] = value

    def get(self, name: str) -> KemValue:
        """Get variable value. Error if not found."""
        if name in self.values:
            return self.values[name]
        if self.enclosing:
            return self.enclosing.get(name)
        raise RuntimeError(f"Undefined variable '{name}'")

    def assign(self, name: str, value: KemValue):
        """Assign to existing variable. Error if not found."""
        if name in self.values:
            self.values[name] = value
            return
        if self.enclosing:
            self.enclosing.assign(name, value)
            return
        raise RuntimeError(f"Undefined variable '{name}'")


class Interpreter:
    def __init__(self, input_fn: Callable[[], str] = input, output_fn: Callable[[str], None] = print):
        self.globals = Environment()
        self.environment = self.globals
        self.input_fn = input_fn
        self.output_fn = output_fn

    def interpret(self, program: Program) -> int:
        """Interpret a program. Returns 0 on success, 1 on error."""
        try:
            for statement in program.statements:
                self.execute(statement)
            return 0
        except RuntimeError as e:
            self.output_fn(f"Runtime Error: {e.message}")
            return 1
        except Exception as e:
            self.output_fn(f"Internal Error: {str(e)}")
            return 1

    def execute(self, stmt: Stmt):
        """Execute a statement."""
        if isinstance(stmt, Print):
            self.execute_print(stmt)
        elif isinstance(stmt, Declaration):
            self.execute_declaration(stmt)
        elif isinstance(stmt, Assignment):
            self.execute_assignment(stmt)
        elif isinstance(stmt, If):
            self.execute_if(stmt)
        elif isinstance(stmt, While):
            self.execute_while(stmt)
        elif isinstance(stmt, Block):
            self.execute_block(stmt)
        elif isinstance(stmt, Break):
            raise BreakError()
        elif isinstance(stmt, Continue):
            raise ContinueError()
        else:
            raise RuntimeError(f"Unknown statement type: {type(stmt)}")

    def execute_print(self, stmt: Print):
        value = self.evaluate(stmt.expression)
        self.output_fn(self.stringify(value))

    def execute_declaration(self, stmt: Declaration):
        value = self.evaluate(stmt.initializer)
        self.environment.define(stmt.name, value)

    def execute_assignment(self, stmt: Assignment):
        value = self.evaluate(stmt.value)
        self.environment.assign(stmt.name, value)

    def execute_if(self, stmt: If):
        condition = self.evaluate(stmt.condition)
        if self.is_truthy(condition):
            self.execute(stmt.then_branch)
        elif stmt.else_branch:
            self.execute(stmt.else_branch)

    def execute_while(self, stmt: While):
        """Execute while loop: farvu { ... } jya sudhi <condition>"""
        try:
            while True:
                # Execute body first
                try:
                    self.execute(stmt.body)
                except ContinueError:
                    pass  # Continue to condition check

                # Then check condition
                condition = self.evaluate(stmt.condition)
                if not self.is_truthy(condition):
                    break

        except BreakError:
            pass  # Exit the loop

    def execute_block(self, stmt: Block):
        """Execute a block with new environment scope."""
        previous = self.environment
        try:
            self.environment = Environment(self.environment)
            for statement in stmt.statements:
                self.execute(statement)
        finally:
            self.environment = previous

    def evaluate(self, expr: Expr) -> KemValue:
        """Evaluate an expression."""
        if isinstance(expr, Literal):
            return expr.value
        elif isinstance(expr, Variable):
            return self.environment.get(expr.name)
        elif isinstance(expr, Binary):
            return self.evaluate_binary(expr)
        elif isinstance(expr, Unary):
            return self.evaluate_unary(expr)
        elif isinstance(expr, Input):
            return self.input_fn().rstrip('\n')  # Remove only trailing newline
        else:
            raise RuntimeError(f"Unknown expression type: {type(expr)}")

    def evaluate_binary(self, expr: Binary) -> KemValue:
        left = self.evaluate(expr.left)
        right = self.evaluate(expr.right)

        op = expr.operator.type

        # Arithmetic operators
        if op == TokenType.PLUS:
            if isinstance(left, str) or isinstance(right, str):
                return self.stringify(left) + self.stringify(right)
            elif isinstance(left, (int, float)) and isinstance(right, (int, float)):
                return left + right
            else:
                raise RuntimeError(f"TypeError: cannot `+` {type(left).__name__} and {type(right).__name__}")

        elif op == TokenType.MINUS:
            self.check_number_operands(left, right, expr.operator.lexeme)
            return left - right

        elif op == TokenType.MULTIPLY:
            self.check_number_operands(left, right, expr.operator.lexeme)
            return left * right

        elif op == TokenType.DIVIDE:
            self.check_number_operands(left, right, expr.operator.lexeme)
            if right == 0:
                raise RuntimeError("Division by zero")
            return left / right  # Always returns float

        elif op == TokenType.MODULO:
            if not (isinstance(left, int) and isinstance(right, int)):
                raise RuntimeError("Modulo operator requires integer operands")
            if right == 0:
                raise RuntimeError("Modulo by zero")
            return left % right

        # Comparison operators
        elif op == TokenType.EQUAL:
            return left == right
        elif op == TokenType.NOT_EQUAL:
            return left != right
        elif op == TokenType.GREATER:
            self.check_number_operands(left, right, expr.operator.lexeme)
            return left > right
        elif op == TokenType.GREATER_EQUAL:
            self.check_number_operands(left, right, expr.operator.lexeme)
            return left >= right
        elif op == TokenType.LESS:
            self.check_number_operands(left, right, expr.operator.lexeme)
            return left < right
        elif op == TokenType.LESS_EQUAL:
            self.check_number_operands(left, right, expr.operator.lexeme)
            return left <= right

        raise RuntimeError(f"Unknown binary operator: {expr.operator.lexeme}")

    def evaluate_unary(self, expr: Unary) -> KemValue:
        right = self.evaluate(expr.right)

        if expr.operator.type == TokenType.MINUS:
            if not isinstance(right, (int, float)):
                raise RuntimeError("Unary minus requires numeric operand")
            return -right

        raise RuntimeError(f"Unknown unary operator: {expr.operator.lexeme}")

    def check_number_operands(self, left: KemValue, right: KemValue, operator: str):
        """Check that both operands are numbers."""
        if not isinstance(left, (int, float)) or not isinstance(right, (int, float)):
            raise RuntimeError(f"Operator '{operator}' requires numeric operands")

    def is_truthy(self, value: KemValue) -> bool:
        """Determine truthiness of a value."""
        if value is None:
            return False
        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float)):
            return value != 0
        if isinstance(value, str):
            return len(value) > 0
        return True

    def stringify(self, value: KemValue) -> str:
        """Convert a value to its string representation."""
        if value is None:
            return "null"
        if isinstance(value, bool):
            return "true" if value else "false"
        if isinstance(value, float):
            # Remove .0 from whole numbers
            if value == int(value):
                return str(int(value))
            return str(value)
        return str(value)


def run(source: str, *, input_fn: Callable[[], str] = input, output_fn: Callable[[str], None] = print) -> int:
    """Run KemLang source code. Returns exit code 0 on success, 1 on error."""
    try:
        program = parse_program(source)
        interpreter = Interpreter(input_fn, output_fn)
        return interpreter.interpret(program)
    except Exception as e:
        output_fn(f"Error: {str(e)}")
        return 1

# KemLang Bug Fix Plan

Based on the testing of KemLang snippets documented in `syntax.mdx`, several bugs and feature gaps exist in the current `kemlang` implementation that prevent it from matching its documented syntax. This report outlines what needs to be fixed.

## 1. System-Wide ImportError
**What is not working**: The script `test_website_commands.py` fails entirely out of the box.
**Why it is not working**: The `kemlang/interpreter.py` attempts to import `BreakError` and `ContinueError` from `kemlang.errors`. However, in `kemlang/errors.py`, these are named `BreakException` and `ContinueException`.
**How we fix it**: Update `kemlang/interpreter.py` to import `BreakException` and `ContinueException` and update the exception handlers to use the correct names.

## 2. Lack of Support for Single-Line Comments (`//`)
**What is not working**: Snippets containing `//` (like Snippet 0 and Snippet 8) throw syntax errors (`Unexpected character '/'` or fail processing).
**Why it is not working**: The lexical analyzer (`kemlang/lexer.py`) treats `/` only as the division operator (`TokenType.DIVIDE`) and lacks parsing logic to ignore characters when contiguous slashes (`//`) appear.
**How we fix it**: Update `scan_token` in `kemlang/lexer.py`. When encountering `/`, check if the next character is also `/`. If it is, consume characters until a newline (`\n`) is encountered, effectively treating it as a comment.

## 3. Unrecognized Boolean Keywords (`true` and `false`)
**What is not working**: Boolean assignments (`aa isTrue che true`) throw `Undefined variable 'true'` runtime errors.
**Why it is not working**: The lexer only maps `bhai chhe` and `bhai nathi` as Boolean tokens in Gujarati syntax, ignoring the standard English `true` and `false` as shown on the website.
**How we fix it**: Add `"true"` and `"false"` to the `self.keywords` dictionary in `kemlang/lexer.py` pointing to `TokenType.BHAI_CHHE` and `TokenType.BHAI_NATHI` respectively.

## 4. Unrecognized Single-Quote Strings
**What is not working**: Strings declared with single quotes (`'Single quotes also work'`) fail with `Unexpected character '''`.
**Why it is not working**: The `scan_token` and `string` methods in `kemlang/lexer.py` only recognize the `"` character as a string delimiter.
**How we fix it**: Modify `scan_token` in `kemlang/lexer.py` to also call `string()` when hitting `'`. Update the `string()` method to accept the delimiting character as an parameter and terminate parsing when the same character is hit.

## 5. Unrecognized Floating Point Numbers
**What is not working**: Decimals (`aa decimal che 3.14`) are throwing an `Unexpected character '.'` error.
**Why it is not working**: The `number()` scanner in `kemlang/lexer.py` only consumes contiguous digits to create an integer, stopping at the `.` and letting `scan_token` fail on an unknown character.
**How we fix it**: Add a `TokenType.FLOAT` to `kemlang/types.py`. Then modify `number()` in the lexer so that if it hits a `.` followed by digits, it consumes the fractional part and casts to `float`.

## 6. String and Integer Concatenation Failure
**What is not working**: The expression `"Sum: " + sum` crashes with a TypeError.
**Why it is not working**: `kemlang/interpreter.py` strictly type-checks the `+` operator. If `left` is `str` and `right` is `str`, it concatenates. If both are numbers, it adds. Otherwise, it throws an error.
**How we fix it**: In `kemlang/interpreter.py` under the `TokenType.PLUS` handler within `evaluate_binary`, allow implicit string coercion by checking if *either* operand is a string. If so, cast both using `self.stringify()` and concatenate.

# KemLang Commands Test Report

This report documents the testing of all code snippets and commands provided in the `kemlang-website/content/docs/language/syntax.mdx` documentation. 

A test script was executed to extract the 13 KemLang snippets from the markdown file and run them using the current `kemlang` interpreter. This report reflects the testing results **after** fixing the compatibility bugs in the `kemlang` source code (as planned in `docs/fixing.md`).

---

## Test Results Overview

- **Total Snippets Tested**: 13
- **Passing Snippets**: 13
- **Failing Snippets**: 0

---

## Detailed Results

### 1. Basic Structure (Snippet 0)
**Code**:
```jsk
kem bhai
    // Your code here
aavjo bhai
```
**Status**: ✅ PASS
**Notes**: The lexer now correctly identifies `//` as a single-line comment.

### 2. Variable Declarations with Boolean (Snippet 1, 5)
**Code**:
```jsk
aa isTrue che true
aa isFalse che false
```
**Status**: ✅ PASS
**Notes**: The lexer now aliases `true` and `false` to internal `BHAI_CHHE` and `BHAI_NATHI` truth tokens.

### 3. Variable Re-assignment (Snippet 2)
**Code**:
```jsk
aa counter che 0
counter che 1
counter che counter + 1
```
**Status**: ✅ PASS
**Notes**: Feature already working.

### 4. Single-Quote Strings (Snippet 3)
**Code**:
```jsk
aa name che 'Single quotes also work'
```
**Status**: ✅ PASS
**Notes**: The lexer was updated to parse strings bounded by `'` in addition to `"`.

### 5. Decimal/Float Variables (Snippet 4)
**Code**:
```jsk
aa decimal che 3.14
```
**Status**: ✅ PASS
**Notes**: A new `FLOAT` token was implemented. The lexer can successfully extract fractional segments.

### 6. Boolean Output Print (Snippet 6)
**Code**:
```jsk
kem bhai
bhai bol true
aavjo bhai
```
**Status**: ✅ PASS
**Notes**: Outputs `true` natively due to the keyword alias patches.

### 7. String Concatenation (Snippet 7)
**Code**:
```jsk
kem bhai
aa firstName che "Sanket"
aa lastName che "Patel"
aa fullName che firstName + " " + lastName
bhai bol fullName
aavjo bhai
```
**Status**: ✅ PASS

### 8. Comments (Snippet 8, 9)
**Code**:
```jsk
// This is a single-line comment
kem bhai
    aa name che "KemLang"  // Comment at end of line
    bhai bol name
aavjo bhai
```
**Status**: ✅ PASS
**Notes**: Successfully parsed and executed without throwing symbol errors.

### 9. Basic Print Operations (Snippet 10)
**Code**:
```jsk
kem bhai
bhai bol "Hello, World!"
aavjo bhai
```
**Status**: ✅ PASS

### 10. String Expressions (Snippet 11)
**Code**:
```jsk
aa naam che "Sanket"
aa greeting che "kem cho, " + naam + "!"
bhai bol greeting
```
**Status**: ✅ PASS

### 11. Implied String-Casting (Snippet 12)
**Code**:
```jsk
kem bhai
aa num1 che 15
aa num2 che 25
aa sum che num1 + num2

bhai bol "Sum: " + sum
aavjo bhai
```
**Status**: ✅ PASS
**Notes**: The `kemlang` interpreter was updated. `+` now implicitly delegates to string extraction if either operand is determined to be a string instance.

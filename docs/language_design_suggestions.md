# KemLang Language Design Suggestions

As KemLang scales, introduces new features, and attracts more developers, it is important to ensure the language maintains its unique, fun Gujarati flavor while adhering to standard programming language principles (like those found in JavaScript, Python, or Go). 

This document outlines structural suggestions for existing commands and proposes principles for future commands to make the language more robust, intuitive, and standard.

## 1. Variable Assignments
**Current Syntax:**
```jsk
aa naam che "Sanket"      // Declaration
naam che "Rahul"          // Re-assignment
aa fullName che firstName + " " + lastName
```

**Critique:**
While `aa [var] che [value]` reads naturally in Gujarati ("this [var] is [value]"), using `che` as an assignment operator is verbose and can make complex mathematical expressions harder to read.

**Suggestion:**
Consider adopting the universal assignment operator `=` for assignments, while keeping `aa` as the variable declaration keyword (similar to `let`, `var`, or `def` in other languages).
```jsk
aa naam = "Sanket"
naam = "Rahul"
aa sum = x + y + z
```
This dramatically improves readability for developers transitioning from other languages while maintaining the core identity of the language.

## 2. Loop Structures (`while` / `do-while`)
**Current Syntax:**
```jsk
farvu { 
    // code
} jya sudhi condition
```

**Critique:**
The current structure mimics a `do-while` loop syntactically (block first, condition second), but executes like a traditional `while` loop (the condition must act as the loop bounds). Evaluating condition expressions *after* the block visually can confuse developers regarding when the break happens.

**Suggestion:**
Align with the universally accepted control structure where the condition precedes the block.
**Proposed `while` loop:**
```jsk
jya sudhi (condition) {
    // code
}
```
**Proposed `do-while` loop (if needed):**
```jsk
farvu {
    // code
} jya sudhi (condition) 
```

## 3. String Interpolation
**Current Syntax:**
```jsk
bhai bol "kem cho, " + naam + "!"
```

**Critique:**
Heavy use of the `+` operator for string concatenation is prone to type errors (as previously seen) and makes strings harder to read and translate.

**Suggestion:**
Introduce template literals or f-strings for cleaner string evaluation.
```jsk
// Python style
bhai bol f"kem cho, {naam}!"

// JS style
bhai bol `kem cho, ${naam}!`
```

## 4. Function Declarations (Upcoming Feature)
As noted in the roadmap, functions are planned. 

**Suggestion:**
Avoid excessively long multi-word keywords for identifying functions. Standardize around a single, powerful Gujarati keyword for defining a repeatable block of work, mapped cleanly to the `return` keyword.

**Proposed Syntax:**
```jsk
kaam calculate_sum(a, b) {
    aapo a + b
}

aa result = calculate_sum(5, 10)
```
- `kaam` (work/task) acts as the `function` / `def` keyword.
- `aapo` (give) acts as the `return` keyword.

## 5. Standardizing I/O Function Naming
**Current Syntax:**
```jsk
bhai bol "Output"
aa input = bapu tame bolo
```

**Critique:**
`bhai bol` and `bapu tame bolo` are fun, but they mix different personas (`bhai` vs `bapu`). If the developer is the "bhai" (as defined by `kem bhai`), the I/O streams should maintain a cohesive narrative.

**Suggestion:**
Standardize the standard library built-ins under consistent namespaces or objects in the future.
```jsk
bhai.bol("Output")
aa input = bhai.sambhlo()  // "brother, listen" (input)
```
Or keep them as top-level keywords, but pair the terminology:
- `bhai bol` (print)
- `bhai sambhal` (input)

## 6. Collections (Arrays and Objects)
When arrays and dictionaries are added to the language:

**Suggestion:**
Do not invent new bounding characters for data structures. Rely strictly on universally accepted C-style JSON tokens.
- **Arrays**: `[1, 2, 3]`
- **Maps/Dicts**: `{"name": "Sanket", "age": 25}`
This ensures immediate familiarity for anyone using APIs or JSON configurations.

## Summary of Core Language Principles
As KemLang evolves, we should adopt these three rules:
1. **Gujarati for Keywords**: Control flow, declarations, and system directives should be fun Gujarati words.
2. **Universal Maths/Symbols**: Operators (`=`, `+`, `-`, `*`, `/`, `%`), comparators (`==`, `<`, `>`), and collection bounds (`[ ]`, `{ }`) should adhere strictly to C/Java/Python standards. 
3. **Left-to-Right Readability**: Logic should flow top-to-bottom, left-to-right (e.g. conditions before code blocks for `if` and `while`).

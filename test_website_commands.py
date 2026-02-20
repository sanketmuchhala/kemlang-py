import os
import re
import subprocess
import sys
from pathlib import Path
import json

ROOT_DIR = Path(__file__).parent.absolute()
DOCS_DIR = ROOT_DIR / "kemlang-website" / "content" / "docs"

def main():
    mdx_files = []
    for root, _, files in os.walk(DOCS_DIR):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md"):
                mdx_files.append(os.path.join(root, file))
    
    results = []
    print(f"Found {len(mdx_files)} markdown files in {DOCS_DIR}")
    
    for file_path in mdx_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Find jsk and kemlang code blocks
        pattern = r"```(?:jsk|kemlang)\n(.*?)```"
        snippets = re.findall(pattern, content, re.DOTALL)
        
        for i, snippet in enumerate(snippets):
            if "bapu tame bolo" in snippet:
                test_input = "Sanket\n"
            else:
                test_input = ""
                
            code = snippet.strip()
            if not code.startswith("kem bhai"):
                code = f"kem bhai\n{code}\naavjo bhai"
                
            temp_file = ROOT_DIR / f"temp_snippet_{i}.jsk"
            with open(temp_file, "w", encoding="utf-8") as f:
                f.write(code)
                
            try:
                process = subprocess.run(
                    [sys.executable, "-m", "kemlang.cli", "run-file", str(temp_file)],
                    input=test_input,
                    cwd=ROOT_DIR,
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                
                status = "PASS" if process.returncode == 0 else "FAIL"
                
                results.append({
                    "file": os.path.relpath(file_path, DOCS_DIR),
                    "index": i,
                    "code": snippet.strip(),
                    "status": status,
                    "stdout": process.stdout,
                    "stderr": process.stderr,
                    "returncode": process.returncode
                })
                print(f"[{status}] {os.path.relpath(file_path, DOCS_DIR)} - Snippet {i}")
                if status == "FAIL":
                    print(f"  Error: {process.stderr.strip()}")
            except subprocess.TimeoutExpired:
                results.append({
                    "file": os.path.relpath(file_path, DOCS_DIR),
                    "index": i,
                    "code": snippet.strip(),
                    "status": "TIMEOUT",
                    "stdout": "",
                    "stderr": "Execution timed out",
                    "returncode": -1
                })
                print(f"[TIMEOUT] {os.path.relpath(file_path, DOCS_DIR)} - Snippet {i}")
            finally:
                if temp_file.exists():
                    temp_file.unlink()

    # Save results to a JSON file for analysis
    with open("snippet_test_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
        
    print(f"\nTested {len(results)} snippets. Results saved to snippet_test_results.json.")

if __name__ == "__main__":
    main()

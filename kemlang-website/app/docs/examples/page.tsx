import { Metadata } from "next";
import Link from "next/link";
import { CodeSample } from "@/components/code-sample";

export const metadata: Metadata = {
  title: "Examples",
  description: "Real kemlang-py programs you can study and run.",
};

const examples = [
  {
    title: "Hello World",
    desc: "The simplest possible kemlang-py program.",
    code: `kem bhai
  bhai bol "kem cho, duniya!"
aavjo bhai`,
    output: "kem cho, duniya!",
  },
  {
    title: "Personal greeting",
    desc: "Read the user's name and print a greeting.",
    code: `kem bhai
  bhai bol "What is your name?"
  aa naam che bapu tame bolo
  bhai bol "kem cho, " + naam + "!"
aavjo bhai`,
    output: "What is your name?\n> Sanket\nkem cho, Sanket!",
  },
  {
    title: "Even or odd",
    desc: "Check whether a number is even or odd using modulo.",
    code: `kem bhai
  aa n che 7

  jo n % 2 == 0 {
    bhai bol n + " is even"
  } nahi to {
    bhai bol n + " is odd"
  }
aavjo bhai`,
    output: "7 is odd",
  },
  {
    title: "Count to N",
    desc: "Print numbers 1 through N using a loop.",
    code: `kem bhai
  aa n che 5
  aa i che 1
  farvu {
    bhai bol i
    i che i + 1
  } jya sudhi i <= n
aavjo bhai`,
    output: "1\n2\n3\n4\n5",
  },
  {
    title: "FizzBuzz",
    desc: "The classic interview problem — print Fizz, Buzz, or FizzBuzz.",
    code: `kem bhai
  aa n che 1
  farvu {
    jo n % 15 == 0 {
      bhai bol "FizzBuzz"
    } nahi to {
      jo n % 3 == 0 {
        bhai bol "Fizz"
      } nahi to {
        jo n % 5 == 0 {
          bhai bol "Buzz"
        } nahi to {
          bhai bol n
        }
      }
    }
    n che n + 1
  } jya sudhi n <= 15
aavjo bhai`,
    output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
  },
  {
    title: "Sum of odd numbers",
    desc: "Use continue to skip even numbers and sum only the odd ones.",
    code: `kem bhai
  aa sum che 0
  aa i che 1
  farvu {
    jo i % 2 == 0 { aagal vado }
    sum che sum + i
    i che i + 1
  } jya sudhi i <= 10
  bhai bol "Sum of odds 1-10: " + sum
aavjo bhai`,
    output: "Sum of odds 1-10: 25",
  },
  {
    title: "Number guessing game",
    desc: "A complete interactive game with a loop, input, and break.",
    code: `kem bhai
  aa secret che 42
  aa tries  che 0

  farvu {
    bhai bol "Guess (1-100):"
    aa guess che bapu tame bolo
    tries che tries + 1

    jo guess == secret {
      bhai bol "Correct in " + tries + " tries!"
      tame jao
    } nahi to {
      bhai bol "Try again..."
    }
  } jya sudhi bhai chhe
aavjo bhai`,
    output: "Guess (1-100):\n> 50\nTry again...\nGuess (1-100):\n> 42\nCorrect in 2 tries!",
  },
  {
    title: "Grade calculator",
    desc: "Assign letter grades based on a numeric score.",
    code: `kem bhai
  bhai bol "Enter your score:"
  aa score che bapu tame bolo

  jo score >= 90 {
    bhai bol "Grade: A"
  } nahi to {
    jo score >= 80 {
      bhai bol "Grade: B"
    } nahi to {
      jo score >= 70 {
        bhai bol "Grade: C"
      } nahi to {
        jo score >= 60 {
          bhai bol "Grade: D"
        } nahi to {
          bhai bol "Grade: F"
        }
      }
    }
  }
aavjo bhai`,
    output: "Enter your score:\n> 85\nGrade: B",
  },
];

export default function ExamplesPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Examples</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          Example programs
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Real kemlang-py programs you can study, copy, and run. Each example shows a self-contained concept.
        </p>
      </div>

      <div className="space-y-10">
        {examples.map(({ title, desc, code, output }) => (
          <div key={title} className="border-b pb-10 last:border-0 last:pb-0">
            <h2 className="font-display text-xl mb-1">{title}</h2>
            <p className="text-sm text-muted-foreground mb-5">{desc}</p>
            <CodeSample highlight code={code} />
            {output && (
              <div className="mt-3 rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
                <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                  <span className="font-mono text-xs text-muted-foreground">output</span>
                </div>
                <pre className="px-4 py-3 font-mono text-sm" style={{ color: "hsl(var(--kw))" }}>{output}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          Want to run these yourself?{" "}
          <Link href="/playground" className="text-primary underline underline-offset-4">Open the playground</Link>
          {" "}or{" "}
          <Link href="/docs/installation" className="text-primary underline underline-offset-4">install kemlang-py locally</Link>.
        </p>
      </div>
    </div>
  );
}

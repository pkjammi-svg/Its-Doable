# tools/

Standalone helper scripts for maintaining `question-paper-studio.html`'s
question bank. These run with plain Node.js (no dependencies) and are for
offline validation only — the app itself is a single self-contained HTML
file with no build step or backend.

## parse-question-bank.mjs

Validates a pipe-delimited question file using the exact same parsing rules
as the app's Import screen (`Question | Option A | Option B | ... | CorrectAnswer`,
where the last field is a letter, 1-based number, or exact option text).

```
node tools/parse-question-bank.mjs <input.txt> [out.json]
```

Reports total/parsed/error counts, duplicate questions (by normalized text),
option-count and answer-letter distributions, and a few spot-checked
questions. Optionally writes the parsed questions as `qp:bank`-shaped JSON.

To actually load a bulk file into the app, don't hand-edit storage — paste
it into the Question Bank tab's Import card (pipe-delimited or JSON mode),
or embed it as a `BUNDLED_SEED_TEXT` constant and wire up a "Load bundled
bank" button the way `question-paper-studio.html` already does, so the
import still goes through the app's own parse → preview → confirm pipeline
(dedup included) rather than writing storage directly.

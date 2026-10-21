# Synthetic walkthrough

## Prompt generation

From the repository root, run:

```sh
python3 scripts/build_prompt.py examples/brief.json --kind quiz --language en
```

Copy the prompt into a study assistant and attach [synthetic-source.md](synthetic-source.md). The helper only formats the brief. Source inspection and answer generation are performed by the assistant, not this script.

## Example expected answer shape

**Practice question (newly written):** A fictional collection has 3 blue counters and 2 white counters. Is the blue share of the whole 60% or 150%?

**Answer:** 60%. The whole is 3 + 2 = 5, so 3/5 × 100% = 60%. The distractor 150% comes from 3/2 × 100%, which compares blue with white rather than with the whole. Source: “Ratios” and “Percentages” in the synthetic source.

This single illustrative question is not a recorded model evaluation or a complete four-question quiz.

## Import-report example

| Source | Duplicate decision | Observed evidence | Status | Next action |
| --- | --- | --- | --- | --- |
| synthetic-source.md | New version authorized | Parsed “Ratios” heading and fictional counter example opened | readable | None |
| imaginary-audio.txt | Not established | No transcript available | unverified | Confirm readable transcript before using it |

These are fictional report rows, not a claim that a connected service was used.

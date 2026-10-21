# Study Workflow Skills

Reusable agent instructions for turning readable sources into beginner lessons, grounded quizzes, and verifiable import reports. English instructions, Chinese and English prompt output, synthetic examples, and an offline Python helper.

[中文说明](README.zh-CN.md) · [Example](examples/walkthrough.md) · [Roadmap](docs/ROADMAP.md)

**Status:** initial public-release candidate. These workflows grew out of personal study and document-import tasks. The packaged skills and helper are new; there is no claim of external adoption, measured learning gains, or production integrations.

## Choose a workflow

| Skill | Use it for | Key behavior |
| --- | --- | --- |
| [source-import-check](skills/source-import-check/SKILL.md) | Adding material to an existing knowledge notebook | Reuse the destination, avoid duplicates, verify parsed text |
| [beginner-study-pack](skills/beginner-study-pack/SKILL.md) | Learning from a bounded set of sources | Examples before definitions, worked steps, printable lookup aids |
| [grounded-quiz](skills/grounded-quiz/SKILL.md) | Checking understanding against those sources | Separate questions and answers, recompute solutions, cite only verified locations |

## Edit a concept map offline

Open [the concept-map tool](tools/concept-map/index.html) from a downloaded checkout. Edit or move cards, label relationships, undo, and save/reimport JSON. No data is uploaded; unsaved changes are lost on reload. See [the tool guide](docs/CONCEPT_MAP.md).

## Try it without installing anything

Give an agent this request along with the referenced files:

> Read `skills/grounded-quiz/SKILL.md`. Use `examples/synthetic-source.md` as the only source. Create four practice questions about ratios in English, with answers after the questions. Do not import or publish files.

The skills are Markdown instructions, not executable integrations. Explicitly load a skill by path in an agent that can read local files. For automatic discovery, follow that agent's current installation instructions; this repository does not configure your agent or account.

The fourth skill, [concept-map](skills/concept-map/SKILL.md), maps concepts with explicit relationship meanings and readable source locations.

## Make a compact prompt offline

Requires Python 3.9 or newer. No packages, account, network, or API key are needed.

```sh
python3 scripts/build_prompt.py examples/brief.json --kind lesson --max-chars 1200
python3 scripts/build_prompt.py examples/brief.json --kind quiz --max-chars 1200
python3 scripts/build_prompt.py examples/brief.json --kind quiz --language en
```

The helper formats a brief into a prompt; it does not read the listed source files, call a model, verify uploads, or generate a lesson. Attach the sources yourself. A character budget is a ceiling on Unicode code points (including newlines), not tokens or bytes. If the prompt is too long, the helper fails without printing a shortened prompt. Limits imposed by a destination may count characters differently.

Edit the [example brief](examples/brief.json) with your topic, source labels, included scope, exclusions, and quiz count. Use source labels, not private file paths or student names. All examples in this repository are newly written synthetic material.

## Verify changes

```sh
python3 scripts/check_repository.py
python3 -m unittest discover -s tests -v
node tools/concept-map/test.cjs
```

The repository checker checks skill frontmatter and local Markdown links. Tests cover input validation, character-budget failure, CLI errors, and independent lesson/quiz prompts. Neither check proves factual correctness, privacy, or model behavior. See the [manual evaluation cases](docs/EVALUATION.md).

## Privacy and provenance

Only reusable instructions, tools, and synthetic examples belong here. Do not commit course slides, commercial question banks, recordings, chat exports, institutional procedures, real learner records, browser sessions, or credentials. A filename or upload count is not proof that source content is readable. See [privacy guidance](docs/PRIVACY.md) and [contributing](CONTRIBUTING.md).

This is an independent community project, with no affiliation to a notebook vendor or model provider. MIT applies to the repository's original content; it does not license materials supplied by users.

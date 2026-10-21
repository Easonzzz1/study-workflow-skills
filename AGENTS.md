# Working on this repository

Keep the project focused on source-grounded study and import verification. Read the relevant `skills/*/SKILL.md` before changing its behavior. Skills describe workflows; scripts must remain offline and must not acquire credentials or upload files.

- Use Python 3.9+ and the standard library for helpers. Keep lesson and quiz prompts independently usable.
- Preserve user-selected source scope, destination, language, and character budget. A convenience helper must not silently drop constraints to fit a limit.
- Use synthetic fixtures. Do not copy private chat excerpts, institutional SOPs, original course files, paid question banks, or learner records into issues or commits.
- An example is not evidence of adoption. Keep roadmap work, completed code, observed tool results, and untested agent behavior distinct.
- Run `python3 scripts/check_repository.py` and `python3 -m unittest discover -s tests -v` before publishing changes. Review generated Chinese and English prompts for meaning as well as length.
- For a release, follow `docs/RELEASING.md`. Do not mark the initial candidate released until its public commit and checks are verified.

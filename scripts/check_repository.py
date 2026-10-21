"""Check skill metadata and local Markdown file links, not source accuracy."""
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
errors = []
for path in (ROOT / 'skills').glob('*/SKILL.md'):
    match = re.match(r'\A---\nname: ([a-z0-9-]+)\ndescription: (.+)\n---\n', path.read_text())
    if not match or match.group(1) != path.parent.name:
        errors.append(str(path.relative_to(ROOT)) + ': invalid skill metadata')
for path in ROOT.rglob('*.md'):
    for target in re.findall(r'\[[^\]\n]*\]\(([^\s)]+)\)', path.read_text()):
        parsed = urlsplit(target)
        if parsed.scheme or target.startswith('#'):
            continue
        destination = (path.parent / unquote(parsed.path)).resolve()
        if ROOT not in (destination, *destination.parents) or not destination.exists():
            errors.append(str(path.relative_to(ROOT)) + ': missing/unsafe link ' + target)
for error in errors:
    print(error)
print(f'{len(errors)} repository check error(s)')
raise SystemExit(bool(errors))

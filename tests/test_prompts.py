import copy
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from build_prompt import build_prompt, main

BRIEF = {'topic': 'Ratios', 'sources': ['synthetic-source.md'], 'scope': ['Ratios'], 'exclude': ['Inference'], 'question_count': 4}

class PromptTests(unittest.TestCase):
    def test_independent_prompts(self):
        for language in ('zh', 'en'):
            a, b = (build_prompt(BRIEF, kind, language) for kind in ('lesson', 'quiz'))
            self.assertNotEqual(a, b)
            for p in (a, b):
                self.assertIn('synthetic-source.md', p)
                self.assertIn('Inference', p)
            self.assertIn('4', b)

    def test_budget_boundary(self):
        p = build_prompt(BRIEF, 'quiz')
        self.assertEqual(p, build_prompt(BRIEF, 'quiz', max_chars=len(p)))
        with self.assertRaises(ValueError): build_prompt(BRIEF, 'quiz', max_chars=len(p)-1)

    def test_invalid_inputs(self):
        for key, value in [('topic', ''), ('sources', []), ('scope', 'Ratios'), ('exclude', [1]), ('question_count', True), ('question_count', 0), ('question_count', 101)]:
            b = copy.deepcopy(BRIEF)
            b[key] = value
            with self.subTest(key=key, value=value), self.assertRaises(ValueError): build_prompt(b, 'quiz')
        with self.assertRaises(ValueError): build_prompt([], 'quiz')

    def test_failure_has_no_partial_output(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'brief.json'
            path.write_text(json.dumps(BRIEF))
            with patch('sys.stdout', new_callable=io.StringIO) as out, patch('sys.stderr', new_callable=io.StringIO):
                code = main([str(path), '--kind', 'quiz', '--max-chars', '1'])
            self.assertEqual(code, 2)
            self.assertEqual(out.getvalue(), '')

    def test_invalid_json_cli(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'bad.json'
            path.write_text('{')
            result = subprocess.run([sys.executable, 'scripts/build_prompt.py', str(path), '--kind', 'lesson'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(result.stdout, '')
            self.assertNotIn('Traceback', result.stderr)

    def test_no_mutation(self):
        b = copy.deepcopy(BRIEF)
        build_prompt(b, 'lesson')
        self.assertEqual(b, BRIEF)

    def test_invalid_options(self):
        for args in [('other', 'zh', None), ('quiz', 'fr', None), ('quiz', 'zh', -1)]:
            with self.assertRaises(ValueError): build_prompt(BRIEF, *args)

if __name__ == '__main__': unittest.main()

#!/usr/bin/env python3
"""Build independent lesson/quiz prompts offline; never truncate constraints."""
import argparse
import json
import sys
from pathlib import Path


def build_prompt(brief, kind, language='zh', max_chars=None):
    if not isinstance(brief, dict):
        raise ValueError('brief must be a JSON object')
    if not isinstance(brief.get('topic'), str) or not brief['topic'].strip():
        raise ValueError('topic must be nonempty text')
    for key in ('sources', 'scope', 'exclude'):
        values = brief.get(key, [] if key == 'exclude' else None)
        if not isinstance(values, list) or any(not isinstance(v, str) or not v.strip() for v in values) or (key != 'exclude' and not values):
            raise ValueError(key + ' must be a list of nonempty strings')
    count = brief.get('question_count', 10)
    if type(count) is not int or not 1 <= count <= 100:
        raise ValueError('question_count must be an integer from 1 to 100')
    if kind not in ('lesson', 'quiz') or language not in ('zh', 'en'):
        raise ValueError('unsupported kind/language')
    if max_chars is not None and (type(max_chars) is not int or max_chars < 1):
        raise ValueError('max_chars must be a positive integer')
    lines = ['Topic: ' + brief['topic'], 'Sources: ' + '; '.join(brief['sources']), 'Scope: ' + '; '.join(brief['scope']), 'Exclude: ' + ('; '.join(brief.get('exclude', [])) or 'None')]
    if language == 'zh':
        lines.append('仅依据已附且可读来源。缺失时先说明；引用实际核实的章节/页码，区分原例、改编与自编，不虚构真题或必考内容。')
        if kind == 'lesson':
            lines.append('用中文从零讲解并保留必要英文术语，按“直观例子→定义→完整示范→易错点”组织，补充必要数学基础。计算展示选公式理由、符号、代入、中间结果与答案含义；附黑白打印公式速查、关键词索引及练习，答案另列。')
        else:
            lines.append(f'用中文出{count}道练习，覆盖来源支持的概念辨认、方法选择与应用，不强凑计算题。先列题，答案统一放后面，逐项解释选项，给解题步骤与出处，最后按错误类型给复习建议。')
        lines.append('说明来源的计算约定，独立复算数值；有矛盾时区分来源原值与复算值。')
    else:
        lines.append('Use only attached readable sources. Report gaps; cite verified sections/pages. Label source examples, adaptations, and new work. Never claim practice is a real/predicted exam.')
        if kind == 'lesson':
            lines.append('Teach in English from first principles: example, definition, worked application, common mistake. Explain prerequisites, formula choice, symbols, substitution, intermediate values, and meaning. Add a monochrome-printable formula lookup, keyword index, and practice with separate answers.')
        else:
            lines.append(f'Create {count} English questions covering recognition, method selection, and supported applications. Do not force calculations. Put answers after all questions; explain every option, show steps and sources, and recommend review by error type.')
        lines.append('State source conventions and recompute numbers. Separate source values from corrected calculations when they disagree.')
    prompt = '\n'.join(lines) + '\n'
    if max_chars is not None and len(prompt) > max_chars:
        raise ValueError(f'prompt has {len(prompt)} characters; budget is {max_chars}. Narrow scope or increase budget; no text was truncated.')
    return prompt


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('brief', type=Path)
    parser.add_argument('--kind', required=True, choices=('lesson', 'quiz'))
    parser.add_argument('--language', default='zh', choices=('zh', 'en'))
    parser.add_argument('--max-chars', type=int)
    args = parser.parse_args(argv)
    try:
        result = build_prompt(json.loads(args.brief.read_text(encoding='utf-8')), args.kind, args.language, args.max_chars)
    except (OSError, ValueError) as exc:
        print('Error: ' + str(exc), file=sys.stderr)
        return 2
    print(result, end='')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

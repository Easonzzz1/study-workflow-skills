# 学习工作流 Skills

把实际学习与资料整理中反复遇到的问题，整理成 AI Agent 可读取的工作流：核验资料导入、从零开始讲解、依据来源出题。

这是刚整理出的首个开源版本候选，尚无外部使用量或效果统计。它提供操作说明和离线提示词工具，不自动连接 Notebook、上传课件或调用模型。

## 四个工作流

- [资料导入核验](skills/source-import-check/SKILL.md)：使用现有笔记本；查重；逐份确认解析正文；准确报告失败和处理中项目。
- [零基础学习材料](skills/beginner-study-pack/SKILL.md)：先解释例子，再给定义、英文术语与完整计算过程，最后制作适合纸质查找的索引。
- [基于来源的测验](skills/grounded-quiz/SKILL.md)：限定范围，题目和答案分开，逐项解析，复算数值，不把自编题冒充真题。

- [概念关系图](skills/concept-map/SKILL.md)：区分层级、因果与跨分支联系，保留来源依据。

## 离线概念图工具

下载后打开 [index.html](tools/concept-map/index.html)，即可编辑、拖动或用方向键移动卡片、撤销、保存及导入 JSON。不调用模型，不自动保存。默认内容是合成比例示例。详见 [使用说明](docs/CONCEPT_MAP.md)。

## 直接使用

向能读取本地文件的 Agent 说：

> 读取 skills/grounded-quiz/SKILL.md，仅根据 examples/synthetic-source.md 出四道中文比例练习，答案统一放在题目后。不上传和发布文件。

也可以使用 Python 3.9+ 生成适合复制到输入框的独立提示词，无需安装依赖：

```sh
python3 scripts/build_prompt.py examples/brief.json --kind lesson --max-chars 1200
python3 scripts/build_prompt.py examples/brief.json --kind quiz --max-chars 1200
```

工具不会读取或上传 brief 中的来源，需要你自行附上资料。超过字数上限时直接报错，不静默删掉约束。中文为默认语言，`--language en` 可生成英文。

## 公开内容的边界

这里的示例均为新编虚构内容，没有上传历史聊天原文、真实课件、题库、录音、内部 SOP、学生信息或账号凭据。MIT 许可只覆盖仓库原创内容，不赋予任何第三方材料的转授权。

验证方法、贡献说明、当前限制见 [English README](README.md)、[隐私说明](docs/PRIVACY.md) 和 [评估用例](docs/EVALUATION.md)。

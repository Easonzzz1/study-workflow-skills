# Manual evaluation rubric

These are proposed cases, not measured model results. Record actual inputs, agent/version and outputs when running them.

| Case | Observable pass condition |
| --- | --- |
| Same filename, unknown version | Checks identity; avoids blind duplicate imports |
| Source entry exists, parsed body unavailable | Reports processing/unverified rather than complete |
| Included A–B, excluded C | Teaches A–B only |
| Fictional source says 3/5 = 70% | Separates source error from recomputed 60% |
| Markdown source without page numbers | Cites actual headings |
| Source label present, attachment missing | Reports missing source |
| Counter quiz | Uses whole=5 and blue share=60%; explains 150% distractor |
| Prompt budget too small | CLI exits nonzero with no partial prompt |

Unit tests cover helper behavior, not learning outcomes or service integrations.

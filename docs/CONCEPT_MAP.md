# Offline concept map / 离线概念关系图

Open [the tool](../tools/concept-map/index.html) from a downloaded checkout in a
modern browser. Keep `index.html`, `style.css` and `app.js` together. No packages,
account, external fonts, model calls or server are required for normal use.
If local-file restrictions prevent loading, serve this repository locally with
`python3 -m http.server 8765 --bind 127.0.0.1` and visit
`http://127.0.0.1:8765/tools/concept-map/`.

This general tool grew out of a draggable study mind-map task. The original
subject-specific map and chat are not included. Its default ratio example is
synthetic and points to [the synthetic source](../examples/synthetic-source.md).

## 使用方式 / Use

Select a card to edit its title, note, source location and parent relationship;
click Apply. Drag a card or focus it and use arrow keys. Add creates a child of
the selected card. Delete removes a node and its attached edges. Undo retains
up to 40 previous graph states within this page session. Editing a parent
replaces all incoming edges of that node; other outgoing edges remain.

Save downloads the current applied graph as JSON. Import replaces the current
graph after validation and can be undone. Unapplied form edits are not exported.
There is no automatic storage: closing or reloading loses changes not saved to
a file. Keep the JSON private if it contains non-public notes. Printing uses
the browser dialog; check preview and paper size before printing large maps.

## JSON schema

```json
{
  "version": 1,
  "nodes": [{"id":"a","title":"Concept","note":"Evidence or explanation","source":"Source A, section 1","x":60,"y":70}],
  "edges": []
}
```

Each edge is `{"from":"a","to":"b","label":"relationship meaning"}`.
Nodes need unique nonempty IDs (80 characters max), titles (120 max, nonblank),
notes (2,000 max) and source labels (300 max). Positions are finite numbers:
`0 <= x <= 2160`, `0 <= y <= 1440`. The canvas is 2400 × 1600 pixels. Import
accepts up to 100 nodes and 250 directed edges in a file up to 1 MB. Missing
endpoints, self-edges and duplicate directed pairs are rejected. Cycles and
multiple parents are allowed; they may be meaningful concept relationships.
Editing one node's parent deliberately reduces its incoming edges to zero or
one. Extra fields are discarded. Strings render as literal text, not HTML.

## Verification

`node tools/concept-map/test.cjs` runs eight data validation cases with Node.js
18+ and its built-in assertions. Python helpers remain dependency-free; Node is
only needed for this JavaScript check. Browser checks should cover card edits,
keyboard/pointer movement, undo, export/reimport and rejection of malformed data.
Graph validation does not establish factual correctness or accessibility across
all assistive technologies. No external use or learning-effect measurements are
claimed.

Observed on 2026-10-21 in the local in-app browser: title edit, arrow-key movement, add/delete, undo, pointer drag (60,70 to 120,120) and JSON download/reimport preserved the edited graph. Eight pure-data cases and seven Python tests passed. Print pagination and screen-reader interaction were not tested.

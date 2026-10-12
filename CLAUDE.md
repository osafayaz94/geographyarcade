# Notes for Claude

## Model choice (Sonnet or Opus)

The owner works on Sonnet by default. Do the task on the current model without asking. Only when a
task really needs Opus, say so in one line at the start ("This one is worth Opus: switch with
`/model`") and give the reason, then wait. Worth Opus: changes that touch many files or the whole
build, date or time calculations and other logic where a mistake is costly, security or consent
code, a new feature designed from scratch, or a bug that has resisted one or two fixes. Everything
else (copy, translations, styling, page tweaks, small fixes) stays on Sonnet.

## Graphify (save tokens)

Use the Graphify knowledge graph to find code instead of reading files one by one. If
`graphify-out/` exists, read `graphify-out/GRAPH_REPORT.md` first, and use it (or `graph.json`)
to go straight to the few files a task needs. Only open whole files when the graph is not enough.
If `graphify-out/` is missing (for example in a fresh cloud session) and the task needs a broad look
at the code, suggest running `/graphify .` once instead of reading the whole repo. After a big
change, refresh the map with `/graphify . --update`. Keep `graphify-out/` out of git.

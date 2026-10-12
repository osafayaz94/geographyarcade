# Notes for Claude

## Model choice (Sonnet or Opus)

The owner works on Sonnet by default. Do the task on the current model without asking. Only when a
task really needs Opus, say so in one line at the start ("This one is worth Opus: switch with
`/model`") and give the reason, then wait. Worth Opus: changes that touch many files or the whole
build, date or time calculations and other logic where a mistake is costly, security or consent
code, a new feature designed from scratch, or a bug that has resisted one or two fixes. Everything
else (copy, translations, styling, page tweaks, small fixes) stays on Sonnet.

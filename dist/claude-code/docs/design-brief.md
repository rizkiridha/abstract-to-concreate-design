# /design:brief

**Description:** Generate or regenerate `DESIGN-BRIEF.md` from existing agent outputs. Use after adding more context without re-running all agents.

**Usage:**
```
/design:brief
```

**Arguments:** None.

**Pre-requisites:** All 4 agent outputs must exist in `.design/research/`. Run `/design:run` first if they don't.

**Expected output:** Updated `.design/DESIGN-BRIEF.md`

**Use this when:** You've added context via `/design:feed` and want to refresh the brief without re-running all agents.

**Use `/design:run` when:** You want to fully re-run all agents with updated context.

**Platforms:** Claude Code, OpenCode CLI

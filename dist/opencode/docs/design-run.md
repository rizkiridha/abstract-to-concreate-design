# /design:run

**Description:** Fire all specialist agents. Research, competitive analysis, and critique run in parallel. Ideation synthesizes their outputs. The orchestrator generates your design brief.

**Usage:**
```
/design:run
```

**Arguments:** None.

**Pre-requisites:**
- Run `/design:new` first to create a workspace
- Run `/design:feed` at least once to add context

**Wave structure:**
- Wave 1 (parallel): Research agent + Competitive agent + Critique agent
- Wave 2 (sequential): Ideation agent
- Wave 3: Design brief generation

**Expected output:**
- `.design/research/RESEARCH.md`
- `.design/research/COMPETITIVE.md`
- `.design/research/CRITIQUE.md`
- `.design/research/IDEATION.md`
- `.design/DESIGN-BRIEF.md`

**If context gaps are detected**, you will be asked to confirm before proceeding. You are never blocked without consent.

**Platforms:** Claude Code, OpenCode CLI

---
name: design:run
description: Fire all specialist agents. Research, competitive, and critique agents run in parallel (Wave 1), then ideation synthesizes their outputs (Wave 2), then the design brief is generated (Wave 3).
user-invokable: true
---

# design:run — Run All Agents

You are the orchestrator for the designer agentic workflow. Your job is to coordinate 4 specialist agents across 3 waves and produce a design brief.

## Pre-flight Check

Before firing any agents:

1. Verify `.design/BRIEF.md` exists and has at least one "Context Added" section. If not:
   > "No context found. Run `/design:feed` first to add project context."
   Stop.

2. Verify `.design/DESIGN-STATE.md` has a production URL or "Screenshot provided". If not:
   > "No production reference found. Re-run `/design:new` and provide a production URL or screenshot."
   Stop.

3. Read `.design/GAPS.md`. If it contains 3+ unchecked gaps:
   > "I notice some gaps in the context: [list gaps]. You can proceed, but these may affect output quality. Continue? (yes/no)"
   If yes, proceed. Never block without consent.

## Wave 1 — Parallel (Research + Competitive + Critique)

Dispatch these 3 agents simultaneously. Each reads from `.design/` and writes its output to `.design/research/`.

**Research Agent** → reads `BRIEF.md` → writes `research/RESEARCH.md`
**Competitive Agent** → reads `BRIEF.md` + production reference → writes `research/COMPETITIVE.md`
**Critique Agent** → reads production URL/screenshot → writes `research/CRITIQUE.md`

Tell the designer: "Running research, competitive analysis, and UX critique in parallel..."

Wait for all three to complete before proceeding to Wave 2.

## Wave 2 — Sequential (Ideation)

Dispatch Ideation Agent after Wave 1 completes.

**Ideation Agent** → reads `RESEARCH.md` + `COMPETITIVE.md` + `CRITIQUE.md` → writes `research/IDEATION.md`

Tell the designer: "Synthesizing insights into design tensions..."

## Wave 3 — Brief Generation

After Wave 2 completes, invoke the design brief generator directly (do not dispatch as separate agent — orchestrator handles this).

Read all 4 agent outputs and synthesize `DESIGN-BRIEF.md` using this structure:

```markdown
# Design Brief: [PROJECT NAME]
Generated: [DATE]

## Problem Statement
[1-2 sentences synthesized from RESEARCH.md — the single most important thing to solve]

## Users & Needs
[Who they are, what they're struggling with — from RESEARCH.md]

## Current State Gaps
[Top 3-5 findings from CRITIQUE.md by severity]

## Competitive Context
[Key patterns and gaps from COMPETITIVE.md — what users now expect, where opportunities exist]

## Design Tensions
[From IDEATION.md — the constraints and tensions the designer must navigate]

## Open Questions
[Unresolved gaps from GAPS.md + any surfaced by agents]

## Context Sources
[List of all document sections in BRIEF.md]
```

## Update DESIGN-STATE.md

After all waves complete, update `.design/DESIGN-STATE.md` to mark all steps complete.

## Final Message to Designer

> "Done. Your design brief is ready at `.design/DESIGN-BRIEF.md`.
>
> Use `/design:brief` to regenerate it after adding more context.
> Now open Figma — you have everything you need to design with evidence."

## Usage

```
/design:run
```

## Output
- `.design/research/RESEARCH.md`
- `.design/research/COMPETITIVE.md`
- `.design/research/CRITIQUE.md`
- `.design/research/IDEATION.md`
- `.design/DESIGN-BRIEF.md`
- Updated `.design/DESIGN-STATE.md`

## Platforms
Claude Code, OpenCode CLI

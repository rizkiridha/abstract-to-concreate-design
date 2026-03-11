# Designer Agentic Workflow — Design Spec

**Date:** 2026-03-11
**Status:** Approved
**Repo:** https://github.com/rizkiridha/abstract-to-concreate-design.git

---

## Purpose

An agentic CLI workflow that helps designers move from abstract problem space to concrete design with evidence. The designer feeds context iteratively, specialist agents research and critique in parallel, and the output is a design brief the designer takes into Figma.

**Core principle:** Agents sharpen the designer's thinking — they never replace it. Every output is raw material for the designer's judgment, not a directive.

**Goal:** Designers can document and defend their design decisions based on proven research and feedback, building the habit of evidence-based design while learning to use AI as part of their process.

---

## Architecture

**Pattern:** Workspace-first CLI with thin orchestrator + specialist agents

- Thin orchestrator (~15% context) manages routing and wave scheduling
- Each specialist agent gets a fresh 100% context window (prevents context rot)
- Persistent workspace state lives in `.design/` directory across sessions
- Multi-platform: Claude Code and OpenCode CLI

### Workspace Structure

```
.design/
  BRIEF.md          ← accumulates all pasted context (MoMs, emails, chats, docs)
  GAPS.md           ← agent reflection: what's understood + what's missing
  DESIGN-STATE.md   ← current decisions, what's been run, what's pending
  research/
    RESEARCH.md     ← research agent output
    COMPETITIVE.md  ← competitive agent output
    CRITIQUE.md     ← critique agent output
    IDEATION.md     ← ideation agent output (reframed problem + tensions)
  DESIGN-BRIEF.md   ← final synthesized output, feeds into design ops
```

### Wave Structure

| Wave | Agents | Trigger |
|------|--------|---------|
| Wave 0 | Context feeding (iterative) | Designer manually adds context |
| Wave 1 | Research + Competitive + Critique (parallel) | Designer runs `/design:run` |
| Wave 2 | Ideation (sequential, reads Wave 1 outputs) | Auto after Wave 1 completes |
| Wave 3 | Brief generation | Auto after Wave 2 completes |

---

## CLI Entry Points

### `/design:new`
**Description:** Create a new design project workspace.
**Prompts for:**
- Project name
- One-line description of what's being designed
- Production URL or screenshot of the current product (required for critique agent)
**Output:** `.design/` directory initialized with empty `BRIEF.md`, `GAPS.md`, `DESIGN-STATE.md`
**Platforms:** Claude Code, OpenCode CLI

---

### `/design:feed`
**Description:** Add context to the project workspace. Paste any raw material — MoMs, emails, Slack threads, research docs, stakeholder notes. Agent updates `BRIEF.md` and refreshes `GAPS.md` to reflect what's understood and what's missing.
**Usage:** `/design:feed`
**Arguments:** None. Prompted to paste content.
**Output:**
- Updated `BRIEF.md`
- Refreshed `GAPS.md` with reflection + gap list
- Agent prompt: "Here's what I understand so far. I'm missing context on: [X, Y, Z]. Do you want to add more before running agents?"
**Platforms:** Claude Code, OpenCode CLI

---

### `/design:run`
**Description:** Fire all specialist agents. Runs Wave 1 (parallel), Wave 2, and Wave 3 sequentially, then generates `DESIGN-BRIEF.md`.
**Usage:** `/design:run`
**Arguments:** None.
**Output:**
- `research/RESEARCH.md`
- `research/COMPETITIVE.md`
- `research/CRITIQUE.md`
- `research/IDEATION.md`
- `DESIGN-BRIEF.md`
**Platforms:** Claude Code, OpenCode CLI

---

### `/design:brief`
**Description:** Generate or regenerate `DESIGN-BRIEF.md` from existing agent outputs. Use when you've added context and want to refresh the brief without re-running all agents.
**Usage:** `/design:brief`
**Arguments:** None.
**Output:** Updated `DESIGN-BRIEF.md`
**Platforms:** Claude Code, OpenCode CLI

---

### `/design:status`
**Description:** Show current workspace state — what context has been fed, which agents have run, what gaps remain.
**Usage:** `/design:status`
**Output:** Summary of `DESIGN-STATE.md` and `GAPS.md`
**Platforms:** Claude Code, OpenCode CLI

---

## Agent Definitions

### Agent 1: Research Agent (Wave 1)

**Input:** `BRIEF.md`
**Job:** Synthesize pasted context into a structured UX problem statement.
**Output (`RESEARCH.md`):**
- Problem statement (1-2 sentences, designer-facing)
- Key user needs surfaced from the data
- Decisions already made (constraints the designer must respect)
- Unresolved questions (feeds into `GAPS.md`)

**Principle:** No solutions. No directions. Only "here's what the data says the problem is."

---

### Agent 2: Competitive Agent (Wave 1)

**Input:** `BRIEF.md` + production URL or screenshot
**Job:** Map the competitive landscape and identify gaps/patterns relative to the current product.
**Output (`COMPETITIVE.md`):**
- Landscape overview (who's solving this, how)
- Patterns that have become table stakes (what users now expect)
- Gaps and opportunities (where competitors are weak or absent)
- Relevant interaction patterns worth being aware of

**Principle:** Descriptive, not prescriptive. "Here's what exists" — not "copy this."

---

### Agent 3: Critique Agent (Wave 1)

**Input:** Production URL or screenshot
**Job:** Audit the current UX. Built on Impeccable's `/critique` + `/audit` skills.
**Output (`CRITIQUE.md`):**
- AI-slop detection pass (weak baseline check)
- UX failures by severity: Critical / High / Medium / Low
- Accessibility and interaction state gaps
- Systemic patterns (recurring issues, not one-offs)
- What's working well (preserve these)

**Principle:** Evidence-based, not opinionated. Every finding references a specific location/component.

---

### Agent 4: Ideation Agent (Wave 2)

**Input:** `RESEARCH.md` + `COMPETITIVE.md` + `CRITIQUE.md`
**Job:** Synthesize all three into a reframed problem and surface design tensions. No directions, no solutions.
**Output (`IDEATION.md`):**
- Reframed problem statement ("what you're actually designing for")
- Design tensions (e.g., "simplicity vs. power user needs")
- Open provocations (e.g., "what if the user never had to think about X?")
- Constraints inherited from research + critique

**Principle:** Raw material for the designer's thinking. Deliberately incomplete. Ends with questions, not answers.

---

## Design Brief Output

Generated by orchestrator after all agents complete. Slots into existing design ops process.

```markdown
# Design Brief: [Project Name]
Generated: [date]

## Problem Statement
[Synthesized from RESEARCH.md]

## Users & Needs
[Who they are, what they're struggling with]

## Current State Gaps
[Top findings from CRITIQUE.md]

## Competitive Context
[Key patterns and gaps from COMPETITIVE.md]

## Design Tensions
[From IDEATION.md — constraints the designer must navigate]

## Open Questions
[Unresolved gaps to keep in mind while designing]

## Context Sources
[List of all documents the designer fed in]
```

---

## Distribution Structure

Multi-platform, following Impeccable's distribution pattern.

```
source/
  skills/         ← platform-agnostic skill definitions (SKILL.md per skill)
  commands/       ← workflow command definitions
  docs/           ← CLI usage documentation per entry point
dist/
  claude-code/    ← Claude Code distribution
  opencode/       ← OpenCode CLI distribution
.claude-plugin/
  plugin.json
  marketplace.json
README.md
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Designer manually pastes context | Intentional — keeps the designer engaged with the material, not outsourcing thinking |
| Gaps visible, not blocking | Don't gate on "enough context" — surface what's missing, let designer decide |
| Ideation outputs tensions not directions | Protects designer judgment, prevents anchoring to AI framing |
| Production URL/screenshot for critique (not Figma API) | Reflects reality of what shipped, not what was designed; Figma API reserved for code generation phase |
| Wave-based parallelism | Research, competitive, critique are independent — no reason to run sequentially |
| Thin orchestrator pattern | Prevents context rot; each specialist agent gets full context window |
| Design brief as final output | Integrates into existing design ops artifact; evidence-based, not manually written |

---

## What This Is Not

- Not a replacement for design judgment — every output is raw material
- Not a fully automated pipeline — designer controls when to feed, when to run, when to proceed
- Not prescriptive — no agent tells the designer what to build
- Not Figma-integrated in this phase — Figma API is scoped to the code generation phase

---

## Future Phases (Out of Scope Here)

- Phase 2: Design → Generate design to code
- Phase 3: Code review
- Phase 4: Pass to tech (handoff)
- Figma API integration (design-to-code phase)
- Marketplace distribution of skills

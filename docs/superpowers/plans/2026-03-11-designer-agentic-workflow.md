# Designer Agentic Workflow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a workspace-first CLI skill plugin that gives designers an evidence-based design brief through 4 specialist agents (research, competitive, critique, ideation) running in parallel waves.

**Architecture:** Thin orchestrator pattern — 5 user-facing commands manage a `.design/` workspace directory. Three specialist agents run in parallel (Wave 1), one synthesizes their outputs (Wave 2), orchestrator generates the final design brief (Wave 3). Skill definitions live in `source/skills/`, distributed to `dist/claude-code/` and `dist/opencode/` via a build script.

**Tech Stack:** SKILL.md prompt files, bash build script, JSON plugin config (plugin.json + marketplace.json), platform targets: Claude Code + OpenCode CLI.

**Spec:** `docs/superpowers/specs/2026-03-11-designer-agentic-workflow-design.md`

**Target repo:** https://github.com/rizkiridha/abstract-to-concreate-design.git

---

## Chunk 1: Project Scaffold

### Task 1: Initialize directory structure

**Files:**
- Create: `source/skills/design-new/SKILL.md`
- Create: `source/skills/design-feed/SKILL.md`
- Create: `source/skills/design-run/SKILL.md`
- Create: `source/skills/design-brief/SKILL.md`
- Create: `source/skills/design-status/SKILL.md`
- Create: `source/skills/agents/research/SKILL.md`
- Create: `source/skills/agents/competitive/SKILL.md`
- Create: `source/skills/agents/critique/SKILL.md`
- Create: `source/skills/agents/ideation/SKILL.md`
- Create: `source/skills/agents/orchestrator/SKILL.md`
- Create: `source/docs/design-new.md`
- Create: `source/docs/design-feed.md`
- Create: `source/docs/design-run.md`
- Create: `source/docs/design-brief.md`
- Create: `source/docs/design-status.md`
- Create: `dist/claude-code/` (directory, populated by build script)
- Create: `dist/opencode/` (directory, populated by build script)
- Create: `.claude-plugin/plugin.json`
- Create: `.claude-plugin/marketplace.json`
- Create: `scripts/build.sh`
- Create: `scripts/validate.sh`
- Create: `README.md`

- [ ] **Step 1: Create all directories**

```bash
mkdir -p source/skills/design-new
mkdir -p source/skills/design-feed
mkdir -p source/skills/design-run
mkdir -p source/skills/design-brief
mkdir -p source/skills/design-status
mkdir -p source/skills/agents/research
mkdir -p source/skills/agents/competitive
mkdir -p source/skills/agents/critique
mkdir -p source/skills/agents/ideation
mkdir -p source/skills/agents/orchestrator
mkdir -p source/docs
mkdir -p dist/claude-code
mkdir -p dist/opencode
mkdir -p .claude-plugin
mkdir -p scripts
```

Expected: all directories created, no errors.

- [ ] **Step 2: Create `scripts/validate.sh`** — validates all SKILL.md files have required sections before building

```bash
#!/bin/bash
# Validates all SKILL.md files have required sections

ERRORS=0
REQUIRED_SECTIONS=("description" "usage" "output")

find source/skills -name "SKILL.md" | while read file; do
  for section in "${REQUIRED_SECTIONS[@]}"; do
    if ! grep -qi "$section" "$file"; then
      echo "ERROR: $file missing required section: $section"
      ERRORS=$((ERRORS + 1))
    fi
  done
  echo "OK: $file"
done

if [ $ERRORS -gt 0 ]; then
  echo "Validation failed with $ERRORS error(s)"
  exit 1
fi

echo "All SKILL.md files valid."
```

- [ ] **Step 3: Make validate.sh executable and run it**

```bash
chmod +x scripts/validate.sh
bash scripts/validate.sh
```

Expected: exits 0 with no output — `find` returns no files so the loop never runs and ERRORS stays 0. This is expected at this stage. SKILL.md files are written in later tasks.

- [ ] **Step 4: Create `.claude-plugin/plugin.json`**

```json
{
  "name": "abstract-to-concrete-design",
  "version": "1.0.0",
  "description": "Agentic workflow for designers — from abstract problem space to evidence-based design brief. Research, competitive analysis, and UX critique run in parallel to produce a design brief before you open Figma.",
  "author": "rizkiridha",
  "skills": "../source/skills",
  "docs": "../source/docs"
}
```

- [ ] **Step 5: Create `.claude-plugin/marketplace.json`**

```json
{
  "name": "abstract-to-concrete-design",
  "description": "Evidence-based design brief workflow for designers. Feed context, run parallel agents, get a design brief — before you open Figma.",
  "category": "design",
  "tags": ["design", "ux", "research", "design-brief", "agentic"],
  "platforms": ["claude-code", "opencode"],
  "entry": "design:new"
}
```

- [ ] **Step 6: Commit scaffold**

```bash
git add .claude-plugin/ scripts/ dist/ source/
git commit -m "chore: scaffold project structure and plugin config"
```

---

### Task 2: Create `scripts/build.sh`

**Files:**
- Modify: `scripts/build.sh`

The build script copies skills from `source/` to each platform's `dist/` directory. Platform-specific differences (if any) are handled here.

- [ ] **Step 1: Write `scripts/build.sh`**

```bash
#!/bin/bash
# Builds dist/ for each platform target from source/

set -e

PLATFORMS=("claude-code" "opencode")
SOURCE_DIR="source"
DIST_DIR="dist"

echo "Validating source..."
bash scripts/validate.sh

for platform in "${PLATFORMS[@]}"; do
  echo "Building for $platform..."
  TARGET="$DIST_DIR/$platform"

  # Clean and recreate target
  rm -rf "$TARGET"
  mkdir -p "$TARGET/skills"
  mkdir -p "$TARGET/docs"

  # Copy skills
  cp -r "$SOURCE_DIR/skills/"* "$TARGET/skills/"

  # Copy docs
  cp -r "$SOURCE_DIR/docs/"* "$TARGET/docs/"

  # Copy plugin config
  cp ".claude-plugin/plugin.json" "$TARGET/"
  cp ".claude-plugin/marketplace.json" "$TARGET/"

  echo "Built $platform -> $TARGET"
done

echo "Build complete."
```

- [ ] **Step 2: Make executable**

```bash
chmod +x scripts/build.sh
```

- [ ] **Step 3: Run build (run after all SKILL.md files are written in later tasks)**

```bash
bash scripts/build.sh
```

Note: running this before any SKILL.md files are written will fail on `cp -r source/skills/*` due to empty glob. This step is a smoke test for the script itself — full build is validated in Task 14.

Expected: validates, copies files, prints "Build complete."

- [ ] **Step 4: Commit**

```bash
git add scripts/build.sh
git commit -m "chore: add build script for multi-platform distribution"
```

---

## Chunk 2: Workspace Command Skills (design:new, design:feed, design:status)

### Task 3: Write `design:new` skill

**Files:**
- Modify: `source/skills/design-new/SKILL.md`
- Modify: `source/docs/design-new.md`

- [ ] **Step 1: Write `source/skills/design-new/SKILL.md`**

```markdown
---
name: design:new
description: Create a new design project workspace. Initializes the .design/ directory and prompts for project context before any agents run.
user-invokable: true
---

# design:new — New Design Project

You are helping a designer start a new design project. Your job is to initialize a workspace and collect the minimum context needed before research agents can run.

## What You Do

1. Ask for the project name
2. Ask for a one-line description of what's being designed
3. Ask for a production URL **or** request a screenshot of the current product (required for the critique agent — without it, the critique step cannot run)
4. Create the `.design/` workspace directory with starter files
5. Confirm the workspace is ready and explain the next step

## Workspace Files to Create

Create these files in `.design/`:

**BRIEF.md:**
```
# Design Brief Context: [PROJECT_NAME]
Created: [DATE]
Description: [ONE_LINE_DESCRIPTION]
Production URL: [URL or "Screenshot provided"]

---
## Pasted Context

(Designer will add context here using /design:feed)
```

**GAPS.md:**
```
# Gaps & Understanding
Last updated: [DATE]

## What I Understand So Far
(Will be populated after first /design:feed)

## What's Missing
(Will be populated after first /design:feed)
```

**DESIGN-STATE.md:**
```
# Design State: [PROJECT_NAME]
Created: [DATE]

## Status
- [ ] Context feeding (use /design:feed to add context)
- [ ] Agents run (use /design:run when ready)
- [ ] Design brief generated

## Production Reference
URL: [URL or "Screenshot provided"]

## Agent Outputs
- Research: pending
- Competitive: pending
- Critique: pending
- Ideation: pending
- Design Brief: pending
```

Also create `research/` subdirectory inside `.design/`.

## After Creating Workspace

Tell the designer:
> "Workspace created. Use `/design:feed` to paste your context — MoMs, emails, research docs, stakeholder notes. When you've added enough, run `/design:run` to fire all agents."

## Usage

```
/design:new
```

No arguments. All inputs are collected through prompts.

## Output

- `.design/BRIEF.md`
- `.design/GAPS.md`
- `.design/DESIGN-STATE.md`
- `.design/research/` directory

## Platforms
Claude Code, OpenCode CLI
```

- [ ] **Step 2: Write `source/docs/design-new.md`**

```markdown
# /design:new

**Description:** Create a new design project workspace. Initializes the `.design/` directory and collects minimum context before any agents run.

**Usage:**
```
/design:new
```

**Arguments:** None. You will be prompted for:
- Project name
- One-line description of what you're designing
- Production URL or screenshot of the current product

**Expected output:**
- `.design/BRIEF.md` — context accumulator
- `.design/GAPS.md` — understanding + gap tracker
- `.design/DESIGN-STATE.md` — workflow state
- `.design/research/` — directory for agent outputs

**Next step:** Use `/design:feed` to start adding context.

**Platforms:** Claude Code, OpenCode CLI
```

- [ ] **Step 3: Run validate.sh — expect it to pass for design-new**

```bash
bash scripts/validate.sh
```

Expected: `OK: source/skills/design-new/SKILL.md`

- [ ] **Step 4: Commit**

```bash
git add source/skills/design-new/ source/docs/design-new.md
git commit -m "feat: add design:new command skill"
```

---

### Task 4: Write `design:feed` skill

**Files:**
- Modify: `source/skills/design-feed/SKILL.md`
- Modify: `source/docs/design-feed.md`

- [ ] **Step 1: Write `source/skills/design-feed/SKILL.md`**

```markdown
---
name: design:feed
description: Add context to the design project workspace. Paste MoMs, emails, Slack threads, research docs, or stakeholder notes. Agent reflects back understanding and surfaces gaps.
user-invokable: true
---

# design:feed — Feed Context

You are helping a designer accumulate project context before running research agents. Your job is to ingest pasted content, update the workspace, and reflect back what you understand — including what's still missing.

## What You Do

1. Ask the designer to paste their content (MoM, email, chat, research doc, etc.)
2. Ingest the content
3. Append it to `.design/BRIEF.md` under a new dated section
4. Analyze the full contents of `BRIEF.md` and update `.design/GAPS.md`:
   - **What I understand:** summarize the problem, users, constraints, decisions made
   - **What's missing:** list specific gaps (e.g., "no user research data", "no competitor context", "unclear what success looks like")
5. Ask: "Is there more context you'd like to add, or are you ready to run the agents?"

## Gap Detection Heuristics

Surface gaps if any of these are missing from the accumulated context:
- Who the users are and what they're struggling with
- What has already been decided (constraints the designer must respect)
- What problem this is solving from a business perspective
- Any prior user research or feedback
- Technical constraints
- Success criteria

Do NOT block the designer from proceeding. Surface gaps, let them decide.

## Updating BRIEF.md

Append to `.design/BRIEF.md`:

```
---
## Context Added: [DATE TIME]
Source: [brief label e.g. "MoM - Product Sync 2026-03-10"]

[PASTED CONTENT]
```

## Updating GAPS.md

Overwrite `.design/GAPS.md` entirely with fresh analysis:

```
# Gaps & Understanding
Last updated: [DATE TIME]

## What I Understand So Far
[Concise summary of problem, users, constraints, decisions from all BRIEF.md content]

## What's Missing
[Specific gap list — be concrete, not vague]
- [ ] [Gap 1]
- [ ] [Gap 2]
...

## Recommendation
[One sentence: "You have enough to run agents" OR "Consider adding [specific thing] before running"]
```

## Usage

```
/design:feed
```

No arguments. You will be prompted to paste your content.

## Output
- Updated `.design/BRIEF.md`
- Updated `.design/GAPS.md`

## Platforms
Claude Code, OpenCode CLI
```

- [ ] **Step 2: Write `source/docs/design-feed.md`**

```markdown
# /design:feed

**Description:** Add context to your project workspace. Paste any raw material — MoMs, emails, Slack threads, research docs, stakeholder notes. The agent updates `BRIEF.md` and refreshes `GAPS.md` to show what's understood and what's still missing.

**Usage:**
```
/design:feed
```

**Arguments:** None. You will be prompted to paste your content.

**Expected output:**
- Updated `.design/BRIEF.md` with new section
- Updated `.design/GAPS.md` with fresh understanding summary + gap list

**You can run this multiple times.** Context accumulates across sessions.

**The agent will not block you from proceeding.** Gaps are surfaced as information, not gates.

**Platforms:** Claude Code, OpenCode CLI
```

- [ ] **Step 3: Run validate.sh**

```bash
bash scripts/validate.sh
```

Expected: both design-new and design-feed show OK.

- [ ] **Step 4: Commit**

```bash
git add source/skills/design-feed/ source/docs/design-feed.md
git commit -m "feat: add design:feed command skill"
```

---

### Task 5: Write `design:status` skill

**Files:**
- Modify: `source/skills/design-status/SKILL.md`
- Modify: `source/docs/design-status.md`

- [ ] **Step 1: Write `source/skills/design-status/SKILL.md`**

```markdown
---
name: design:status
description: Show current workspace state — what context has been fed, which agents have run, what gaps remain.
user-invokable: true
---

# design:status — Workspace Status

You are giving the designer a clear picture of where they are in the workflow.

## What You Do

1. Read `.design/DESIGN-STATE.md`
2. Read `.design/GAPS.md`
3. Check which agent output files exist in `.design/research/`
4. Print a concise status summary

## Status Output Format

```
# Design Workspace Status
Project: [from BRIEF.md header]

## Workflow Progress
- [x/o] Context fed       — [N sections in BRIEF.md]
- [x/o] Agents run        — [which agents have completed]
- [x/o] Design brief      — [exists or pending]

## Current Gaps
[contents of GAPS.md "What's Missing" section, or "None — ready to run"]

## Next Step
[one clear action: "/design:feed to add more context" | "/design:run to fire agents" | "Open DESIGN-BRIEF.md in Figma"]
```

Use `x` for completed, `o` for pending.

## If No Workspace Found

If `.design/` does not exist:
> "No workspace found. Run `/design:new` to create one."

## Usage

```
/design:status
```

## Output
Printed status summary. No files modified.

## Platforms
Claude Code, OpenCode CLI
```

- [ ] **Step 2: Write `source/docs/design-status.md`**

```markdown
# /design:status

**Description:** Show current workspace state — what context has been fed, which agents have run, what gaps remain, and what to do next.

**Usage:**
```
/design:status
```

**Arguments:** None.

**Expected output:** Printed summary showing workflow progress, current gaps, and next recommended action.

**No files are modified by this command.**

**Platforms:** Claude Code, OpenCode CLI
```

- [ ] **Step 3: Run validate.sh**

```bash
bash scripts/validate.sh
```

Expected: design-new, design-feed, design-status all OK.

- [ ] **Step 4: Commit**

```bash
git add source/skills/design-status/ source/docs/design-status.md
git commit -m "feat: add design:status command skill"
```

---

## Chunk 3: Run & Brief Command Skills

### Task 6: Write `design:run` skill

**Files:**
- Modify: `source/skills/design-run/SKILL.md`
- Modify: `source/docs/design-run.md`

This is the most complex command — it triggers the orchestrator which fires all agents in waves.

- [ ] **Step 1: Write `source/skills/design-run/SKILL.md`**

```markdown
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
```

- [ ] **Step 2: Write `source/docs/design-run.md`**

```markdown
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
```

- [ ] **Step 3: Run validate.sh**

```bash
bash scripts/validate.sh
```

Expected: all 4 commands OK.

- [ ] **Step 4: Commit**

```bash
git add source/skills/design-run/ source/docs/design-run.md
git commit -m "feat: add design:run orchestrator command skill"
```

---

### Task 7: Write `design:brief` skill

**Files:**
- Modify: `source/skills/design-brief/SKILL.md`
- Modify: `source/docs/design-brief.md`

- [ ] **Step 1: Write `source/skills/design-brief/SKILL.md`**

```markdown
---
name: design:brief
description: Generate or regenerate DESIGN-BRIEF.md from existing agent outputs. Use after adding more context with /design:feed without re-running all agents.
user-invokable: true
---

# design:brief — Generate Design Brief

You are regenerating the design brief from already-completed agent outputs.

## Pre-flight Check

Verify these files exist in `.design/research/`:
- `RESEARCH.md`
- `COMPETITIVE.md`
- `CRITIQUE.md`
- `IDEATION.md`

If any are missing:
> "Missing agent outputs: [list]. Run `/design:run` first to generate all agent outputs."
Stop.

## What You Do

Read all 4 agent output files and synthesize a fresh `DESIGN-BRIEF.md`:

```markdown
# Design Brief: [PROJECT NAME]
Generated: [DATE]

## Problem Statement
[1-2 sentences from RESEARCH.md]

## Users & Needs
[From RESEARCH.md]

## Current State Gaps
[Top findings from CRITIQUE.md]

## Competitive Context
[From COMPETITIVE.md]

## Design Tensions
[From IDEATION.md]

## Open Questions
[From GAPS.md + agent outputs]

## Context Sources
[All document sections in BRIEF.md]
```

Tell the designer:
> "Design brief updated at `.design/DESIGN-BRIEF.md`."

## When to Use This

Use `/design:brief` when:
- You've added more context via `/design:feed` and want to update the brief
- The brief feels stale after design discussions
- You want to regenerate without re-running agents (agents are not re-dispatched)

Use `/design:run` when you want to re-run all agents with fresh context.

## Usage

```
/design:brief
```

## Output
- Updated `.design/DESIGN-BRIEF.md`

## Platforms
Claude Code, OpenCode CLI
```

- [ ] **Step 2: Write `source/docs/design-brief.md`**

```markdown
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
```

- [ ] **Step 3: Run validate.sh**

```bash
bash scripts/validate.sh
```

Expected: all 5 commands OK.

- [ ] **Step 4: Commit**

```bash
git add source/skills/design-brief/ source/docs/design-brief.md
git commit -m "feat: add design:brief regeneration command skill"
```

---

## Chunk 4: Specialist Agent Skills (Research, Competitive, Critique)

### Task 8: Write Research Agent skill

**Files:**
- Modify: `source/skills/agents/research/SKILL.md`

- [ ] **Step 1: Write `source/skills/agents/research/SKILL.md`**

```markdown
---
name: design-agent-research
description: Specialist agent — synthesizes pasted context from BRIEF.md into a structured UX problem statement. Outputs RESEARCH.md. Dispatched by design:run orchestrator.
user-invokable: false
---

# Research Agent

You are a UX research synthesis specialist. Your job is to read the designer's accumulated context and extract the core problem — nothing more.

## Input

Read `.design/BRIEF.md` in full.

## Your One Job

Surface what the data says the problem is. No solutions. No design directions. No recommendations. Only: "here is what the evidence says you are designing for."

## Output Structure

Write `.design/research/RESEARCH.md`:

```markdown
# Research Synthesis
Generated: [DATE]

## Problem Statement
[1-2 sentences maximum. What is the core UX problem this design needs to solve?
Write this as a designer would say it — concrete, user-facing, not business-speak.]

## Who Are the Users
[Based on context provided — who is experiencing this problem?
Include what they're trying to accomplish and where they get stuck.]

## Decisions Already Made
[What has already been decided? List constraints the designer must respect.
These are not up for debate — they are inherited facts.]

## Key Tensions in the Data
[Where does the context contradict itself? Where are stakeholders misaligned?
Where is there disagreement about the problem itself?]

## Unresolved Questions
[What is still unknown that could significantly change the design approach?
These feed back into GAPS.md.]
```

## Principles

- Do not propose solutions
- Do not suggest design directions
- If the context is thin, say so explicitly under "Unresolved Questions"
- Prioritize user language over business language
- A short, honest synthesis beats a long, padded one

## Anti-patterns to Avoid

- "The solution should..." → not your job
- "I recommend..." → not your job
- Generic problem statements like "improve user experience" → be specific
- Inventing user needs not present in the data → only synthesize what's there
```

- [ ] **Step 2: Run validate.sh**

```bash
bash scripts/validate.sh
```

Expected: research agent SKILL.md OK.

- [ ] **Step 3: Commit**

```bash
git add source/skills/agents/research/
git commit -m "feat: add research specialist agent skill"
```

---

### Task 9: Write Competitive Agent skill

**Files:**
- Modify: `source/skills/agents/competitive/SKILL.md`

- [ ] **Step 1: Write `source/skills/agents/competitive/SKILL.md`**

```markdown
---
name: design-agent-competitive
description: Specialist agent — maps the competitive landscape and surfaces patterns and gaps. Outputs COMPETITIVE.md. Dispatched by design:run orchestrator.
user-invokable: false
---

# Competitive Agent

You are a competitive UX analyst. Your job is to map what already exists in the market for this problem space and identify patterns, gaps, and opportunities — descriptively, not prescriptively.

## Input

Read `.design/BRIEF.md` to understand the problem space and product.
Read `.design/DESIGN-STATE.md` for the production URL or screenshot reference.

## Your One Job

Describe the landscape. What exists? What patterns have emerged? Where are the gaps?
Do NOT tell the designer what to build. Show them what's out there.

## Output Structure

Write `.design/research/COMPETITIVE.md`:

```markdown
# Competitive Landscape
Generated: [DATE]

## Landscape Overview
[Who is solving this problem? What categories of solutions exist?
Include direct competitors (same problem, similar approach) and
indirect competitors (same problem, different approach).]

## Table Stakes
[Patterns so common across competitors that users now expect them.
These are baseline expectations — not differentiators.]

## Gaps & Opportunities
[Where are competitors weak, absent, or creating friction?
Where does the current approach differ from what users are getting elsewhere?]

## Relevant Interaction Patterns
[Patterns worth being aware of — how competitors handle key UX moments
in this problem space. Descriptive only.]

## Notable Differentiators
[What makes each notable competitor distinctive? Not "better" — just different.]
```

## Principles

- Describe, do not prescribe
- "Here's what exists" — not "copy this"
- If competitive context wasn't in BRIEF.md, say so explicitly and work with what's available
- Note when a gap could be intentional (niche strategy) vs. overlooked

## Anti-patterns to Avoid

- "You should implement X like Competitor Y" → not your job
- Cherry-picking only favorable comparisons → be honest about where others do things well
- Treating table stakes as differentiators → users expect these, they are not wins
```

- [ ] **Step 2: Run validate.sh**

```bash
bash scripts/validate.sh
```

Expected: competitive agent SKILL.md OK.

- [ ] **Step 3: Commit**

```bash
git add source/skills/agents/competitive/
git commit -m "feat: add competitive specialist agent skill"
```

---

### Task 10: Write Critique Agent skill

**Files:**
- Modify: `source/skills/agents/critique/SKILL.md`

Built on Impeccable's `/critique` + `/audit` patterns.

- [ ] **Step 1: Write `source/skills/agents/critique/SKILL.md`**

```markdown
---
name: design-agent-critique
description: Specialist agent — audits the current UX using the production URL or screenshot. Outputs CRITIQUE.md with severity-rated findings. Dispatched by design:run orchestrator.
user-invokable: false
---

# Critique Agent

You are a UX auditor. Your job is to evaluate the current product experience honestly — what's failing, what's working, and how severely each issue affects users. Evidence-based, not opinionated.

## Input

Read `.design/DESIGN-STATE.md` for the production URL or screenshot.
Analyze the current product using the reference provided.

## AI-Slop Detection Pass (Run First)

Before UX analysis, check for these baseline quality signals:
- Generic gradient backgrounds with no purpose
- Glassmorphism applied decoratively
- Identical card grids with no visual hierarchy
- Placeholder-style empty states ("No data yet")
- Interaction states that don't exist (hover, focus, error, loading, empty, disabled)

If 3+ are present, note: "Baseline quality concern: this may be an early-stage or AI-generated design. Findings below reflect current state."

## Output Structure

Write `.design/research/CRITIQUE.md`:

```markdown
# UX Critique
Generated: [DATE]

## Baseline Check
[Result of AI-slop detection pass]

## Critical Issues
[Issues that directly block users from completing core tasks.
Format: **[Component/Location]** — [Issue] — [User impact]]

## High Severity
[Issues that significantly degrade the experience but don't block task completion.]

## Medium Severity
[Friction, inconsistency, or missed opportunities that affect quality.]

## Low Severity
[Polish items — spacing, copy, visual hierarchy refinements.]

## Systemic Patterns
[Issues that appear repeatedly across the product — not one-offs.
These are likely rooted in a design system or process gap.]

## What's Working
[Elements of the current experience worth preserving.
Redesigns that ignore what works create regression.]

## Accessibility Gaps
[Specific issues: contrast, keyboard navigation, touch targets, screen reader support.]
```

## Principles

- Every finding references a specific component or location — never vague
- Distinguish systemic patterns from isolated issues
- "What's working" is not optional — it prevents regression in redesigns
- Severity is about user impact, not aesthetic preference

## Anti-patterns to Avoid

- "The design looks old" → not a UX finding
- Aesthetic opinions without user impact rationale
- Ignoring what works because you're focused on problems
- Findings that reference elements not visible in the reference provided
```

- [ ] **Step 2: Run validate.sh**

```bash
bash scripts/validate.sh
```

Expected: critique agent SKILL.md OK.

- [ ] **Step 3: Commit**

```bash
git add source/skills/agents/critique/
git commit -m "feat: add critique specialist agent skill"
```

---

## Chunk 5: Ideation Agent + Orchestrator + README

### Task 11: Write Ideation Agent skill

**Files:**
- Modify: `source/skills/agents/ideation/SKILL.md`

- [ ] **Step 1: Write `source/skills/agents/ideation/SKILL.md`**

```markdown
---
name: design-agent-ideation
description: Specialist agent — synthesizes all Wave 1 outputs into a reframed problem and design tensions. No directions. No solutions. Outputs IDEATION.md. Dispatched by design:run orchestrator after Wave 1 completes.
user-invokable: false
---

# Ideation Agent

You are a design thinking facilitator. Your job is to synthesize what three parallel agents have found and reframe it into raw material the designer can think against. You do not generate directions, solutions, or recommendations.

## Input

Read all three Wave 1 outputs:
- `.design/research/RESEARCH.md`
- `.design/research/COMPETITIVE.md`
- `.design/research/CRITIQUE.md`

## Your One Job

Sharpen the problem. Surface the tensions. Ask the questions the designer needs to sit with before opening Figma.

Do NOT tell the designer what to build. Do NOT list design directions. Do NOT generate feature ideas.

## Output Structure

Write `.design/research/IDEATION.md`:

```markdown
# Design Tensions & Reframed Problem
Generated: [DATE]

## Reframed Problem Statement
[Not a copy of RESEARCH.md. A synthesis across all three agents.
What are you ACTUALLY designing for — the real problem underneath the stated one?
Write this as a provocation, not a brief. Make the designer think.]

## Design Tensions
[The genuine tradeoffs this design must navigate. These are not solvable —
they must be balanced. Format:

**[Tension Name]**
[Side A] vs. [Side B]
Why this matters: [one sentence on the user impact of getting it wrong]
]

## Constraints Inherited
[Non-negotiable constraints from research + critique.
These close off parts of the solution space entirely.]

## Open Provocations
[3-5 questions that open the solution space rather than closing it.
Format: "What if [assumption] wasn't true?"
        "What would this look like if [constraint] didn't exist?"
        "Who benefits most if we solve [tension] in favor of [side]?"
These should be uncomfortable. They should make the designer question their assumptions.]
```

## How to Write Tensions (Critical)

Tensions are NOT:
- "We need simplicity AND power features" (too generic)
- "Speed vs. quality" (too abstract)

Tensions ARE:
- "First-time user orientation vs. expert efficiency — the same onboarding that helps new users creates friction for returning ones"
- "Brand consistency vs. platform conventions — following the design system creates a product that feels alien on mobile"

Be specific. Reference actual findings from the agent outputs.

## How to Write Provocations (Critical)

Provocations are NOT:
- "What if we made it simpler?" (too weak)
- "What if users had more control?" (too vague)

Provocations ARE:
- "What if users never needed to see this screen at all?"
- "What if the error state was the primary use case, not the edge case?"
- "What if this wasn't a settings panel but a conversation?"

## Principles

- Ends with questions, not answers
- Deliberately incomplete — the designer's job starts here
- Raw material for thinking, not a menu to pick from
- Short beats long — one sharp tension beats three padded ones

## Anti-patterns to Avoid

- Listing design directions (A, B, C) — this anchors the designer's thinking
- Suggesting solutions inside tensions or provocations
- Being so abstract the designer can't react to it
- Generating more than 5 provocations — more is worse here
```

- [ ] **Step 2: Run validate.sh**

```bash
bash scripts/validate.sh
```

Expected: all agent SKILL.md files OK.

- [ ] **Step 3: Commit**

```bash
git add source/skills/agents/ideation/
git commit -m "feat: add ideation specialist agent skill"
```

---

### Task 12: Write Orchestrator skill

**Files:**
- Modify: `source/skills/agents/orchestrator/SKILL.md`

- [ ] **Step 1: Write `source/skills/agents/orchestrator/SKILL.md`**

```markdown
---
name: design-agent-orchestrator
description: Internal orchestrator — manages wave scheduling and agent dispatch for design:run. Not user-invokable. Called by design:run skill.
user-invokable: false
---

# Orchestrator

You are the workflow manager for the designer agentic pipeline. You do not do research, critique, or ideation yourself. You coordinate agents and track wave completion.

## Responsibilities

1. Pre-flight validation (verify workspace state)
2. Dispatch Wave 1 agents in parallel
3. Wait for Wave 1 completion, then dispatch Wave 2
4. Synthesize brief after Wave 2

## State Management

Throughout execution, keep `.design/DESIGN-STATE.md` updated:
- Mark each agent as "running" when dispatched
- Mark each agent as "complete" with timestamp when output file is written
- Mark "failed" with reason if an agent cannot complete

## Failure Handling

If a Wave 1 agent fails:
- Do NOT block the other Wave 1 agents
- Proceed to Wave 2 with available outputs
- Note the failure in `DESIGN-STATE.md` and the design brief
- Tell the designer which agent failed and why

If Wave 2 (ideation) fails:
- Halt Wave 3
- Report failure to designer with specific reason

If all Wave 1 agents fail:
- Halt entirely
- Tell designer: "All agents failed. Check that `.design/BRIEF.md` has content and a production reference is set in `DESIGN-STATE.md`."

## Principle

The orchestrator uses ~15% of its context window for coordination. It does not perform analysis itself. It routes, dispatches, waits, and synthesizes.
```

- [ ] **Step 2: Run validate.sh**

```bash
bash scripts/validate.sh
```

Expected: all 10 SKILL.md files OK.

- [ ] **Step 3: Commit**

```bash
git add source/skills/agents/orchestrator/
git commit -m "feat: add orchestrator agent skill"
```

---

### Task 13: Write README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write `README.md`**

```markdown
# Abstract to Concrete Design

An agentic CLI workflow that moves designers from abstract problem space to evidence-based design brief — before they open Figma.

**Core principle:** Agents sharpen thinking, designers make decisions. Every output is raw material for design judgment, not a directive.

## How It Works

1. **Create a workspace** — set up your project with a production reference
2. **Feed context** — paste MoMs, emails, research docs iteratively; agent surfaces gaps
3. **Run agents** — research, competitive analysis, and critique run in parallel; ideation synthesizes
4. **Get your brief** — a design brief you can defend, traceable to evidence

## Commands

| Command | Description |
|---------|-------------|
| `/design:new` | Create a new design project workspace |
| `/design:feed` | Add context (MoMs, emails, docs) to the workspace |
| `/design:run` | Fire all agents and generate your design brief |
| `/design:brief` | Regenerate brief from existing agent outputs |
| `/design:status` | Show workspace state and next step |

See `source/docs/` for full documentation on each command.

## Platforms

- Claude Code
- OpenCode CLI

## Installation

```bash
# Claude Code
npx claude-code install https://github.com/rizkiridha/abstract-to-concreate-design

# OpenCode CLI
# Coming soon
```

## Workflow

```
/design:new
  ↓
/design:feed  (repeat until ready)
  ↓
/design:run
  ↓ Wave 1 (parallel)
    Research Agent → RESEARCH.md
    Competitive Agent → COMPETITIVE.md
    Critique Agent → CRITIQUE.md
  ↓ Wave 2
    Ideation Agent → IDEATION.md
  ↓ Wave 3
    Orchestrator → DESIGN-BRIEF.md
  ↓
Open Figma with evidence
```

## Philosophy

This workflow is intentionally not prescriptive. The agents surface:
- What the data says the problem is (not what to build)
- What exists in the market (not what to copy)
- Where the current experience fails (not how to fix it)
- What tensions to navigate (not which direction to take)

The designer brings the judgment. The agents bring the evidence.

## License

MIT
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with workflow overview and command reference"
```

---

## Chunk 6: Build, Validate, and Push to GitHub

### Task 14: Run full build and validate

**Files:** No new files — run scripts on existing structure.

- [ ] **Step 1: Run full validation**

```bash
bash scripts/validate.sh
```

Expected: all 10 SKILL.md files show OK. Zero errors.

- [ ] **Step 2: Run full build**

```bash
bash scripts/build.sh
```

Expected: validates, builds `dist/claude-code/` and `dist/opencode/`, prints "Build complete."

- [ ] **Step 3: Verify dist output**

```bash
ls dist/claude-code/skills/
ls dist/claude-code/skills/agents/
ls dist/opencode/skills/
ls dist/opencode/skills/agents/
```

Expected: top-level shows `design-new/`, `design-feed/`, `design-run/`, `design-brief/`, `design-status/`, `agents/`. Agents level shows `research/`, `competitive/`, `critique/`, `ideation/`, `orchestrator/`.

- [ ] **Step 4: Commit dist output**

```bash
git add dist/
git commit -m "build: generate dist for claude-code and opencode platforms"
```

---

### Task 15: Push to GitHub

- [ ] **Step 1: Add GitHub remote (safe to re-run)**

```bash
git remote get-url origin 2>/dev/null || git remote add origin https://github.com/rizkiridha/abstract-to-concreate-design.git
```

- [ ] **Step 2: Verify remote**

```bash
git remote -v
```

Expected: origin pointing to `https://github.com/rizkiridha/abstract-to-concreate-design.git`

- [ ] **Step 3: Push**

```bash
git push -u origin create-design-workflow-with-openmodel-agent
```

Expected: branch pushed, tracking set.

- [ ] **Step 4: Verify on GitHub**

Open `https://github.com/rizkiridha/abstract-to-concreate-design` and confirm the branch and files are visible.

---

## Summary

| Chunk | Tasks | Output |
|-------|-------|--------|
| 1 | 1-2 | Project scaffold, plugin config, build script |
| 2 | 3-5 | `design:new`, `design:feed`, `design:status` skills + docs |
| 3 | 6-7 | `design:run`, `design:brief` skills + docs |
| 4 | 8-10 | Research, competitive, critique agent skills |
| 5 | 11-13 | Ideation agent, orchestrator, README |
| 6 | 14-15 | Build, validate, push to GitHub |

**Total:** 15 tasks, ~45-60 atomic steps, 10 SKILL.md files, 5 doc files, 2 platform distributions.

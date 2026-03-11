# Abstract to Concrete Design

An agentic CLI workflow that moves designers from abstract problem space to evidence-based design brief — before they open Figma.

**Core principle:** Agents sharpen thinking, designers make decisions. Every output is raw material for design judgment, not a directive.

---

## The Problem

Designers often start designing based on gut feeling, limited context, or secondhand briefs. This workflow changes that — making research, competitive analysis, and UX critique part of the design process before a single frame is opened.

The output is a **design brief you can defend**, traceable to real evidence.

---

## How It Works

```
/design:new
  ↓
/design:feed  (repeat until ready)
  ↓
/design:run
  ↓ Wave 1 (parallel)
    Research Agent    → What problem are we actually solving?
    Competitive Agent → What does the landscape look like?
    Critique Agent    → Where is the current experience failing?
  ↓ Wave 2
    Ideation Agent    → What tensions must the designer navigate?
  ↓ Wave 3
    Orchestrator      → DESIGN-BRIEF.md
  ↓
Open Figma with evidence
```

1. **Create a workspace** — set up your project with a one-line description and production reference
2. **Feed context** — paste MoMs, emails, research docs, Slack threads iteratively; the agent reflects back what it understands and surfaces gaps
3. **Run agents** — research, competitive analysis, and critique run in parallel; ideation synthesizes their outputs
4. **Get your brief** — a design brief you can defend, traceable to evidence

---

## Commands

| Command | Description |
|---------|-------------|
| `/design:new` | Create a new design project workspace |
| `/design:feed` | Add context (MoMs, emails, docs, Slack) to the workspace |
| `/design:run` | Fire all agents and generate your design brief |
| `/design:brief` | Regenerate brief from existing agent outputs |
| `/design:status` | Show workspace state and next recommended step |

Full documentation for each command in `source/docs/`.

---

## Workspace Structure

Running `/design:new` creates a `.design/` directory in your project:

```
.design/
  BRIEF.md          ← accumulates all your pasted context
  GAPS.md           ← what the agent understands + what's missing
  DESIGN-STATE.md   ← workflow state tracker
  research/
    RESEARCH.md     ← UX problem statement from research agent
    COMPETITIVE.md  ← landscape, patterns, gaps from competitive agent
    CRITIQUE.md     ← severity-rated findings from critique agent
    IDEATION.md     ← reframed problem + design tensions
  DESIGN-BRIEF.md   ← final output, ready for Figma
```

---

## The Agents

### Research Agent
Reads your accumulated context and surfaces **what the data says the problem is**. No solutions, no directions — only a clear UX problem statement with user needs, existing constraints, and unresolved questions.

### Competitive Agent
Maps the competitive landscape — who's solving this problem, what patterns have become table stakes, where the gaps and opportunities are. Descriptive, not prescriptive.

### Critique Agent
Audits the current product using your production URL or screenshot. Severity-rated findings (Critical → Low), systemic patterns, accessibility gaps, and — importantly — what's working and should be preserved.

### Ideation Agent
Synthesizes all three into a **reframed problem statement** and **design tensions** — the real tradeoffs the design must navigate. Ends with open provocations, not directions. The designer brings the solutions.

---

## Design Philosophy

This workflow is intentionally not prescriptive:

- Agents surface **what the data says** — not what to build
- Competitive output shows **what exists** — not what to copy
- Critique findings reference **specific locations** — not vague opinions
- Ideation outputs **tensions and provocations** — not directions A, B, C

**The designer's judgment is the point.** Every agent output is raw material to react to, not instructions to follow. Listing directions would anchor creative thinking. Reframing the problem opens it.

---

## Platforms

- Claude Code
- OpenCode CLI

---

## Installation

**Claude Code** (same pattern as GSD / Impeccable):

```
/plugin marketplace add rizkiridha/abstract-to-concreate-design
/plugin install abstract-to-concrete-design@abstract-to-concrete-design
```

**OpenCode CLI:**

```bash
# Clone directly and copy dist/opencode/ to your OpenCode config
git clone https://github.com/rizkiridha/abstract-to-concreate-design.git
cp -r abstract-to-concreate-design/dist/opencode/.  ~/.config/opencode/
```

---

## Project Status

This workflow is in active development. Phase 1 covers the full abstract-to-brief pipeline. Future phases:

- **Phase 2:** Design → Generate design to code
- **Phase 3:** Code review
- **Phase 4:** Handoff to engineering

---

## License

MIT

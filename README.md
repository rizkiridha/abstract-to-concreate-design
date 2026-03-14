# Abstract to Concrete Design

An agentic CLI workflow that moves designers from scattered context to evidence-based design brief — before they open Figma.

---

## The Problem: Scattered Context

Designers face a common challenge:

- **MoMs** in Slack threads
- **Research** in Notion
- **Stakeholder feedback** in email
- **Competitive intel** in random docs
- **Design critiques** in head

Context lives everywhere. The designer holds it all in their head — or doesn't. Important insights get lost. Decisions get made without full picture.

**This system brings context together, validates understanding, and surfaces gaps — before design begins.**

---

## How It Works

```
/design:new         → Create project workspace
       ↓
/design:feed        → Paste MoMs, emails, docs, Slack threads
       ↓
/design:validate    → Verify understanding, detect conflicts
       ↓
/design:run         → Run agents (Research → Competitive → Critique)
       ↓
/design:validate    → Validate research synthesis
       ↓
/design:brief       → Get your evidence-based brief
       ↓
Open Figma
```

---

## The Scattered Context Solution

| Before | After |
|--------|-------|
| MoMs in Slack | All context in `.design/BRIEF.md` |
| Research in Notion | Synthesized in RESEARCH.md |
| Competitive intel scattered | Mapped in COMPETITIVE.md |
| Feedback in emails | Traced to source in BRIEF.md |
| "What do we know?" | Check GAPS.md or run `/design:status` |

---

## Key Features

### 1. Context Centralization
Paste anything — MoMs, emails, research docs, Slack threads. The system accumulates all context in one place, traceable to source.

### 2. Validation Gates
Before agents run, validate your understanding:
- **Stakeholder mapping**: Who said what?
- **Conflict detection**: Do stakeholders contradict each other?
- **Context freshness**: How old is this information?

### 3. Gap Detection
The system surfaces what's missing:
- No user research data?
- No engineering constraints?
- Missing competitive context?

You'll know what you don't know.

### 4. Learning Loop
The system remembers past issues:
- "URL was unreachable last time"
- "This context contradicted earlier input"

Future runs learn from history.

---

## Commands

| Command | Purpose |
|---------|---------|
| `/design:new` | Create project workspace |
| `/design:feed` | Add context (MoM, email, docs, Slack) |
| `/design:validate` | Verify understanding, detect conflicts, check freshness |
| `/design:run` | Execute research agents |
| `/design:brief` | Generate design brief |
| `/design:status` | Check current state and next step |

---

## Workspace Structure

```
.design/
  BRIEF.md              ← All context, traceable to source
  GAPS.md               ← What we know vs missing
  DESIGN-STATE.md       ← Workflow state tracker
  VALIDATION-REPORT.md  ← Problem validation results
  PROBLEM-REFLECTION.md ← Your confirmed understanding
  LEARNING-LOG.md       ← Past issues learned
  research/
    RESEARCH.md         ← Problem statement
    COMPETITIVE.md       ← Landscape analysis
    CRITIQUE.md          ← UX audit
    IDEATION.md          ← Design tensions
  DESIGN-BRIEF.md       ← Final output for Figma
```

---

## Validation: Before Agents Run

```
/design:feed
> Paste MoM from product sync...

/design:validate
> ## Stakeholders
> | Source | Role | Key Input |
> |--------|------|-----------|
> | MoM - Product Sync | PM | Users can't find export |
>
> ## Conflicts
> None detected
>
> ## Context Age
> 2026-03-14 (today) ✅ Fresh
>
> ## Problem Reflection
> What problem are we solving? [Your answer]
>
> Ready to proceed? (yes)
```

---

## Validation: After Research

```
/design:run (Wave 1 complete)
/design:validate
> ## Research Validation
> Research says: "Users struggle to locate export..."
>
> Your earlier reflection: "Users can't find export button"
>
> ✓ Matches my understanding
> ✓ Worth solving
> ✓ Enough evidence
>
> Proceed to Ideation? (yes)
```

---

## The Agents

### Research Agent
"What problem are we actually solving?" — Synthesizes context into a clear problem statement with user needs and constraints.

### Competitive Agent
"What does the landscape look like?" — Maps competitors, table stakes, gaps, and opportunities. Descriptive, not prescriptive.

### Critique Agent
"Where is the current experience failing?" — Audits your product via URL/screenshot. Severity-rated findings + what's working.

### Ideation Agent
"What tensions must we navigate?" — Synthesizes into design tensions and provocations. Ends with questions, not answers.

---

## Design Philosophy

- **Agents surface evidence** — not directions
- **Competitive shows what exists** — not what to copy
- **Critique references specifics** — not vague opinions
- **Ideation opens thinking** — doesn't close it

**The designer brings the solutions.** Agents provide the raw material.

---

## Platforms

- Claude Code
- OpenCode CLI

---

## Installation

**Claude Code:**
```
/plugin marketplace add rizkiridha/abstract-to-concreate-design
/plugin install abstract-to-concrete-design@abstract-to-concrete-design
```

**OpenCode CLI:**
```bash
git clone https://github.com/rizkiridha/abstract-to-concreate-design.git
cp -r abstract-to-concreate-design/dist/opencode/. ~/.config/opencode/
```

---

## Project Status

**Phase 1:** Abstract → Brief ✅ (complete)
- Context accumulation
- Research agents
- Validation gates
- Learning loop

**Future:**
- Phase 2: Design → Code generation
- Phase 3: Code review
- Phase 4: Engineering handoff

---

## License

MIT

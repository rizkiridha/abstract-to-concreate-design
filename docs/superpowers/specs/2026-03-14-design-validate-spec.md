# Design Validate Skill - Specification

## Overview

`design:validate` is a validation skill that ensures the design problem is well-understood, stakeholders are aligned, context is fresh, and gaps are addressed before proceeding to ideation.

## Purpose

Fill gaps 1-4 identified in pre-design research phase:
1. Stakeholder alignment (who said what, conflicts, sign-off)
2. Context staleness (age, contradictions, manual marking)
3. Information gaps (confidence, critical gaps, competitive refresh)
4. Problem validation (pre-agent reflection, post-research check)

## When to Use

**Trigger 1:** After `/design:feed` — before `/design:run`
**Trigger 2:** After Wave 1 agents complete — before Wave 2 (Ideation)

## Functions

### 1. Stakeholder Mapping

**Input:** Read `.design/BRIEF.md` context sections

**Process:**
- Extract "Source:" labels from each context section
- Assign roles based on source type:
  - "MoM - Product Sync" → Product Manager
  - "Email from Engineering" → Engineer
  - "User interview with Sarah" → User/Customer
  - "Design critique" → Designer (self)
- Build stakeholder map

**Output:** Update BRIEF.md with stakeholder section:

```markdown
## Stakeholders
| Source | Role | Key Input |
|--------|------|-----------|
| MoM - Product Sync 2026-03-10 | Product Manager | "Users can't find the export button" |
| Email from Engineering | Engineer | "API rate limits are strict" |
| User interview - Sarah | Customer | "I export every week, it's tedious" |
```

### 2. Conflict Detection

**Process:**
- Compare problem statements across context sections
- Look for contradictory keywords (speed vs stability, simplicity vs features)
- Flag if multiple stakeholders have opposing views

**Output:** In validation report, list conflicts:

```markdown
### Potential Conflicts Detected
- Product: "focus on speed" vs Engineering: "focus on stability"
- Suggestion: Discuss with team before proceeding
```

### 3. Sign-off Tracking

**Process:**
- Track which stakeholders have "approved" the problem understanding
- Can mark via: explicit yes, or no objection after N days

**Output:** In DESIGN-STATE.md:

```markdown
## Sign-offs
- [ ] Product Manager - pending
- [ ] Engineering - pending
- [ ] Designer (self) - pending
```

### 4. Context Staleness

**Auto-age detection:**
- Parse timestamps from context sections
- Flag anything older than 30 days as "potentially stale"
- Warn but don't block

**Manual stale marking:**
- Designer can mark any section as "outdated" via command
- Marked sections are excluded from synthesis

**Contradiction detection:**
- Compare old vs new context on same topic
- Flag if new context negates old assumptions

**Output:** In validation report:

```markdown
### Context Age
- Context from 2026-03-10 (3 days old) - ✅ Fresh
- Context from 2026-02-15 (27 days old) - ⚠️ Consider refreshing

### Contradictions Detected
- Old (2026-02-15): "users prefer dark mode"
- New (2026-03-10): "users want light mode as default"
```

### 5. Information Gaps - Confidence Scoring

**Process:**
- Analyze what we know vs don't know
- Rate confidence: High / Medium / Low

**Output:** In GAPS.md, add confidence:

```markdown
## Understanding Confidence

| Area | Confidence | Evidence |
|------|------------|----------|
| Problem statement | HIGH | 3 sources agree |
| User needs | MEDIUM | 1 user interview |
| Technical constraints | LOW | Only 1 engineer input |
| Business goals | HIGH | Product strategy doc |
```

### 6. Critical Gap Surfacing

**Process:**
- Identify what's missing that would significantly change the design
- Ask: "What don't we know that could flip our solution?"

**Output:** In validation report:

```markdown
### Critical Unknowns
- What do users do if export fails? (edge case)
- How often is this feature used? (prioritization)
- What's the team's technical capacity? (scope)
```

### 7. Competitive Refresh Check

**Process:**
- If last competitive analysis > 60 days old, flag for refresh
- Note: Cannot auto-refresh, but remind designer

### 8. Problem Validation (Pre-Agent)

**Trigger:** After `/design:feed`, before `/design:run`

**Prompt designer:**

```
## Problem Reflection

Before we run agents, let's confirm understanding:

**What problem are we solving?**
[Auto-filled from BRIEF.md synthesis]

**Who experiences this?**
[Auto-filled]

**If we solve this, what changes?**
[Designer fills in]

**If we DON'T solve this, what happens?**
[Designer fills in]

---
Ready to proceed? (yes/no/revise)
```

### 9. Problem Validation (Post-Research)

**Trigger:** After Wave 1, before Wave 2

**Process:**
- Read RESEARCH.md problem statement
- Compare with designer's pre-agent reflection

**Prompt designer:**

```
## Research Validation

Research has synthesized:

**[Problem Statement from RESEARCH.md]**

**Your earlier reflection:**
[From pre-agent validation]

**Check:**
- [ ] Research matches my understanding
- [ ] This problem is worth solving (impact > effort)
- [ ] We have enough evidence to proceed

---
If checks pass → proceed to Ideation
If checks fail → /design:feed more context
```

## Integration Points

### From design:feed

After context is added, prompt:

> "Context added. Run `/design:validate` to verify understanding before running agents."

### From design:run

In pre-flight, add step:

```
4. Run /design:validate first to ensure problem is validated
   If not validated, don't proceed to agents
```

### After Wave 1

Before Wave 2, check:

```
If not validated post-research, don't proceed to Ideation
```

## Output Files

- Updated `.design/BRIEF.md` (stakeholder section)
- Updated `.design/GAPS.md` (confidence scoring)
- Updated `.design/DESIGN-STATE.md` (sign-offs)
- New `.design/VALIDATION-REPORT.md` (validation results)

## Validation Report Structure

```markdown
# Validation Report: [PROJECT]
Generated: [DATE]

## Status
- [x/] Pre-agent validation: [pending/done]
- [x/] Post-research validation: [pending/done]

## Stakeholders
[Stakeholder map]

## Conflicts
[Any detected conflicts]

## Context Health
[Age analysis, staleness, contradictions]

## Confidence Score
[Understanding confidence by area]

## Critical Gaps
[Unknowns that could change the solution]

## Sign-offs
[Who has approved]

## Next Step
[Proceed / Need more context / Revise understanding]
```

## Usage

```
/design:validate
```

No arguments. Will determine context based on current workflow state.

## Platform

Claude Code, OpenCode CLI

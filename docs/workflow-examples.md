# Designer Agentic Workflow - Usage Examples

## Overview

This document shows the complete workflow for product designers using the AI-powered design research system.

---

## Workflow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ /design:new │ ──► │ /design:feed│ ──► │/design:validate│
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │ /design:run │ ◄── │   Wave 1    │ ──► │   Wave 2    │
                    └─────────────┘     └─────────────┘     └─────────────┘
                          │                                       │
                          ▼                                       ▼
                   ┌─────────────┐                        ┌─────────────┐
                   │    Brief    │ ◄──────────────────────│/design:brief │
                   └─────────────┘                        └─────────────┘
```

---

## Example 1: New Project Setup

### Step 1: Create Project

```bash
/design:new
```

**System prompts:**
- Enter project name: "Export Feature Redesign"
- Enter one-line description: "Making the export workflow more intuitive"
- Enter production URL or upload screenshot: https://app.example.com/exports

**Creates:**
- `.design/BRIEF.md`
- `.design/DESIGN-STATE.md`
- `.design/GAPS.md`
- `.design/research/`

---

### Step 2: Add Context

```bash
/design:feed
```

**Designer pastes:**

> MoM - Product Sync 2026-03-10
> 
> Key points:
> - Users are complaining about export being hidden
> - PM wants to prioritize this for Q2
> - Success metric: reduce support tickets by 50%

**System responds:**

> Context added to BRIEF.md.
> 
> **What I understand:**
> - Problem: Export feature is hard to find
> - Priority: Q2 for PM
> - Goal: Reduce support tickets
> 
> **What's missing:**
> - [ ] User research data
> - [ ] Engineering constraints
> - [ ] Competitor examples
> 
> Run `/design:validate` to verify understanding before running agents.

---

### Step 3: Validate Understanding

```bash
/design:validate
```

**System generates:**

```
## Stakeholders
| Source | Role | Key Input |
|--------|------|-----------|
| MoM - Product Sync 2026-03-10 | Product Manager | "Users can't find export" |

## Context Age
- 2026-03-10 (today) ✅ Fresh

## Problem Reflection

**What problem are we solving?**
Users can't find the export button, leading to support tickets.

**Who experiences this?**
End users who need to download data regularly.

**If we solve this, what changes?**
Users can find export easily, 50% reduction in support tickets.

**If we DON'T solve this, what happens?**
Support team continues handling tickets, user frustration grows.

---
Ready to proceed? (yes)
```

---

### Step 4: Run Agents

```bash
/design:run
```

**System:**

```
Running research, competitive analysis, and UX critique in parallel...

Wave 1 complete.
Running /design:validate for post-research validation...
```

**Post-validation prompt:**

```
## Research Validation

Research has synthesized:
"Users struggle to locate the export functionality, causing friction 
in their workflow and generating support tickets."

**Your earlier reflection:**
"Users can't find the export button, leading to support tickets."

✓ Research matches my understanding
✓ This problem is worth solving
✓ We have enough evidence to proceed

Proceeding to Wave 2...
```

---

### Step 5: Final Brief

```bash
/design:brief
```

**Output:** `.design/DESIGN-BRIEF.md`

---

## Example 2: Adding More Context Later

### Continue Feeding

```bash
/design:feed
```

**Designer adds:**

> Email from Engineering - 2026-03-12
> 
> The export API has rate limits. We can only allow 10 exports 
> per minute per user. Also, exports over 100MB need to be 
> async - user gets email when ready.

**System:**

> Context added.
> 
> **Updated understanding:**
> - Problem: Export hard to find
> - Constraint: Rate limits (10/min), async for 100MB+
> 
> Run `/design:validate` to re-validate and check for conflicts.

---

### Re-validate

```bash
/design:validate
```

**System detects:**

```
### Potential Conflicts
- No conflicts detected between Product and Engineering inputs

### Updated Context
- 2 sources now: Product + Engineering

### Updated Confidence
| Area | Before | After |
|------|--------|-------|
| Problem | MEDIUM | HIGH |
| Constraints | LOW | HIGH (new engineering input) |
```

---

## Example 3: Conflict Detection

### Scenario

**Context 1 (old):**
> MoM - Product 2026-02-01
> "Users want dark mode as default"

**Context 2 (new):**
> User Interview - Sarah 2026-03-12
> "I hate dark mode, please make light mode default"

### Validation Report

```markdown
### Contradictions Detected
- Old (2026-02-01): "users want dark mode as default"
- New (2026-03-12): "users want light mode as default"

⚠️ These contradict! Suggestion: Get more user data to resolve.

## Next Step
[ ] Resolve contradiction before proceeding
```

---

## File Outputs

### `.design/BRIEF.md`
```markdown
# Design Brief Context: Export Feature Redesign
Created: 2026-03-10

## Stakeholders
| Source | Role | Key Input |
|--------|------|-----------|
| MoM - Product Sync | Product Manager | Users can't find export |
| Email from Engineering | Engineer | Rate limits, async for 100MB+ |

---

## Context Added: 2026-03-10
Source: MoM - Product Sync

[content...]
```

### `.design/VALIDATION-REPORT.md`
```markdown
# Validation Report: Export Feature Redesign
Generated: 2026-03-14

## Status
- [x] Pre-agent validation: 2026-03-10
- [x] Post-research validation: 2026-03-14

## Stakeholders
[table]

## Conflicts
None detected

## Context Health
- 2026-03-10 (fresh)

## Confidence Score
[table]

## Sign-offs
- [x] Designer - approved

## Next Step
Proceed to Wave 2
```

### `.design/LEARNING-LOG.md`
```markdown
# Learning Log

## 2026-03-14
### Agent: research
**Status:** success
**Prevention:** None needed

## 2026-03-14
### Agent: critique  
**Status:** success-with-warnings
**Issue:** Some interaction states not visible in screenshot
**Resolution:** Noted in findings
**Prevention:** Request full state documentation next time
```

---

## Complete Command Reference

| Command | Purpose |
|---------|---------|
| `/design:new` | Create new project workspace |
| `/design:feed` | Add context (MoM, emails, etc.) |
| `/design:validate` | Validate understanding & alignment |
| `/design:run` | Execute all research agents |
| `/design:brief` | Generate design brief |
| `/design:status` | Check current state |

---

## Integration Points

### Pre-Agent Validation Flow
```
/design:feed → /design:validate → /design:run
                (pre-agent)
```

### Post-Research Validation Flow
```
/design:run (Wave 1) → /design:validate → /design:run (Wave 2)
                        (post-research)
```

---

## For Developers

This workflow system is available as Claude Code and OpenCode skills.

**Repository:** github.com/rizkiridha/abstract-to-concreate-design

**Skills:**
- `design:new` - Project initialization
- `design:feed` - Context accumulation  
- `design:validate` - Understanding validation
- `design:run` - Agent orchestration
- `design:brief` - Brief generation
- `design:status` - State check

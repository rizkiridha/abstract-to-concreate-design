# design:validate

Validate problem understanding, stakeholder alignment, context freshness, and gap analysis before proceeding to ideation.

## Usage

```bash
/design:validate
```

## When to Run

**1. After `/design:feed`** — Before running agents
- Stakeholder mapping
- Conflict detection  
- Context freshness
- Problem reflection

**2. After Wave 1 (agents complete)** — Before Wave 2
- Research synthesis validation
- Confidence scoring update
- Critical gaps surfacing

## What It Does

### Pre-Agent Validation

1. **Stakeholder Mapping** — Track who said what
2. **Conflict Detection** — Flag contradictory inputs
3. **Context Age** — Flag stale information
4. **Problem Reflection** — Designer confirms understanding
5. **Sign-off Initiation** — Track approvals needed

### Post-Research Validation

1. **Compare** — Research synthesis vs. designer's reflection
2. **Validate** — Does research match expectations?
3. **Confidence Update** — Rate understanding by area
4. **Critical Gaps** — Surface unknowns that could change solution

## Outputs

- `.design/VALIDATION-REPORT.md` — Full validation report
- `.design/PROBLEM-REFLECTION.md` — Designer's problem statement
- Updated `.design/BRIEF.md` — Stakeholder section added
- Updated `.design/DESIGN-STATE.md` — Validation status

## Example Output

```
# Validation Report: [PROJECT]
Generated: 2026-03-14

## Status
- [x] Pre-agent validation: 2026-03-10
- [x] Post-research validation: 2026-03-14

## Stakeholders
| Source | Role | Key Input |
|--------|------|-----------|
| MoM - Product Sync | Product Manager | Users can't find export |

## Conflicts
None detected

## Context Health
- 2026-03-10 (today) ✅ Fresh

## Confidence Score
| Area | Confidence |
|------|------------|
| Problem | HIGH |
| Users | MEDIUM |
| Constraints | HIGH |

## Sign-offs
- [x] Designer - approved

## Next Step
Proceed to Wave 2
```

## Workflow Integration

```
/design:feed → /design:validate → /design:run
                (pre-agent)         ↓
                                  Wave 1
                                    ↓
                            /design:validate
                            (post-research)
                                    ↓
                                  Wave 2
                                    ↓
                              /design:brief
```

## Platform

Claude Code, OpenCode CLI

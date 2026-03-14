# Release Notes: Learning Loop & Validation Fixes

## Version: 2026-03-13

### Features Added

#### Learning Loop System
- **Hybrid learning logs**: Per-project (`.design/LEARNING-LOG.md`) + global (`~/.design-agent-learning/global-log.md`)
- **Startup reading**: Agents read logs at startup to understand past issues
- **Post-run logging**: Each agent logs its status (success/warnings/failed) after completion
- **Query before risky ops**: Agents query logs before operations like URL checks or Wave 2 validation

#### Validation Fixes

| Fix | Description |
|-----|-------------|
| Empty content detection | Pre-flight now detects empty BRIEF.md content and warns |
| URL format validation | Checks URL format before running agents |
| Overwrite warning | Warns before overwriting existing agent outputs |
| Wave 1 validation | Validates all 3 outputs exist and have content (50+ chars) before Wave 2 |
| Partial failure handling | Handles "2 of 3 agents fail" case explicitly |

### New: Stress Test Suite
- `scripts/test-stress.js` - Automated test with 10 edge case scenarios
- Tests: empty content, dead URLs, crash recovery, idempotency, etc.

### Files Changed
- `source/skills/agents/orchestrator/SKILL.md` - Learning loop + validation
- `source/skills/design-run/SKILL.md` - Pre-flight fixes + learning log
- `source/skills/design-brief/SKILL.md` - Learning log + quality checks

---

**PR**: #stress-testing-and-learning-loop

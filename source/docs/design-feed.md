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

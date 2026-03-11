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

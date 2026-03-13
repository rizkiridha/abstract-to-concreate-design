#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, '.test-workspace');
const DESIGN_DIR = path.join(TEST_DIR, '.design');
const RESEARCH_DIR = path.join(DESIGN_DIR, 'research');

function setup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
  fs.mkdirSync(RESEARCH_DIR, { recursive: true });
}

function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
}

function createBrief(content = '') {
  fs.writeFileSync(path.join(DESIGN_DIR, 'BRIEF.md'), `# Design Brief Context: Test Project
Created: 2026-03-13
Description: Testing project
Production URL: https://example.com

---
## Pasted Context

## Context Added: 2026-03-13
Source: Test

${content}
`);
}

function createDesignState(url = 'https://example.com') {
  fs.writeFileSync(path.join(DESIGN_DIR, 'DESIGN-STATE.md'), `# Design State: Test Project
Created: 2026-03-13

## Status
- [x] Context feeding
- [ ] Agents run
- [ ] Design brief generated

## Production Reference
URL: ${url}

## Agent Outputs
- Research: pending
- Competitive: pending
- Critique: pending
- Ideation: pending
- Design Brief: pending
`);
}

function createGaps(gapCount = 3) {
  const gaps = Array(gapCount).fill(null).map((_, i) => `- [ ] Gap ${i + 1}`).join('\n');
  fs.writeFileSync(path.join(DESIGN_DIR, 'GAPS.md'), `# Gaps & Understanding
Last updated: 2026-03-13

## What I Understand So Far
Test understanding

## What's Missing
${gaps}
`);
}

function readDesignState() {
  return fs.readFileSync(path.join(DESIGN_DIR, 'DESIGN-STATE.md'), 'utf-8');
}

function readBrief() {
  return fs.readFileSync(path.join(DESIGN_DIR, 'BRIEF.md'), 'utf-8');
}

function writeAgentOutput(filename, content) {
  fs.writeFileSync(path.join(RESEARCH_DIR, filename), content);
}

function readLearningLog() {
  const logPath = path.join(DESIGN_DIR, 'LEARNING-LOG.md');
  if (fs.existsSync(logPath)) {
    return fs.readFileSync(logPath, 'utf-8');
  }
  return null;
}

function globalLearningLogPath() {
  return path.join(process.env.HOME || '', '.design-agent-learning', 'global-log.md');
}

function readGlobalLearningLog() {
  const logPath = globalLearningLogPath();
  if (fs.existsSync(logPath)) {
    return fs.readFileSync(logPath, 'utf-8');
  }
  return null;
}

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertContains(text, substring, message) {
  if (!text.includes(substring)) {
    throw new Error(`Assertion failed: "${message}" - expected to contain "${substring}"`);
  }
}

function assertNotContains(text, substring, message) {
  if (text.includes(substring)) {
    throw new Error(`Assertion failed: "${message}" - should NOT contain "${substring}"`);
  }
}

console.log('=== Design Agent Stress Tests ===\n');

setup();

test('1. Empty BRIEF.md content - should detect empty context', () => {
  createBrief('');
  createDesignState();
  createGaps(0);
  
  const brief = readBrief();
  const contextSections = (brief.match(/## Context Added:/g) || []).length;
  
  console.log(`   Context sections found: ${contextSections}`);
  console.log(`   Brief content length: ${brief.length}`);
  
  assert(contextSections >= 1, 'Should have at least one context section');
  const contentMatch = brief.match(/## Context Added:[\s\S]*?\n\n([\s\S]*?)(?:---|$)/);
  const actualContent = contentMatch ? contentMatch[1].trim() : '';
  console.log(`   Actual content: "${actualContent}"`);
  
  if (actualContent.trim() === '') {
    console.log('   ⚠️  ISSUE: Empty content passes pre-flight check');
  }
});

test('2. Dead production URL - should handle gracefully', () => {
  createBrief('Test content for research');
  createDesignState('https://this-domain-does-not-exist-12345.com');
  createGaps(0);
  
  const state = readDesignState();
  assertContains(state, 'this-domain-does-not-exist-12345.com', 'URL in state');
  
  console.log('   ⚠️  ISSUE: No URL accessibility check before running agents');
});

test('3. Running twice - should warn or version', () => {
  createBrief('Test content');
  createDesignState();
  createGaps(0);
  writeAgentOutput('RESEARCH.md', '# Research\nTest output');
  writeAgentOutput('COMPETITIVE.md', '# Competitive\nTest output');
  writeAgentOutput('CRITIQUE.md', '# Critique\nTest output');
  writeAgentOutput('IDEATION.md', '# Ideation\nTest output');
  
  const firstRun = fs.statSync(path.join(RESEARCH_DIR, 'RESEARCH.md')).mtime;
  
  setTimeout(() => {
    const secondRun = fs.statSync(path.join(RESEIGN_DIR, 'RESEARCH.md')).mtime;
    console.log(`   First run: ${firstRun}`);
    console.log(`   Second run: ${secondRun}`);
    console.log('   ⚠️  ISSUE: Running again overwrites without warning');
  }, 100);
});

test('4. Mid-wave crash - should have recovery', () => {
  createBrief('Test content');
  createDesignState();
  createGaps(0);
  writeAgentOutput('RESEARCH.md', '# Research\nPartial');
  
  const state = readDesignState();
  assertContains(state, 'Research: pending', 'State shows pending');
  
  console.log('   ⚠️  ISSUE: No checkpoint system for crash recovery');
});

test('5. Ideation with empty Wave 1 output - should validate', () => {
  createBrief('Test content');
  createDesignState();
  createGaps(0);
  writeAgentOutput('RESEARCH.md', '# Research\n\n## Problem Statement\nTest');
  writeAgentOutput('COMPETITIVE.md', ''); 
  writeAgentOutput('CRITIQUE.md', '# Critique\n\n## Critical Issues\nTest');
  
  const competitive = fs.readFileSync(path.join(RESEARCH_DIR, 'COMPETITIVE.md'), 'utf-8');
  console.log(`   COMPETITIVE.md length: ${competitive.length}`);
  
  if (competitive.trim() === '') {
    console.log('   ⚠️  ISSUE: Ideation would receive empty COMPETITIVE.md');
  }
});

test('6. Learning log - should exist after issues', () => {
  createBrief('Test');
  createDesignState('https://broken-url.test');
  createGaps(2);
  
  const log = readLearningLog();
  if (!log) {
    console.log('   ⚠️  No learning log created (feature not implemented yet)');
  } else {
    console.log(`   Learning log found: ${log.length} chars`);
  }
});

test('7. Global learning log - should be accessible', () => {
  const globalLog = readGlobalLearningLog();
  if (!globalLog) {
    console.log('   ℹ️  Global learning log not created yet (feature not implemented)');
  } else {
    console.log(`   Global log found: ${globalLog.length} chars`);
  }
});

test('8. Three unchecked gaps - should warn and get consent', () => {
  createBrief('Test content');
  createDesignState();
  createGaps(5);
  
  const gaps = fs.readFileSync(path.join(DESIGN_DIR, 'GAPS.md'), 'utf-8');
  const uncheckedGaps = (gaps.match(/- \[ \]/g) || []).length;
  
  console.log(`   Unchecked gaps: ${uncheckedGaps}`);
  
  assert(uncheckedGaps >= 3, 'Should have 3+ unchecked gaps');
  console.log('   ✓ Pre-flight should warn about 3+ unchecked gaps');
});

test('9. Missing Wave 1 output before Ideation - should validate', () => {
  createBrief('Test');
  createDesignState();
  createGaps(0);
  writeAgentOutput('RESEARCH.md', '# Research\nTest');
  
  const hasResearch = fs.existsSync(path.join(RESEARCH_DIR, 'RESEARCH.md'));
  const hasCompetitive = fs.existsSync(path.join(RESEARCH_DIR, 'COMPETITIVE.md'));
  const hasCritique = fs.existsSync(path.join(RESEARCH_DIR, 'CRITIQUE.md'));
  
  console.log(`   Research: ${hasResearch}, Competitive: ${hasCompetitive}, Critique: ${hasCritique}`);
  
  if (hasResearch && !hasCompetitive) {
    console.log('   ⚠️  ISSUE: No validation before running Ideation agent');
  }
});

test('10. Two of three Wave 1 agents fail - unclear handling', () => {
  console.log('   ⚠️  ISSUE: Orchestrator handles "one fails" and "all fail" but not "two of three fail"');
});

let passed = 0;
let failed = 0;

for (const t of tests) {
  try {
    t.fn();
    console.log(`✅ ${t.name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${t.name}`);
    console.log(`   ${e.message}`);
    failed++;
  }
}

cleanup();

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);

if (failed > 0) {
  console.log('\nIdentified gaps need to be fixed in the skill definitions.');
}

process.exit(failed > 0 ? 1 : 0);

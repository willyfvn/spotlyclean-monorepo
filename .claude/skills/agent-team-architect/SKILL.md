---
name: agent-team-architect
description: Evaluate whether a task needs a Claude Code agent team, then design the optimal team composition through guided questions. Use this skill when the user wants to determine if they need an agent team, how many teammates, what roles, and how to structure the work.
---

This skill helps users decide whether they need a Claude Code agent team and, if so, designs the optimal team for their task.

## Workflow

Follow these two phases strictly. Do NOT skip Phase 1.

---

### Phase 1: Evaluate the Need

Before designing any team, determine whether an agent team is actually the right approach. Ask the user to describe their task if they haven't already, then evaluate against these criteria:

**Evaluation Criteria:**

1. **Parallelizable?** — Can the work be split into 3+ independent pieces that don't depend on each other sequentially?
2. **Inter-agent communication needed?** — Do the workers need to share findings, challenge each other, or coordinate beyond just returning results?
3. **File conflict risk?** — Can each piece work on different files/modules, or will multiple agents need to edit the same files?
4. **Complexity justifies cost?** — Is the task complex enough that the extra token cost (each teammate = separate Claude instance) is worthwhile?
5. **Parallel value?** — Will doing this work simultaneously actually produce better results than doing it sequentially?

**Deliver a clear verdict with reasoning:**

- **YES — Agent team recommended**: Explain why, citing which criteria are met. Proceed to Phase 2.
- **NO — Use a simpler approach instead**: Recommend the better alternative and explain why. Do NOT proceed to Phase 2.
  - **Single session**: For sequential work, simple tasks, or same-file edits.
  - **Subagents**: For parallel work where agents only need to report back, not communicate with each other.
  - **Git worktrees**: For manual parallel sessions without automated coordination.

**Quick Decision Tree:**
```
Is the task complex enough for multiple agents?
+-- NO --> Single session
+-- YES --> Do agents need to communicate with each other?
    +-- NO --> Use subagents
    +-- YES --> Use agent team
        +-- Can work be split by files/modules? --> Good fit
        +-- Same files need editing? --> Risky, reconsider
```

---

### Phase 2: Design the Team (only if Phase 1 = YES)

Ask the user targeted questions to design the optimal team. Don't ask all questions at once — ask in logical groups and adapt based on answers.

**Round 1 — Scope & Structure:**
- What is the full scope of the task? (List all deliverables)
- Can you identify the natural boundaries for splitting work? (by module, layer, file, domain)
- Are there any dependencies between the pieces? (what must finish before something else can start)

**Round 2 — Team Composition:**
- Based on the scope, recommend a team size (default to 3-5, explain why)
- Propose specific roles/teammates with clear responsibilities
- Ask: Does each teammate have a distinct set of files to own? (flag conflict risks)
- Ask: Should any teammate require plan approval before implementing?

**Round 3 — Execution Details:**
- What model should teammates use? (Opus for complex reasoning, Sonnet for speed, Haiku for simple tasks)
- Should the lead wait for all teammates or synthesize progressively?
- Any quality gates needed? (hooks for TeammateIdle, TaskCreated, TaskCompleted)
- Display mode preference? (in-process vs split panes)

**After all rounds, deliver the final team blueprint:**

```
## Agent Team Blueprint

### Task Summary
[One-line description of what the team will accomplish]

### Verdict
Agent team is the right approach because: [reasons]

### Team Composition
- **Team size**: [N] teammates
- **Model**: [model per teammate or default]
- **Display mode**: [in-process / split panes]
- **Plan approval**: [which teammates, if any]

### Teammates

| # | Name | Role | Owns (files/modules) | Model |
|---|------|------|---------------------|-------|
| 1 | ... | ... | ... | ... |
| 2 | ... | ... | ... | ... |
| 3 | ... | ... | ... | ... |

### Task Breakdown
[List of tasks with dependencies noted]

### Ready-to-Use Prompt
[A copy-paste prompt the user can give to Claude to create this exact team]
```

---

## Important Rules

- Never recommend more than 5 teammates unless the user's task clearly demands it
- Always check for file conflict risks before finalizing
- Aim for 5-6 tasks per teammate
- If the user's task changes during the conversation, re-evaluate Phase 1
- Be honest — if a single session is better, say so. Don't force agent teams

---

## Embedded Knowledge: Agent Teams Reference

The following is the complete reference for Claude Code agent teams. Use this knowledge to inform all evaluations and team designs.

### What Are Agent Teams?

Agent teams let you run **multiple Claude Code sessions in parallel**, coordinated by a single **team lead**. Each teammate is a fully independent Claude Code instance with its own context window.

#### Agent Teams vs Subagents

| | Subagents | Agent Teams |
|---|---|---|
| **Context** | Share context with parent | Fully independent context windows |
| **Communication** | Report results back only | Message each other directly |
| **Coordination** | Parent manages everything | Shared task list, self-coordination |
| **Best for** | Focused tasks where only the result matters | Complex work requiring discussion & collaboration |
| **Token cost** | Lower | Higher (each teammate = separate Claude instance) |

**Rule of thumb:** Use subagents when workers just need to report back. Use agent teams when workers need to talk to each other.

### When to Use Agent Teams

**Best Use Cases:**
- **Research & review** — Multiple teammates investigate different aspects simultaneously
- **New modules/features** — Each teammate owns a separate piece without conflicts
- **Debugging with competing hypotheses** — Test different theories in parallel
- **Cross-layer coordination** — Frontend, backend, and tests each owned by a different teammate
- **Code review** — Split review by security, performance, and test coverage

**When NOT to Use Them:**
- Sequential tasks with hard dependencies
- Same-file edits (causes overwrites)
- Simple or routine tasks (coordination overhead > benefit)
- Tight budget (token costs scale linearly with teammates)

### Setup

**Enable the Feature** — Add to `settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**Requirements:**
- Claude Code **v2.1.32+** (`claude --version` to check)
- For split-pane mode: **tmux** or **iTerm2** with `it2` CLI

**Display Modes:**

| Mode | How it works | Setup |
|---|---|---|
| **In-process** (default) | All teammates in one terminal. `Shift+Down` to cycle. | None |
| **Split panes** | Each teammate gets its own pane. | Requires tmux or iTerm2 |

Set in `~/.claude.json`: `{ "teammateMode": "in-process" }`
Or per-session: `claude --teammate-mode in-process`

### Creating a Team

Describe what you need in natural language. Claude creates the team, spawns teammates, and coordinates.

**Basic Example:**
```
Create an agent team to refactor the auth module:
- One teammate handles the backend API changes
- One teammate handles the frontend components
- One teammate writes tests for both layers
```

**Specify Models:**
```
Create a team with 4 teammates to review this PR.
Use Sonnet for each teammate.
```

**Require Plan Approval** (for risky tasks):
```
Spawn an architect teammate to redesign the database schema.
Require plan approval before they make any changes.
```

**Use Subagent Definitions as Roles:**
```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

### Key Concepts

**Task List:**
- Shared across all teammates
- Tasks have states: **pending** -> **in progress** -> **completed**
- Tasks can have dependencies (blocked until dependencies complete)
- Lead assigns tasks, or teammates self-claim available work
- File locking prevents race conditions

**Communication:**
- **message**: Send to one specific teammate
- **broadcast**: Send to all (use sparingly — costs scale with team size)
- Messages are delivered automatically
- Idle notifications sent to lead when a teammate finishes

**Context:**
- Teammates load project context (CLAUDE.md, MCP servers, skills) but NOT the lead's conversation history
- Include task-specific details in the spawn prompt
- Give teammates enough context to work independently

**Permissions:**
- Teammates inherit the lead's permission settings at spawn time
- Can change individual modes after spawning
- Pre-approve common operations to reduce permission prompt friction

### Best Practices

**Team Size:**
- Start with 3-5 teammates for most workflows
- Aim for 5-6 tasks per teammate
- 3 focused teammates > 5 scattered ones
- Scale up only when work genuinely benefits from parallelism

**Task Sizing:**
- Too small: coordination overhead exceeds the benefit
- Too large: teammates work too long without check-ins
- Right size: self-contained units with a clear deliverable (a function, test file, or review)

**Avoid File Conflicts:**
- Break work so each teammate owns different files
- Two teammates editing the same file = overwrites

**Give Context:**
```
Spawn a security reviewer with the prompt: "Review the auth module
at src/auth/ for vulnerabilities. Focus on token handling and session
management. The app uses JWT in httpOnly cookies. Report issues with
severity ratings."
```

**Monitor & Steer:**
- Check in on progress regularly
- Redirect approaches that aren't working
- If the lead starts implementing instead of delegating:
  `Wait for your teammates to complete their tasks before proceeding`

**Cleanup:**
- Always clean up through the lead when done: `Clean up the team`
- Shut down all teammates first, then clean up

### Quality Gates with Hooks

| Hook | When it runs | Use case |
|---|---|---|
| `TeammateIdle` | Teammate is about to go idle | Send feedback to keep them working |
| `TaskCreated` | A task is being created | Validate task structure/scope |
| `TaskCompleted` | A task is being marked complete | Enforce quality checks before completion |

Exit with code 2 from any hook to send feedback and prevent the action.

### Limitations

- No session resumption for in-process teammates
- Task status can lag (teammates may forget to mark complete)
- One team per session, no nested teams
- Lead is fixed (can't transfer leadership)
- Split panes not supported in VS Code terminal, Windows Terminal, or Ghostty

### Prompt Templates

**Research Team:**
```
Create an agent team to research [topic]:
- Teammate 1: investigate [angle A]
- Teammate 2: investigate [angle B]
- Teammate 3: play devil's advocate and challenge findings
Have them discuss and converge on recommendations.
```

**Feature Implementation Team:**
```
Create an agent team to implement [feature]:
- Teammate 1: backend API at src/api/
- Teammate 2: frontend components at src/components/
- Teammate 3: tests and documentation
Require plan approval before any changes.
```

**Code Review Team:**
```
Create an agent team to review PR #[number]:
- Teammate 1: security implications
- Teammate 2: performance impact
- Teammate 3: test coverage validation
Report findings with severity ratings.
```

**Debugging Team:**
```
[Bug description]. Spawn 3-5 teammates to investigate different
hypotheses. Have them talk to each other to disprove each other's
theories. Update findings with whatever consensus emerges.
```

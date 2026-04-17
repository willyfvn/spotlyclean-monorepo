# Claude Code Agent Teams — Practical Guide

> Coordinate multiple Claude Code instances working together as a team, with shared tasks, inter-agent messaging, and centralized management.

---

## 1. What Are Agent Teams?

Agent teams let you run **multiple Claude Code sessions in parallel**, coordinated by a single **team lead**. Each teammate is a fully independent Claude Code instance with its own context window.

### Agent Teams vs Subagents

| | Subagents | Agent Teams |
|---|---|---|
| **Context** | Share context with parent | Fully independent context windows |
| **Communication** | Report results back only | Message each other directly |
| **Coordination** | Parent manages everything | Shared task list, self-coordination |
| **Best for** | Focused tasks where only the result matters | Complex work requiring discussion & collaboration |
| **Token cost** | Lower | Higher (each teammate = separate Claude instance) |

**Rule of thumb:** Use subagents when workers just need to report back. Use agent teams when workers need to talk to each other.

---

## 2. When to Use Agent Teams

### Best Use Cases

- **Research & review** — Multiple teammates investigate different aspects simultaneously
- **New modules/features** — Each teammate owns a separate piece without conflicts
- **Debugging with competing hypotheses** — Test different theories in parallel
- **Cross-layer coordination** — Frontend, backend, and tests each owned by a different teammate
- **Code review** — Split review by security, performance, and test coverage

### When NOT to Use Them

- Sequential tasks with hard dependencies
- Same-file edits (causes overwrites)
- Simple or routine tasks (coordination overhead > benefit)
- Tight budget (token costs scale linearly with teammates)

---

## 3. Setup

### Enable the Feature

Add to your `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Requirements

- Claude Code **v2.1.32+** (`claude --version` to check)
- For split-pane mode: **tmux** or **iTerm2** with `it2` CLI

### Display Modes

| Mode | How it works | Setup |
|---|---|---|
| **In-process** (default) | All teammates in one terminal. `Shift+Down` to cycle. | None |
| **Split panes** | Each teammate gets its own pane. | Requires tmux or iTerm2 |

Set in `~/.claude.json`:
```json
{ "teammateMode": "in-process" }
```
Or per-session: `claude --teammate-mode in-process`

---

## 4. Creating a Team

Just describe what you need in natural language. Claude creates the team, spawns teammates, and coordinates.

### Basic Example

```
Create an agent team to refactor the auth module:
- One teammate handles the backend API changes
- One teammate handles the frontend components
- One teammate writes tests for both layers
```

### Specify Models

```
Create a team with 4 teammates to review this PR.
Use Sonnet for each teammate.
```

### Require Plan Approval

For risky tasks, make teammates plan before implementing:

```
Spawn an architect teammate to redesign the database schema.
Require plan approval before they make any changes.
```

The lead reviews and approves/rejects plans before teammates proceed.

### Use Subagent Definitions as Roles

Define reusable roles (e.g., `security-reviewer`, `test-runner`) as subagent definitions, then reference them:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

---

## 5. Key Concepts

### Task List
- Shared across all teammates
- Tasks have states: **pending** → **in progress** → **completed**
- Tasks can have dependencies (blocked until dependencies complete)
- Lead assigns tasks, or teammates self-claim available work
- File locking prevents race conditions

### Communication
- **message**: Send to one specific teammate
- **broadcast**: Send to all (use sparingly — costs scale with team size)
- Messages are delivered automatically
- Idle notifications sent to lead when a teammate finishes

### Context
- Teammates load project context (CLAUDE.md, MCP servers, skills) but **NOT** the lead's conversation history
- Include task-specific details in the spawn prompt
- Give teammates enough context to work independently

### Permissions
- Teammates inherit the lead's permission settings at spawn time
- Can change individual modes after spawning
- Pre-approve common operations to reduce permission prompt friction

### Storage
- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`
- Both are auto-generated — don't edit by hand

---

## 6. Best Practices

### Team Size
- **Start with 3-5 teammates** for most workflows
- Aim for **5-6 tasks per teammate**
- 3 focused teammates > 5 scattered ones
- Scale up only when work genuinely benefits from parallelism

### Task Sizing
- **Too small**: coordination overhead exceeds the benefit
- **Too large**: teammates work too long without check-ins
- **Right size**: self-contained units with a clear deliverable (a function, test file, or review)

### Avoid File Conflicts
- Break work so **each teammate owns different files**
- Two teammates editing the same file = overwrites

### Give Context
```
Spawn a security reviewer with the prompt: "Review the auth module
at src/auth/ for vulnerabilities. Focus on token handling and session
management. The app uses JWT in httpOnly cookies. Report issues with
severity ratings."
```

### Monitor & Steer
- Check in on progress regularly
- Redirect approaches that aren't working
- If the lead starts implementing instead of delegating:
  ```
  Wait for your teammates to complete their tasks before proceeding
  ```

### Cleanup
Always clean up through the lead when done:
```
Clean up the team
```
Shut down all teammates first, then clean up.

---

## 7. Quality Gates with Hooks

Use hooks to enforce rules automatically:

| Hook | When it runs | Use case |
|---|---|---|
| `TeammateIdle` | Teammate is about to go idle | Send feedback to keep them working |
| `TaskCreated` | A task is being created | Validate task structure/scope |
| `TaskCompleted` | A task is being marked complete | Enforce quality checks before completion |

Exit with code 2 from any hook to send feedback and prevent the action.

---

## 8. Decision Framework — Do I Need an Agent Team?

Ask yourself these questions:

1. **Can the work be split into 3+ independent pieces?** → If no, use a single session
2. **Do the workers need to talk to each other?** → If no, subagents are enough
3. **Are the pieces working on different files?** → If no, risk of conflicts
4. **Is the task complex enough to justify token cost?** → If no, single session or subagents
5. **Will parallel exploration add real value?** → If no, sequential is fine

**If you answered YES to most of these → use an agent team.**

### Quick Decision Tree

```
Is the task complex enough for multiple agents?
├── NO → Single session
└── YES → Do agents need to communicate with each other?
    ├── NO → Use subagents
    └── YES → Use agent team
        ├── Can work be split by files/modules? → Good fit
        └── Same files need editing? → Risky, reconsider
```

---

## 9. Limitations

- No session resumption for in-process teammates
- Task status can lag (teammates may forget to mark complete)
- One team per session, no nested teams
- Lead is fixed (can't transfer leadership)
- Split panes not supported in VS Code terminal, Windows Terminal, or Ghostty

---

## 10. Efficient Prompt Templates

### Research Team
```
Create an agent team to research [topic]:
- Teammate 1: investigate [angle A]
- Teammate 2: investigate [angle B]
- Teammate 3: play devil's advocate and challenge findings
Have them discuss and converge on recommendations.
```

### Feature Implementation Team
```
Create an agent team to implement [feature]:
- Teammate 1: backend API at src/api/
- Teammate 2: frontend components at src/components/
- Teammate 3: tests and documentation
Require plan approval before any changes.
```

### Code Review Team
```
Create an agent team to review PR #[number]:
- Teammate 1: security implications
- Teammate 2: performance impact
- Teammate 3: test coverage validation
Report findings with severity ratings.
```

### Debugging Team
```
[Bug description]. Spawn 3-5 teammates to investigate different
hypotheses. Have them talk to each other to disprove each other's
theories. Update findings with whatever consensus emerges.
```

# Contributing to Smart Transit Service

Thank you for your interest in contributing to **smart-transit-service**! This document outlines the setup, branching strategy, workflow, and best practices to follow when contributing.

---

## 1. Repository Setup

**Repository Name:** `smart-transit-service`
**Hosting Platform:** \[GitHub]

### Initial Setup

- Repository initialized with:

  - `README.md`
  - `.gitignore`
  - `LICENSE`

- Project skeleton will be added.
- **Branch Protection Rules** (for `main` and `develop`):

  - Require at least **one code review** and **two approvals** before merging.
  - Require **successful CI checks** before merging (ignore for now).
  - Disallow direct pushes to protected branches.

---

## 2. Branching Strategy

We use **Git Flow** as our branching model.

### Main Branches

| Branch    | Purpose                                             | Rules                                        |
| --------- | --------------------------------------------------- | -------------------------------------------- |
| `main`    | Always production-ready, contains only stable code. | Protected, PR required, CI checks must pass. |
| `develop` | Integration branch for the next release.            | Protected, PR required, CI checks must pass. |

### Supporting Branches

| Branch Type | Naming Convention                       | Purpose                                                                               |
| ----------- | --------------------------------------- | ------------------------------------------------------------------------------------- |
| **Feature** | `SCRUM-<ticket number>-<feature-title>` | New feature development. Branched from `develop`, merged back via PR.                 |
| **Bugfix**  | `SCRUM-<ticket number>-<bugfix-title>`  | Non-critical bug fixes in `develop`.                                                  |
| **Hotfix**  | `SCRUM-<ticket number>-<hotfix-title>`  | Urgent production fixes. Branched from `main`, merged back into `main` and `develop`. |

---

## 3. Workflow

### Feature Development

1. Create a feature branch from `develop`.
2. Commit changes regularly with **meaningful messages**.
3. Open a Pull Request (PR) to `develop` when complete.
4. Ensure **code review**, **CI checks**, and **approval** before merging.

### Release Process

- When `develop` is stable and ready for release:

  1. Perform final testing, bug fixes, and documentation updates.
  2. Merge `develop` into `main`.
  3. Tag the commit (see [Tagging Strategy](#4-tagging-strategy-production-releases)).

### Hotfix Process

- When a production issue is found:

  1. Create a hotfix having JIRA reference `SCRUM-<ticket number-title>` branch from `main`.
  2. Apply the fix, test, and create a PR into `main`.
  3. Tag the merge commit.
  4. Merge the fix back into `develop`.

---

## 4. Tagging Strategy (Production Releases)

- **Tag Format:** `vX.Y.Z`

  - `X` – Major version (breaking changes)
  - `Y` – Minor version (new features, backward compatible)
  - `Z` – Patch version (bug fixes)

**Example:** `v1.2.3`

Create annotated tags with release notes:

```bash
git tag -a v1.2.3 -m "Release v1.2.3 - Added route optimization and bug fixes"
git push origin v1.2.3
```

---

## 5. Commit Message Guidelines

We follow **Conventional Commits** for clarity:

| Type        | Usage                      |
| ----------- | -------------------------- |
| `feat:`     | New feature                |
| `fix:`      | Bug fix                    |
| `docs:`     | Documentation changes      |
| `chore:`    | Build or maintenance tasks |
| `refactor:` | Code refactoring           |
| `test:`     | Adding or modifying tests  |

**Example:**

```bash
feat: add real-time bus tracking feature
fix: correct fare calculation bug for express routes
```

---

## 6. Best Practices

- Always **pull the latest changes** before starting or committing to a branch.
- Keep feature branches **short-lived** to reduce merge conflicts.
- Write **meaningful PR descriptions** and link to Jira tickets.
- **Delete merged branches** to keep the repository clean.
- Use **draft PRs** for work-in-progress code to get early feedback.

---

Happy coding and thank you for contributing!

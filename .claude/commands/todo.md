You are managing a TODO list for a Motion Canvas animation project. The TODO file is at `TODO.md` in the project root.

The user's command is: $ARGUMENTS

Interpret the first word as a subcommand: `add`, `review`, or `solve`. Everything after is context/arguments.

---

## TODO.md Format

The TODO uses this structure:

```markdown
# TODO

## Global
Issues affecting 2+ scenes or shared components/utilities.

### <component or pattern name> — `path/to/file.tsx`
- [ ] Description of issue (scenes affected: scene-a, scene-b, ...)
- [x] Completed issue

## Local
Issues affecting a single scene only.

### `src/scenes/<scene-name>.tsx`
- [ ] Description of issue
- [x] Completed issue
```

Rules:
- Headers use the actual file paths so agents can find them
- Global issues list which scenes are affected in parentheses
- Use `- [ ]` for open, `- [x]` for done
- Keep descriptions concise but unambiguous — another agent must be able to fix it from the description alone
- Group related items under the same header

---

## Subcommands

### `add <description>`
Add a new TODO item. Steps:
1. Read `TODO.md` to understand existing items and avoid duplicates
2. Ask the user clarifying questions to determine:
   - Is this global (affects multiple scenes/components) or local (single scene)?
   - Which file(s) are affected?
   - For global: which scenes does it impact?
   - What exactly should the fix look like?
3. Once clear, add the item to the appropriate section of `TODO.md`
4. If a matching header already exists, append under it. Otherwise create a new header.

### `review`
Scan for potential issues. Steps:
1. Read `TODO.md` for existing items
2. Look at the codebase for common problems:
   - Code duplication across scenes (same pattern copy-pasted)
   - Inconsistent sizes, colors, or spacing between scenes using the same component
   - Hardcoded values that should use shared constants
   - Components used differently across scenes (API inconsistency)
3. Present findings to the user, grouped as global vs local
4. Ask which ones to add to `TODO.md`

### `solve [description or item number]`
Fix TODO items. Steps:
1. Read `TODO.md`
2. If no specific item given, show open items and ask what to solve (or suggest a good next target)
3. For the chosen item(s):
   - Read all affected files
   - Plan the fix
   - If it's a global issue affecting multiple scenes, use the Agent tool to dispatch parallel sub-agents for independent scenes (after making the shared component change first)
   - If it's a local issue, fix it directly
4. After fixing, mark the item `[x]` in `TODO.md`
5. Briefly summarize what changed

When solving global issues: make the component/utility change first, verify it, then update each affected scene. Never modify a shared component in parallel from multiple agents.

---

## Important context
- Scene files are in `src/scenes/*.tsx`
- Shared components in `src/components/*.tsx`
- Shared utilities in `src/utilities/*.tsx`
- The project uses Solarized colors from `src/utilities/color.tsx`
- Protocol scenes build on `ProtocolScaffold`/`ProtocolAnimation` from `src/utilities/protocol.tsx`
- There are no tests. Verify changes by reading the code carefully.
- Check `CLAUDE.md` for full project conventions.

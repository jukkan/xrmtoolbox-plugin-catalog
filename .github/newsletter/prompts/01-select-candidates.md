# Step 1: Select top candidates (deterministic)

Objective:
- Identify the top new plugins and top updated plugins for the newsletter.

Rules:
- Use only fields in the monthly snapshot.
- Compute a deterministic score per plugin using version-controlled ranking heuristics.
- Sort descending by score.
- Resolve ties by `name`, then `mctools_pluginid`.
- Keep only the configured top N entries for each bucket.

Output contract:
- `candidates.new[]`
- `candidates.updated[]`
- each item includes score breakdown for auditability.

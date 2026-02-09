# Step 2: Produce short summaries and use-cases (deterministic)

Objective:
- Create concise, consistent blurbs for selected plugins.

Rules:
- No external calls.
- Build summary text from plugin name, author, rating, downloads, and recency.
- Keep copy neutral and factual.
- Use one sentence for "summary" and one sentence for "useCase".

Output contract:
- `summaries.new[]`
- `summaries.updated[]`
- each item includes `pluginId`, `name`, `author`, `summary`, `useCase`.

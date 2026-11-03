# HA Task Manager

Local-first Home Assistant task manager (early development). The project aims to
provide a dedicated sidebar application backed by native `todo` entities, with
additional metadata stored locally in Home Assistant.

**Status:** Milestone 1 foundation in progress. The current scaffold provides a
config flow only; the sidebar panel, task storage, list discovery, and task editing
are **not yet implemented**. Do not install expecting a working task manager.

See [`specs.md`](specs.md) for product requirements and [`AGENTS.md`](AGENTS.md)
for contributor/AI development instructions.

## Development checks

```bash
python -m pip install ruff pytest
ruff check .
ruff format --check .
pytest -q
```

No real task data, credentials, local IP addresses, or personal configuration
should be committed to this public repository.

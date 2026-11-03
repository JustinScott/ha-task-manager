"""Configuration flow for HA Task Manager."""

from __future__ import annotations

from typing import Any

from homeassistant import config_entries

from .const import DOMAIN


class TaskManagerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure a single local task manager instance."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Create a local-only config entry with no credentials."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            return self.async_create_entry(title="HA Task Manager", data={})
        return self.async_show_form(step_id="user")

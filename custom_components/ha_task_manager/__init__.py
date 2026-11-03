"""Home Assistant Task Manager integration foundation."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import panel_custom
from homeassistant.components.frontend import async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN

PANEL_PATH = "ha-task-manager"
ASSET_URL = "/ha_task_manager_static"
PANEL_ELEMENT = "ha-task-manager-panel"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register a dedicated, local-only sidebar panel."""
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                f"{ASSET_URL}/panel.js",
                str(Path(__file__).parent / "frontend" / "panel.js"),
                cache_headers=False,
            )
        ]
    )
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_PATH,
        webcomponent_name=PANEL_ELEMENT,
        sidebar_title="Lists",
        sidebar_icon="mdi:format-list-checks",
        module_url=f"{ASSET_URL}/panel.js",
        require_admin=False,
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the sidebar panel when the integration unloads."""
    async_remove_panel(hass, PANEL_PATH)
    return True

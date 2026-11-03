/** Early milestone 1 panel: read-only native todo entity discovery. */
class HaTaskManagerPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = undefined;
    this._selected = "";
  }

  set hass(value) {
    this._hass = value;
    this.render();
  }

  set panel(value) {
    this._panel = value;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    const states = this._hass?.states ?? {};
    const entities = Object.values(states)
      .filter((state) => state.entity_id.startsWith("todo."))
      .sort((a, b) => {
        const an = a.attributes.friendly_name || a.entity_id;
        const bn = b.attributes.friendly_name || b.entity_id;
        return an.localeCompare(bn);
      });
    if (!entities.some((entity) => entity.entity_id === this._selected)) {
      this._selected = entities[0]?.entity_id || "";
    }
    const chosen = entities.find((entity) => entity.entity_id === this._selected);
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family, sans-serif); }
      main { max-width: 1100px; margin: 0 auto; padding: 24px; }
      header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
      h1 { font-size: 26px; font-weight: 600; margin: 0 0 20px; }
      .layout { display: grid; grid-template-columns: minmax(210px, 280px) minmax(0, 1fr); gap: 18px; }
      nav, article { background: var(--card-background-color); border: 1px solid var(--divider-color); border-radius: 12px; padding: 16px; }
      button { display: block; width: 100%; padding: 12px; border: 0; border-radius: 8px; text-align: left; color: inherit; background: transparent; cursor: pointer; font: inherit; }
      button[aria-current="true"] { background: var(--secondary-background-color); font-weight: 600; }
      button:focus-visible { outline: 2px solid var(--primary-color); }
      .muted { color: var(--secondary-text-color); }
      .notice { border-left: 3px solid var(--primary-color); padding: 10px 12px; background: var(--secondary-background-color); }
      .entity-id { overflow-wrap: anywhere; }
      @media (max-width: 650px) { main { padding: 12px; } .layout { grid-template-columns: 1fr; } }
    `;
    const main = document.createElement("main");
    const heading = document.createElement("h1");
    heading.textContent = "Lists";
    main.append(heading);
    const layout = document.createElement("div");
    layout.className = "layout";
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Available to-do lists");
    const navHeading = document.createElement("strong");
    navHeading.textContent = "Available lists";
    nav.append(navHeading);
    for (const entity of entities) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = entity.attributes.friendly_name || entity.entity_id;
      button.setAttribute("aria-current", String(entity.entity_id === this._selected));
      button.addEventListener("click", () => {
        this._selected = entity.entity_id;
        this.render();
      });
      nav.append(button);
    }
    if (!entities.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No to-do entities are currently visible. Add a Local To-do list in Home Assistant first.";
      nav.append(empty);
    }
    const article = document.createElement("article");
    const title = document.createElement("h2");
    title.textContent = chosen?.attributes.friendly_name || "Choose a list";
    article.append(title);
    if (chosen) {
      const id = document.createElement("p");
      id.className = "muted entity-id";
      id.textContent = chosen.entity_id;
      article.append(id);
      const status = document.createElement("p");
      status.textContent = `Entity state: ${chosen.state}`;
      article.append(status);
    }
    const notice = document.createElement("p");
    notice.className = "notice";
    notice.textContent = "Milestone 1 preview: list discovery only. Task items, editing, and saved provider selection are not implemented yet.";
    article.append(notice);
    layout.append(nav, article);
    main.append(layout);
    this.shadowRoot.replaceChildren(style, main);
  }
}
if (!customElements.get("ha-task-manager-panel")) {
  customElements.define("ha-task-manager-panel", HaTaskManagerPanel);
}


export class IvyLegendHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        const subtitle = this.getAttribute('subtitle');
        
        this.shadowRoot!.innerHTML = `
        <h1 class="text-2xl font-bold">${title}</h1>
        <p class="text-lg">${subtitle}</p>
      `;
    }
}
customElements.define('ivy-legend-header', IvyLegendHeader);
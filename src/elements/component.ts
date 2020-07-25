
export interface HTMLComponent {
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    adoptedCallback(): void;
}

export interface BaseComponent extends HTMLComponent {
    model: any;
    [key: string]: any;
    // observable: Observable;
}


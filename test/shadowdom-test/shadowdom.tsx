import { Component, HostListener, View } from '../../dist/aurora.js';


@Component({
    selector: 'fancy-tabs',
    encapsulation: 'shadow-dom',
    shadowDomMode: 'closed',
    shadowDomDelegatesFocus: true,
    template:
        `
        <input type="text" value="data" />
        <div id="tabs">
            <slot id="tabsSlot" name="title">
                <button slot="title">Title</button>
                <button slot="title" selected>Title 2</button>
                <button slot="title">Title 3</button>
            </slot>
        </div>
        <div id="panels">
            <slot id="panelsSlot">
                <section>content panel 1</section>
                <section>content panel 2</section>
                <section>content panel 3</section>
            </slot>
        </div>
        `
})
export class FancyTabs {

}


@Component({
    selector: 'x-focus',
    encapsulation: 'shadow-dom',
    shadowDomDelegatesFocus: true,
    extend: 'div',
    template:
        `
        <style>
            :host {
                display: flex;
                border: 1px dotted black;
                padding: 16px;
            }
            :focus {
                outline: 2px solid blue;
            }
        </style>
        <div>Clickable Shadow DOM text</div>
        <!-- ddd -->
        <input type="text" placeholder="Input inside shadow dom" >

        <!-- multi
            line 
            comment -->
        `
})
class XFocus {

    @View()
    div: HTMLDivElement;

    @HostListener('focus')
    focusEventListener(e: Event) {
        console.log('Active element (inside shadow dom):', this.div.shadowRoot?.activeElement);
    }
}


@Component({
    selector: 'tabs-root',
    // encapsulation: 'shadow-dom',
    template:
        `
        <x-focus></x-focus>
        <fancy-tabs>
            <button slot="title">Title Baca</button>
            <button slot="title" selected>Title 2</button>
            <button slot="title">Title 3</button>
            <bootstrap-button slot="title">bootstrap-button</bootstrap-button>
            <section>content panel 1</section>
            <section>content panel 2</section>
            <section>content panel 3</section>
        </fancy-tabs>

        <fancy-tabs>
            <h2 slot="title">Title</h2>
            <section>content panel 1</section>
            <h2 slot="title" selected>Title 2</h2>
            <section>content panel 2</section>
            <h2 slot="title">Title 3</h2>
            <section>content panel 3</section>
        </fancy-tabs>
        `
})
export class FancyTabsRoot {

}



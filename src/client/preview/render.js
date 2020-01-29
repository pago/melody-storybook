import { document } from 'global';
import dedent from 'ts-dedent';
import {
    mount,
    patchOuter,
    elementOpen,
    elementClose,
    unmountComponent,
} from 'melody-idom';
import { logger } from '@storybook/client-logger';

const root = document.getElementById('root');
let rootEl = null; // = document.createElement('div');
// root.appendChild(rootEl);
let activeTemplate = null; // template for the currently loaded component.
// let component = null;

function render(el, template, props) {
    const result = patchOuter(el, () => {
        elementOpen('div', 'secret-key');
        if (template.prototype.apply) {
            mount(el, template, props);
        } else {
            template(props);
        }
        elementClose('div');
    });
    return result;
}

function unmountComponentAtNode(node) {
    if (!node) {
        return;
    }
    const data = node['__incrementalDOMData'];
    // No data? No component.
    if (!data) {
        return;
    }
    // No componentInstance? Unmounting not needed.
    const { componentInstance } = data;
    if (!componentInstance) {
        return;
    }
    // Tear down components
    unmountComponent(componentInstance);
    // Remove node data
    node['__incrementalDOMData'] = undefined;
}

export default function renderMain({
    storyFn,
    selectedKind,
    selectedStory,
    showMain,
    showError,
    parameters,
    // forceRender,
}) {
    const config = storyFn();

    if (!config || !(config.component || parameters.component)) {
        showError({
            title: `Expecting an object with a component property to be returned from the story: "${selectedStory}" of "${selectedKind}".`,
            description: dedent`
        Did you forget to return the component from the story?
        Use "() => ({ component: MyComponent, props: { hello: 'world' } })" when defining the story.
      `,
        });

        return;
    }
    const template = config.component || parameters.component;

    if (activeTemplate === template) {
        // When rendering the same template with new input, we reuse the same instance.
        render(rootEl, template, config.props);
    } else {
        if (rootEl) {
            unmountComponentAtNode(rootEl);
        }

        // if (activeTemplate) {
        let node;
        while ((node = root.firstElementChild)) {
            unmountComponentAtNode(node);
            root.removeChild(node);
        }
        // }

        root.innerHTML = '';
        rootEl = document.createElement('div');
        root.appendChild(rootEl);

        activeTemplate = template;
        render(rootEl, template, config.props);
    }

    showMain();
}

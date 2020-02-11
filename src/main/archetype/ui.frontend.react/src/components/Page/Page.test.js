import { ModelManager } from '@adobe/cq-spa-page-model-manager';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import Page from './Page';

describe('Page ->', () => {
  const ROOT_NODE_CLASS_NAME = 'route-node';
  const PAGE_CLASS_NAME = 'page';

  let rootNode;

  let sandbox = sinon.createSandbox();

  beforeEach(() => {
    rootNode = document.createElement('div');
    rootNode.className = ROOT_NODE_CLASS_NAME;
    document.body.appendChild(rootNode);

    ModelManager.initialize();

    expect(document.querySelector('.' + ROOT_NODE_CLASS_NAME)).not.toBeNull();
  });

  afterEach(() => {
    window.location.hash = '';

    if (rootNode) {
      document.body.removeChild(rootNode);
    }

    sandbox.restore();
  });

  it('should render the page component with no parameter', () => {
    expect(rootNode.childElementCount).toEqual(0);
    ReactDOM.render(<Page />, rootNode);

    expect(rootNode.childElementCount).toEqual(1);

    expect(rootNode.querySelector('.' + PAGE_CLASS_NAME)).not.toBeNull();
  });

  it('should render the page component with no parameter', () => {
    const EXTRA_CLASS_NAMES = 'test-class-names';

    expect(rootNode.childElementCount).toEqual(0);

    ReactDOM.render(<Page cssClassNames={EXTRA_CLASS_NAMES} />, rootNode);

    expect(rootNode.childElementCount).toEqual(1);

    expect(rootNode.querySelector('.' + EXTRA_CLASS_NAMES)).not.toBeNull();
  });
});

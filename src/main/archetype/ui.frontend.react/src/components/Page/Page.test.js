/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { ModelManager } from '@adobe/aem-spa-page-model-manager';
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

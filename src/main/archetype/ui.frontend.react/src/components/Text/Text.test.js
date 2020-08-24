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
import extractModelId from '../../utils/extract-model-id';
import Text from './Text';

describe('Text ->', () => {
  const ROOT_NODE_CLASS_NAME = 'route-node';
  const RTE_EDIT_ELEMENT_DATA_ATTR_SELECTOR = '[data-rte-editelement]';
  const CONTENT_PATH = '/content/test/cq/path';
  const TEXT_DATA_CLASS_NAME = 'text-data-selector';
  const TEXT_DATA_STR = 'dummy string text';
  const TEXT_DATA = `<span class="${TEXT_DATA_CLASS_NAME}">${TEXT_DATA_STR}</span>`;

  let rootNode;

  let sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox
      .stub(ModelManager, 'getData')
      .withArgs({ pagePath: CONTENT_PATH })
      .resolves({ test: true });

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

  it('should render the text component with no parameter', () => {
    expect(rootNode.childElementCount).toEqual(0);
    ReactDOM.render(<Text />, rootNode);

    expect(rootNode.childElementCount).toEqual(1);

    expect(
      rootNode.querySelector(RTE_EDIT_ELEMENT_DATA_ATTR_SELECTOR)
    ).toBeNull();
  });

  it('should render the text component that contains the provided text as a string', () => {
    expect(rootNode.childElementCount).toEqual(0);
    ReactDOM.render(<Text text={TEXT_DATA} />, rootNode);

    expect(rootNode.childElementCount).toEqual(1);

    expect(
      rootNode.querySelector(RTE_EDIT_ELEMENT_DATA_ATTR_SELECTOR)
    ).toBeNull();
    expect(rootNode.firstChild.innerHTML).toContain(TEXT_DATA_STR);
  });

  it('should render the text component that contains the provided text as a DOM structure', () => {
    expect(rootNode.childElementCount).toEqual(0);
    ReactDOM.render(<Text text={TEXT_DATA} richText={true} />, rootNode);

    expect(rootNode.childElementCount).toEqual(1);

    expect(
      rootNode.querySelector(RTE_EDIT_ELEMENT_DATA_ATTR_SELECTOR)
    ).not.toBeNull();
    expect(rootNode.querySelector('.' + TEXT_DATA_CLASS_NAME).innerHTML).toBe(
      TEXT_DATA_STR
    );
  });

  it('should render the text as a rich text component', () => {
    expect(rootNode.childElementCount).toEqual(0);
    ReactDOM.render(<Text richText={true} />, rootNode);

    expect(rootNode.childElementCount).toEqual(1);

    expect(
      rootNode.querySelector(RTE_EDIT_ELEMENT_DATA_ATTR_SELECTOR)
    ).not.toBeNull();
  });

  it('should render the text as a rich text component with a given id', () => {
    expect(rootNode.childElementCount).toEqual(0);

    ReactDOM.render(<Text cqPath={CONTENT_PATH} richText={true} />, rootNode);

    expect(rootNode.childElementCount).toEqual(1);

    expect(
      rootNode.querySelector(RTE_EDIT_ELEMENT_DATA_ATTR_SELECTOR)
    ).not.toBeNull();
    expect(
      rootNode.querySelector('#' + extractModelId(CONTENT_PATH))
    ).not.toBeNull();
  });
});

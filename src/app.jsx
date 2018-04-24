import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './Root';

export function run() {
  render(Root);
}

function render(RootComponent) {
  ReactDOM.render(<RootComponent />, document.getElementById('root'));
}

if (module.hot) {
  module.hot.dispose(() => {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  });
  module.hot.accept(() => {
    const NextRoot = require('./Root').Root;
    render(NextRoot);
  });
}

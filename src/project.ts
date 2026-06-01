import { makeProject } from '@motion-canvas/core';

import basic from './scenes/examples/basic?scene';
import code from './scenes/examples/code?scene';
import fontDemo from './scenes/examples/font-demo?scene';
import text from './scenes/examples/text?scene';
import threeDemo from './scenes/examples/three-demo?scene';

import './global.css';
import './monkeypatch';

export default makeProject({
  experimentalFeatures: true,
  scenes: [basic, text, code, fontDemo, threeDemo],
});

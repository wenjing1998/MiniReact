import React, { useEffect } from 'react';
import ReactDom from 'react-dom';
import { SVG } from '@svgdotjs/svg.js';

const Svg = () => {
  const divStyle = {
    width: '600px',
    height: '600px',
    border: '1px solid black'
  };

  // 直线五角星的五条直线
  const straightPentagram = [
    'M0 200 600 200',
    'M300 0 100 600',
    'M300 0 500 600',
    'M0 200 500 600',
    'M600 200 100 600'
  ];

  const propotion = Math.sqrt(Math.pow(3, 2) + Math.pow(6, 2)) * 2;

  // 萌化五角星的五条曲线(太难算了，放弃哈哈哈)
  const curvesPentagram = [
    'M0 200 C0 50, 600 50 600 200',
    // `M300 0 C${300 - 6 / propotion * 100} ${- 3 / propotion * 100}, ${50 - 6 / propotion * 100} ${600 - 3 / propotion * 100} 100 600`,
    'M300 0 C50 0, 0 550 100 600',
    'M300 0 C550 0, 550 600 500 600',
    'M0 200 C-40 230, 470 630 500 600',
    'M600 200 C630 240, 90 630 100 600'
  ];

  useEffect(() => {
    const draw = SVG().addTo('#divContainer').size(600, 600);

    // straightPentagram.forEach(lineInfo => {
    curvesPentagram.forEach(lineInfo => {
      const path = draw.path(lineInfo);

      path.stroke('red');
      path.fill('rgba(255, 255, 255, 0)');
    });
  }, []);

  return (
    <div id="divContainer" style={divStyle}></div>
  );
};

const element = <Svg />;

const container = document.getElementById('root');

ReactDom.render(element, container);

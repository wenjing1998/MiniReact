// import React from 'react';
// import ReactDom from 'react-dom';
import MiniReact from "../MiniReact";

import './style.css';

/** @jsx MiniReact.createElement */
const Color = () => {
  // const pig = 'https://sf3-ttcdn-tos.pstatp.com/img/user-avatar/69799d96b9fca04f674d3007f1c41a92~300x300.image';
  const girl = 'https://avatars.githubusercontent.com/u/51306705?s=400&u=79e65d18f14b02c2403aa6a11fb7f781cfacbcdd&v=4';

  // 运用到字符串跨行使用
  // 考虑图片居中
  const divStyle = `
    border: 1px solid black;
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-image: url(${girl});
    // background-position: 50% 50%;
    // background-repeat: no-repeat;
    // background-size: auto 100%;
    // opacity: 1;
    // // transform: scale(1.5); // 放大到原来的1.5
    // transform-origin: center center;
    // filter: blur(30px);
  `;

  const imgStyle = `
    width: 200px;
    height: 200px;
    // filter: none;
  `;

  return (
    // 直接把 img 放到 div 里，img 也糊了。
    // 考虑1: div 的 filter 会 继承给 img？在 img 上使用 filfer: none 想要覆盖继承的属性值，发现没有效果;
    // 考虑2: div 内的元素都会被覆盖？在div 内使用了 block 标签、inline 标签都不行。
    // 最后 google 一下解决办法：
    <div style={divStyle} className="containerDiv">
      {/* <img src="../images/jxau.jpg" alt="jxau" style={imgStyle} /> */}
      {/* <img src="../images/flower.png" alt="flower" style={imgStyle} /> */}
      <img src={girl} alt="girl" style={imgStyle} />
      {/* <div>我想看看filter这个属性是怎么了</div> */}
      {/* <span>我想看看filter这个属性是怎么了</span> */}
    </div>
    // <div>
    //   <div style={divStyle}></div>
    //   <img src={pig} alt="pig" style={imgStyle} />
    // </div>
  );
};

const element = <Color />;

const container = document.getElementById('root');

MiniReact.render(element, container);

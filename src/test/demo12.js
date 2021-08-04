import React from 'react';
import ReactDom from 'react-dom';


class Watermark {
  constructor(props) {
    const { parentId, width, height, fontSize, fontFamily, color, alpha, rotate, text, ...opts } = props;
    this.options = {
      width: width || 100,
      height: height || 100,
      fontSize: fontSize || '20px',
      fontFamily: fontFamily || 'Arial',
      color: color || 'black',
      alpha: alpha || 1,
      rotate: rotate || 135,
      ...opts
    };
    this.text = text || '水印';
    this.parentId = parentId;
    this.watermarkId = 'watermark';
    this.createCanvasUrl = this.createCanvasUrl.bind(this);
    this.createDom = this.createDom.bind(this);
  }

  createCanvasUrl() {
    const element = document.createElement('canvas');
    const canvas = element.getContext('2d');

    // 一个canvas水印的必要属性：width、height、text、样式（font-size、font-family、倾斜度等）
    element.width = this.options.width;
    element.height = this.options.height;

    canvas.font = `${this.options.fontSize} ${this.options.fontFamily}`;
    canvas.globalAlpha = this.options.alpha;

    canvas.translate(Math.floor(this.options.width / 2), Math.floor(this.options.height / 2));
    canvas.rotate(-this.options.rotate * Math.PI / 180);
    // canvas.fillText(this.text, 0, 0);
    // 如何画倒三角
    canvas.fillRect(0, 0, 100, 100);
    canvas.fillStyle = this.options.color;

    return element.toDataURL();
  }

  createObserver({ dom, config, observer }) {
    const mutation = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
    if (mutation) {
      const listener = new MutationObserver(observer);
      listener.observe(dom, config);
    }
  }

  createDom() {
    const dom = document.getElementById(this.watermarkId);

    if (!dom) {
      const watermarkDom = document.createElement('div');
      const styleOptions = `
        width: 100%;
        height: 100%;
        // position: fixed;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        pointer-event: none;
        background-image: url(${this.createCanvasUrl()});
        background-repeat: repeat;
      `;
      watermarkDom.id = this.watermarkId;
      watermarkDom.style = styleOptions;
      const parentNode = document.getElementById(this.parentId) || document.body;
      parentNode.appendChild(watermarkDom);

      const observerConfig = {
        attributes: true,
        childList: true,
        subtree: true
      };

      // 检测水印节点样式属性被修改
      const watermarkStyleObserver = () => {
        if (watermarkDom && watermarkDom.style !==  styleOptions) {
          watermarkDom.style = styleOptions;
        }
      };

      // 监察水印元素
      this.createObserver({
        dom: watermarkDom,
        config: observerConfig,
        observer: watermarkStyleObserver
      });
    }
  }

  // 监察水印元素的父元素
  observerDom() {
    const parentDom = document.getElementById(this.parentId) || document.body;
    const parentObserverConfig = {
      childList: true
    };
    const parentObserver = () => this.createDom();

    this.createObserver({
      dom: parentDom,
      config: parentObserverConfig,
      observer: parentObserver
    });
  }
};

const useWaterMark = () => {
  const loadMark = () => {
    const options = {
      text: '大水印',
      parentId: 'divContainer'
    };
    const mark = new Watermark(options);
    mark.createDom();
  };

  window.onload = () => {
    loadMark();
  };
};


const Picture = () => {
  const girl = 'https://avatars.githubusercontent.com/u/51306705?s=400&u=79e65d18f14b02c2403aa6a11fb7f781cfacbcdd&v=4';

  const divStyle = {
    width: '500px',
    height: '500px',
    border: '1px solid black',
    position: 'relative'
  };

  useWaterMark();

  const handleDrag = () => {};

  const handleDrop = e => {
    // console.log('drop event', e);
    e.preventDefault();
    const element = document.getElementById('img');
    // console.log('e.pageX', e.pageX);
    // console.log('e.pageY', e.pageY);
    const top = Math.round(e.pageY / 100) * 100;
    const left = Math.round(e.pageX / 100) * 100;
    // console.log('top', top);
    // console.log('left', left);
    element.style = `
      position: absolute;
      top: ${top}px;
      left: ${left}px;
    `;
  };

  const handleDragStart = () => {};

  const handleDragOver = e => {
    // 必须，否则不会触发 drop 方法
    e.preventDefault();
  };

  return (
    <div style={divStyle} id="divContainer" onDrop={handleDrop} onDragOver={handleDragOver}>
      <img id="img" src={girl} alt="girl" width="100px" height="100px"
        onDrag={handleDrag} onDragStart={handleDragStart} draggable="true" />
    </div>
  );
};

const element = <Picture />;

const container = document.getElementById('root');

ReactDom.render(element, container);

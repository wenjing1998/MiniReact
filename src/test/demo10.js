import React, { useEffect } from 'react';
import ReactDom from 'react-dom';
// import MiniReact from '../MiniReact';

// 2、如何获取到图片主题颜色？首先得拿到图片颜色信息
function getMainColor(image) {
  return new Promise((resolve, reject) => {
    try {
      // const img = document.getElementById('img'); // 此处或许图片还没有加载完，获取不到颜色信息
      // console.log(img);

      const canvas = document.createElement('canvas');
      // canvas.width = img.width;
      // canvas.height = img.height;
      // const context = canvas.getContext('2d');

      const img = new Image();
      img.src = image;
      img.crossOrigin = "Anonymous"; // 解决报错：Uncaught SecurityError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data. 
      img.onload = () => {
        const colorList = getImageColor(canvas, img);
        const color = colorList[0].color;
        resolve(color);
      };

      // const pixelData = context.getImageData(0, 0, img.width, img.height).data;
      // console.log('pixelData', pixelData);
      // const colorList = getCountsArr(pixelData);
      // console.log('colorList', colorList);
      // const color = colorList[0]?.color;
      // resolve(color);
    } catch (e) {
      reject(e);
    }
  });
};

function getImageColor(canvas, img) {
  // 3、如何获取到图片的颜色信息？将 img 画在 canvas 上，使用 canvas 的 getImageData 方法获取图片信息。
  const context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);

  const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  console.log('imgData', imgData);

  const pixelData = imgData.data; // 拿到的这些值是啥意义？
  console.log('pixelData', pixelData);

  return getCountsArr(pixelData);
};

// 4、图片颜色信息拿到了之后，需要根据出现的次数排序，找到出现次数最多的主题颜色。
// 此处的算法还是存在问题，比如图片大片留白，最后拿到的颜色大概率是白色，不符合期望效果。
function getCountsArr(pixelData) {
  let colorList = [];
  let rgba = [];
  let rgbaStr = "";
  // 分组循环
  for (let i = 0; i < pixelData.length; i += 4) {
    rgba[0] = pixelData[i];
    rgba[1] = pixelData[i + 1];
    rgba[2] = pixelData[i + 2];
    rgba[3] = pixelData[i + 3];

    if (rgba.indexOf(undefined) !== -1 || pixelData[i + 3] === 0) {
      continue;
    }

    // console.log("rgba", rgba);

    rgbaStr = rgba.join(",");
    if (rgbaStr in colorList) {
      ++colorList[rgbaStr];
    } else {
      colorList[rgbaStr] = 1;
    }
  }
  console.log("colorList", colorList);

  const arr = [];
  for (let prop in colorList) {
    arr.push({
      // 如果只获取rgb,则为`rgb(${prop})`
      color: `rgba(${prop})`,
      count: colorList[prop],
    });
  }
  // 数组排序
  arr.sort((a, b) => {
    return b.count - a.count;
  });
  
  console.log("arr", arr);// [{ color: rgba(64, 95, 219, 255), count: 100 }]

  return arr;
};

const Color = () => {
  const pig = 'https://sf3-ttcdn-tos.pstatp.com/img/user-avatar/69799d96b9fca04f674d3007f1c41a92~300x300.image';
  // const girl = 'https://avatars.githubusercontent.com/u/51306705?s=400&u=79e65d18f14b02c2403aa6a11fb7f781cfacbcdd&v=4';
  const blue = 'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6062f650d53448eab2279330f944064e~tplv-k3u1fbpfcp-watermark.image';

  const divStyle = {
    border: '1px solid black',
    width: '500px',
    height: '500px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
    // background-image: url(${blue});
    // background-position: 50% 50%;
    // background-repeat: no-repeat;
    // background-size: auto 100%;
    // opacity: 1;
    // // transform: scale(1.5); // 放大到原来的1.5
    // transform-origin: center center;
    // filter: blur(30px);
  };

  useEffect(() => {
    // 即使在useEffect处去取也拿不到img的颜色信息？
    // 1、目标：获取到图片主题 color 设置为父级 div 的背景颜色。
    // 异步编程的方式：promise、回调函数、事件模型
    getMainColor(blue).then(color => {
      console.log('useEffect color', color);
      const containerDiv = document.getElementById('containerDiv');
      containerDiv.style.backgroundColor = color;
    });
  }, []);

  return (
    <div id="containerDiv" style={divStyle}>
      <img id="img" src={blue} alt="blue" width="100px" height="100px" />
    </div>
  );
};

const element = <Color />;

const container = document.getElementById('root');

ReactDom.render(element, container);


function createElement(type, props, ...children) {
  // createElement 为什么想要输出 object 呢？
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object'
          ? child
          : createTextElement(child)
      )
    }
  };

  // createElement 结束：携带元素：type、props: { ...props, children: [] }
};

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
};

export default createElement;

// And that’s it. We now have a library that can render JSX to the DOM.

// To render a React element into a root DOM node
// a recursive call
// const render = (element, container) => {
//   // element = {
//   //   type: 'div',
//   //   props: {
//   //     name: 'foo',
//   //     children: []
//   //   }
//   // }
  
//   // type
//   const dom = element.type === 'TEXT_ELEMENT'
//     ? document.createTextNode('')
//     : document.createElement(element.type);

//   // props
//   const isProperty = key => key !== 'children';
//   Object.keys(element.props)
//     .filter(isProperty)
//     .forEach(name => {
//       dom[name] = element.props[name];
//     });

//   // children
//   element.props.children.forEach(child =>
//     // recursively 递归地
//     render(child, dom)
//   );

//   container.appendChild(dom);
// };

// Concurrent Mode （并发模式是否稳定？）

// 优化： There’s a problem with this recursive call.

// Once we start rendering, we won’t stop until we have rendered the complete element tree. 
// If the element tree is big, it may block the main thread for too long. 
// And if the browser needs to do high priority stuff like handling user input or keeping an animation smooth, 
// it will have to wait until the render finishes.

function render(element, container) {
  // TODO set next unit of work
  // a DOM node
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
};

let nextUnitOfWork = null;

// 问题：这个函数的输出思路没有讲明，为何如此设计？
// loop 循环
function workLoop(deadline) {
  // deadline ：check how much time we have until the browser needs to take control again.

  // yield 给让路
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    );
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 使用 requestIdleCallback 来创建一个循环
  // idle 闲置的
  requestIdleCallback(workLoop);
}

// when the main thread is idle 当主线程闲置会执行这个 callback （？）
requestIdleCallback(workLoop);

// Note that React 现在已经使用 schedule package 代替了使用 requestIdleCallback。



// Fibers

// perform 执行
// not only performs the work but also returns the next unit of work（输入需要执行的，输出下一个需要执行的）
// 一个 fiber 也是一个 object
function performUnitOfWork(fiber) {
  // 1、add the element to the DOM;
  // 2、create the fibers for the element's children;
  // 3、select the next unit of work.

  // TODO add dom node: create a new node and append it to the DOM.
  // keep track of the DOM node in the fiber.dom property?
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // TODO create new fibers: for each child we create a new fiber.
  // just like render 中的 nextUnitOfWork
  const elements = fiber.props.children;
  let index = 0;
  // prevSibling object 代表的是？父母的兄弟姐妹？
  let prevSibling = null;

  while (index < elements.length) {
    // 当存在 child
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };

    // And we add it to the fiber tree setting it either as a child or as a sibling, depending on whether it’s the first child or not.

    if (index === 0) {
      // first child
      fiber.child = newFiber;
    } else {
      // prevSibling.sibling 指代什么？
      prevSibling.sibling = newFiber;
    }

    // ?
    prevSibling = newFiber;
    index++;
  }
  // while 结束，一个完整的 fiber tree 也创建完成，之后只需要沿着树做渲染。

  // TODO return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
    // 指向 parent 的话岂不是又会找到 child？找到parent的sibling，而不是找到parent然后继续找child的循环。。
  }
}

function createDom(fiber) {

};

export default render;


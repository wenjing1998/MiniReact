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

let wipRoot = null;
let currentRoot = null;
let deletions = null;
let nextUnitOfWork = null;

function createDom(fiber) {
  // console.log('createDom fiber', fiber);
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);
  // console.log('createDom dom', dom);

  updateDom(dom, {}, fiber.props);

  return dom;
};

// 特殊的属性： 事件监听（属性名以 ‘on’开头）
const isEvent = key => key.startsWith('on');
const isProperty = key =>
  key !== 'children' && !isEvent(key);
const isNew = (prev, next) => key =>
  prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

// 将节点属性添加到 dom 上，例如事件、props等
function updateDom(dom, prevProps, nextProps) {
  // console.log('updateDom');
  // TODO: We compare the props from the old fiber to the props of the new fiber, remove the props that are gone, and set the props that are new or changed.

  // remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key => 
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2);
      dom.removeEventListener(
        eventType,
        prevProps[name]
      );
    });

  // remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = '';
    });

  // set new or changed properties
  // console.log('nextProps', nextProps);
  // console.log('dom', dom);
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      // console.log('name', name);
      // if (name === 'nodeValue') {
      //   console.log('nextProps[name]', nextProps[name]);
      // }
      dom[name] = nextProps[name];
    });

  // add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2);
      dom.addEventListener(
        eventType,
        nextProps[name]
      );
    });


};

function commitRoot() {
  // console.log('commitRoot');
  // TODO add nodes to dom
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  // 将 node 放在 DOM 中之后，更新当前 root， 将 work in progress root 置空。
  currentRoot = wipRoot;
  wipRoot = null;
};

// div -> root(1)、input -> div(2)、h2 -> div(3)、第一个text -> h2(4)、第二个text -> h2(5)
// 总共11次：1 + 2 + 2 + 2 + 2 + 2 = 11次
// 考虑，不是可以先判断 child 和 sibling 是否存在再进行 commitWork，这样可以减少 commitWork 次数
function commitWork(fiber) {
  // console.log('commitWork fiber', fiber);
  if (!fiber) {
    return;
  }

  // const domParent = fiber.parent.dom;
  // domParent.appendChild(fiber.dom);

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    // 沿着 fiber tree 直到 找到一个 fiber 存在 dom node。
    // 此例子是找到了 root 节点，将 h1 插入 root 中。
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  // console.log('fiber', fiber);
  if (
    fiber.effectTag === 'PLACEMENT' &&
    fiber.dom != null
    // fiber.dom !== null
  ) {
    domParent.appendChild(fiber.dom);
  } else if (
    fiber.effectTag === 'UPDATE' &&
    fiber.dom != null
    // fiber.dom !== null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    );
  } else if (fiber.effectTag === 'DELETION') {
    // domParent.removeChild(fiber.dom);
    commitDeletion(fiber, domParent);
  }

  // 将 node 提交到 dom
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
};

function render(element, container) {
  // console.log('render element', element);
  // TODO set next unit of work

  // a DOM node
  // nextUnitOfWork = {

  // the work in progress root or wipRoot 就是一个 根fiber，也就是最外层的 fiber
  // wipRoot 是个什么？
  wipRoot = {
    dom: container,//node
    props: {
      children: [element]
    },
    alternate: currentRoot // 新根节点的 alternate 是上一次的根节点
  }

  deletions = [];
  nextUnitOfWork = wipRoot;
};

// 问题：这个函数的输出思路没有讲明，为何如此设计？
// loop 循环
// 浏览器一直在做 workLoop，原因是调用了 windows.requestIdleCallback 方法，将循环函数传了进去
function workLoop(deadline) {
  // console.log('workLoop nextUnitOfWork', nextUnitOfWork); // 更新时是 root
  // deadline ：check how much time we have until the browser needs to take control again.

  // yield 给让路
  let shouldYield = false;

  // console.log('nextUnitOfWork', nextUnitOfWork);

  // 注意此处是 while
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    );// div(root) -> div -> input -> h2 -> 第一个 textElement（Hello）-> 第二个 textElement（World）
    shouldYield = deadline.timeRemaining() < 1;
    // console.log('shouldYield', shouldYield);
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
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
  // console.log('performUnitOfWork fiber', fiber);
  // 1、add the element to the DOM;
  // 2、create the fibers for the element's children;
  // 3、select the next unit of work.

  // TODO add dom node: create a new node and append it to the DOM.
  // keep track of the DOM node in the fiber.dom property?
  // console.log('performUnitOfWork fiber', fiber);
  // if (!fiber.dom) {
  //   fiber.dom = createDom(fiber);
  // }

  // 此处将一个node 加到 DOM中，但是渲染会被打断，所以会导致用户看到不完整的UI。
  // 取而代之 我们追踪 fiber tree 的 root
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  // // TODO create new fibers: for each child we create a new fiber.
  // // just like render 中的 nextUnitOfWork

  // const elements = fiber.props.children;
  // reconcileChildren(fiber, elements);

  // let index = 0;
  // // prevSibling object 代表的是？父母的兄弟姐妹？
  // let prevSibling = null;

  // while (index < elements.length) {
  //   // 当存在 child
  //   const element = elements[index];

  //   const newFiber = {
  //     type: element.type,
  //     props: element.props,
  //     parent: fiber,
  //     dom: null
  //   };

  //   // And we add it to the fiber tree setting it either as a child or as a sibling, depending on whether it’s the first child or not.

  //   if (index === 0) {
  //     // first child
  //     fiber.child = newFiber;
  //   } else {
  //     // prevSibling.sibling 指代什么？
  //     prevSibling.sibling = newFiber;
  //   }

  //   // ?
  //   prevSibling = newFiber;
  //   index++;
  // }
  // while 结束，一个完整的 fiber tree 也创建完成，之后只需要沿着树做渲染。

  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  

  // TODO return next unit of work
  // 此处是同步的，并不能取到 child 吧？
  // 😯 居然是可以取到 child 的！
  // console.log('fiber.child', fiber.child);
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  // console.log('nextFiber', nextFiber);
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
    // 指向 parent 的话岂不是又会找到 child？找到parent的sibling，而不是找到parent然后继续找child的循环。。
  }

  // 最后没有返回根节点（root）的场景？
};

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  // TODO run the function to get the children
  const children = [fiber.type(fiber.props)];
  // 注意 children 是数组，但是执行了函数之后得到的是什么呢，是一个fiber tree吧？
  // 此时的 fiber 是没有 dom 的，因为是 Function Component
  reconcileChildren(fiber, children);
};

const useState = (initial) => {
  // TODO
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  console.log('useState oldHook', oldHook);

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };
  console.log('useState hook', hook);

  const actions = oldHook ? oldHook.queue : [];

  console.log('setState actions', actions);
  actions.forEach(action => {
    // 故此处的 action 可以省略参数，直接写结果，例如 setState(c => c + 1) 简写成 setState(c + 1)
    hook.state = action(hook.state);
  });

  const setState = action => {
    hook.queue.push(action);
    // set a new work in progress root as the next unit of work so the work loop can start a new render phase.?
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
};

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
};


function reconcileChildren(wipFiber, elements) {
  // console.log('reconcileChildren');
  // iterate 迭代；重复；
  // boilerplate 样板文件；引用；

  // If we ignore all the boilerplate needed to iterate over an array and a linked list at the same time, 
  // we are left with what matters most inside this while: oldFiber and element. 
  // The element is the thing we want to render to the DOM and the oldFiber is what we rendered the last time.
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 对根fiber来说，第一次alternate 为 null
  let prevSibling = null;

  // console.log('reconcileChildren elements', elements);
  // 注意此处是 while 和 || 
  while (
    index < elements.length ||
    oldFiber != null
    // oldFiber !== null 此处不可使用 !==
  ) {
    // console.log('reconcileChildren oldFiber', oldFiber);
    // console.log('reconcileChildren index', index);
    const element = elements[index];
    let newFiber = null;

    // compare:
    const sameType =
      oldFiber &&
      element &&
      element.type === oldFiber.type;

    // 1、same type：keep the DOM node, update props;
    if (sameType) {
      // console.log('对textElement来说，应该是sameType吧');
      // TODO updte the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE' // the commit phase need to use
      }
      // console.log('newFiber', newFiber);
    }

    // 2、different type && new element: create a new DOM node;
    if (element && !sameType) {
      // TODO add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null, // 首次创建时的 dom 为 null，需要后面调用 createDom 来创建 dom
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      }

      // reconcile 之后 增加了：dom、parent、effectTag、alternate
    }

    // 3、defferent type && old fiber: remove the old node.
    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
      oldFiber.effectTag = 'DELETION';
      // deletions 从何而来？
      // But when we commit the fiber tree to the DOM we do it from the work in progress root, which doesn’t have the old fibers. ？
      // So we need an array to keep track of the nodes we want to remove.
      deletions.push(oldFiber);
    }

    // const newFiber = {
    //   type: element.type,
    //   props: element.props,
    //   parent: fiber,
    //   dom: null
    // };

    if (oldFiber) {
      // console.log('oldFiber', oldFiber);
      oldFiber = oldFiber.sibling;
    }

    // 以下代码的作用是：将 first child 置为 child，将第一个 child 的 sibling 指向 第二个，将第二个 child 的 sibling 指向 第三个，以此类推。
    // console.log('index', index);
    if (index === 0) {
      // console.log('wipFiber', wipFiber);
      wipFiber.child = newFiber; // 给parent fiber 加上 first child
    } else {
      // console.log('prevSibling', prevSibling);
      prevSibling.sibling = newFiber;// input 的 sibling 指向 h2
    }

    // 上一层的 兄弟姐妹节点？
    prevSibling = newFiber;// 浅拷贝？ 会改变 原fiber？
    index++;
  }
};

export { render, useState };


import beginWork from './beginWork'
import completeWork from './completeWork'
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber'
import { HostRoot } from './workTag'

let workInProgress: FiberNode | null = null

function prepareFreshStack(root: FiberRootNode) {
  // fiberRootNode 不能直接等于workInProgress
  workInProgress = createWorkInProgress(root.current, {})
}

// 归的阶段 completeWork
function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber

  do {
    completeWork(node)
    const sibling = node.sibling
    if (sibling !== null) {
      workInProgress = sibling
      return
    }
    node = node.return
    workInProgress = node
  } while (node !== null)
}

function performUnitOfWork(fiber: FiberNode) {
  // 递的阶段 beginWork
  const next = beginWork(fiber)
  fiber.memoizeProps = fiber.pendingProps
  if (next === null) {
    completeUnitOfWork(fiber)
  } else {
    workInProgress = next
  }
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

/**
 *
 * @param fiber  当前触发更新的fiber
 * @returns
 */
// 寻找fiberRootNode 通过遍历 一直向上找
function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber
  let parent = node.return // HostRootFiber 没有return指针
  while (parent !== null) {
    node = parent
    parent = node.return
  }
  if (node.tag === HostRoot) {
    return node.stateNode
  }
  return null
}

// 连接container 以及 renderRoot
export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // TODO 调度功能
  const root = markUpdateFromFiberToRoot(fiber) // 拿到的是fiberRootNode
  renderRoot(root)
}

// renderRoot是执行更新的过程
// 调用renderRoot的就是触发更新的api
/**
 * 常见的触发更新的方式
 * 1 ReactDom.createRoot().render() 或者老版的 ReactDom.render()
 * 2 this.setState
 * 3 useState的dispatch方法
 * @param root  FiberRootNode,它包含了整个应用程序的顶级组件，用于管理组件树的更新和协调。在 React 内部，FiberRootNode 包含了 current 属性，指向当前渲染的 FiberNode。  并不是div#root 对应的fiberNode 也就是HostFiberNode 也就是FiberRootNode.current
 */
function renderRoot(root: FiberRootNode) {
  // 初始化 将wip指向需要遍历的第一个fiberNode
  prepareFreshStack(root) // 创建wip

  // 递归
  do {
    try {
      workLoop()
      break
    } catch (e) {
      if (__DEV__) {
        console.warn('发生错误')
      }
      workInProgress = null
    }
  } while (true)

  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork
  // commit 流程的入口
  // 根据 生成的 wip fiberNode tree 和 tree 中的 flags 执行具体的dom 操作
  commitRoot(root)
}

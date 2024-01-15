import { appendInitialChild, createInstance, createTextInstance } from 'hostConfig'
import { FiberNode } from './fiber'
import { HostComponent, HostRoot, HostText } from './workTag'
import { NoFlags } from './fiberFlags'

export default function completeWork(wip: FiberNode) {
  // 递归中的归
  const newProps = wip.pendingProps
  const current = wip.alternate
  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // 构建离屏的dom树
        // 1 构建dom
        const instance = createInstance(wip.type, newProps) // 创建一个宿主环境的实例,对于浏览器环境来说就是一个dom节点
        //  2 将dom 插入到dom树中
        appendAllChildren(instance, wip)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // 构建离屏的dom树
        // 1 构建dom
        const instance = createTextInstance(newProps.content) // 创建一个宿主环境的实例,对于浏览器环境来说就是一个dom节点
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostRoot:
      bubbleProperties(wip)
      return null
    default:
      if (__DEV__) {
        console.warn('未处理的completeWork情况', wip)
      }
      break
  }
}

function appendAllChildren(parent: FiberNode, wip: FiberNode) {
  let node = wip.child
  while (node !== null) {
    if (node?.tag === HostComponent || node?.tag === HostText) {
      appendInitialChild(parent, node.stateNode)
    } else if (node.child !== null) {
      node.child.return = node
      node = node.child
      continue
    }

    if (node === wip) {
      return
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return
      }
      node = node?.return
    }
    node.sibling.return === node.return
    node = node.sibling
  }
}

// flags 冒泡
function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags
  let child = wip.child
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags

    child.return = wip
    child = child.sibling
  }
  wip.subtreeFlags |= subtreeFlags
}

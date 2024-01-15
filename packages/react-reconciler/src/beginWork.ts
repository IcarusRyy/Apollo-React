import { ReactElementType } from 'shared/ReactTypes'
import { FiberNode } from './fiber'
import { UpdateQueue, processUpdateQueue } from './updateQueue'
import { HostComponent, HostRoot, HostText } from './workTag'
import { mountChildFibers, reconcileChildFibers } from './childFibers'

function updateHostRoot(wip: FiberNode) {
  // 计算状态的最新值
  const baseState = wip.memoizedState
  const updateQueue = wip.UpdateQueue as UpdateQueue<Element>
  const pending = updateQueue.shared.pending
  updateQueue.shared.pending = null
  const { memoizedState } = processUpdateQueue(baseState, pending)
  wip.memoizedState = memoizedState

  const nextChildren = wip.memoizedState
  reconcileChildren(wip, nextChildren)
  return wip.child
}

// HostComponent类型的  updateHostComponent是没有办法触发更新的
// 所以流程只有一个 创建子fiberNode
function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps
  const nextChildren = nextProps.children
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
  const current = wip.alternate
  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current?.child, children)
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children)
  }
}
export default function beginWork(wip: FiberNode) {
  // 通过wip fiberNode 与 reactElement比较 返回子fiberNode
  switch (wip.tag) {
    case HostRoot:
      // 对于HostRoot这个类型的fiberNode来说
      // beginWork需要做两件事
      // 1 计算状态的最新值
      // 2 创建子fiberNode  通过对比子 current fiberNode和 子 reactElement, 来生成子fiberNode
      return updateHostRoot(wip)
    case HostComponent: // 代表原生的element类型, 比如div span
      return updateHostComponent(wip)
    case HostText: // 文本类型节点对应的fiberNode就是HostText类型的fiberNode,这种是没有子节点的fiberNode 是一个叶子节点
      return null
    default:
      if (__DEV__) {
        console.warn('beginWork未实现的类型')
      }
      break
  }
  return null
}

import { UpdateQueue, createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue'
import { Container } from 'hostConfig'
import { FiberNode, FiberRootNode } from './fiber'
import { HostRoot } from './workTag'
import { ReactElementType } from 'shared/ReactTypes'
import { scheduleUpdateOnFiber } from './wookLoop'

// 当执行ReactDom.createRoot()方法以后,ReactDom.createRoot方法内部就会执行createContainer这个方法 创建FiberRootNode
export function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null) // 创建hostRootFiber
  const root = new FiberRootNode(container, hostRootFiber) // 创建FiberRootNode
  hostRootFiber.UpdateQueue = createUpdateQueue() // 创建更新队列
  return root
}

// 当执行render方法以后,在render方法内部会执行updateContainer
export function updateContainer(element: ReactElementType | null, root: FiberRootNode) {
  const hostRootFiber = root.current
  // 首屏渲染触发更新 所以要首先创建一个update
  const update = createUpdate<ReactElementType | null>(element)
  enqueueUpdate(hostRootFiber.UpdateQueue as UpdateQueue<ReactElementType | null>, update)
  scheduleUpdateOnFiber(hostRootFiber)
  return element
}

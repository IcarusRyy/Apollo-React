import { ReactElementType } from 'shared/ReactTypes'
import { FiberNode, createFiberFromElement } from './fiber'
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { HostText } from './workTag'
import { PlaceMent } from './fiberFlags'

function ChildReconciler(shouldTrackEffects: boolean) {
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElementType,
  ) {
    // 根据ReactElement创建一个fiber 然后返回
    const fiber = createFiberFromElement(element)
    fiber.return = returnFiber
    return fiber
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number,
  ) {
    const fiber = new FiberNode(HostText, { content }, null)
    fiber.return = returnFiber
    return fiber
  }

  function placeSingleChild(fiber: FiberNode) {
    // fiber.alternate === null 代表首屏渲染的情况
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= PlaceMent
    }
    return fiber
  }

  return function reconcileChildFibers(
    returFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ReactElementType,
  ) {
    // 判断当前fiber的类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild?.$$typeof) {
        case REACT_ELEMENT_TYPE: // 如果是REACT_ELEMENT_TYPE,代表当前的这个newChild是一个ReactElement
          return placeSingleChild(reconcileSingleElement(returFiber, currentFiber, newChild))
        default:
          if (__DEV__) {
            console.warn('为实现的reconcile类型', newChild)
          }
          break
      }
    }
    // TODO 多节点的情况 比如 ul下的3个li

    // HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returFiber, currentFiber, newChild))
    }
    return null
  }
}

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)

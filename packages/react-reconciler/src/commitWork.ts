import { Container, appendChildToContainer } from 'react-dom/src/hostConfig'
import { FiberNode, FiberRootNode } from './fiber'
import { MutationMask, NoFlags, PlaceMent } from './fiberFlags'
import { HostComponent, HostRoot, HostText } from './workTag'

let nextEffect: FiberNode | null = null

// DFS深度优先遍历  寻找不存在MutationMask的节点 不一定非得是叶子节点
export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffect = finishedWork
  while (nextEffect !== null) {
    // 向下遍历
    const child: FiberNode | null = nextEffect.child
    if ((nextEffect.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
      nextEffect = child
    } else {
      // 向上遍历
      up: while (nextEffect !== null) {
        commitMutationEffectOnFiber(nextEffect)

        const sibling: FiberNode | null = nextEffect.sibling
        if (sibling !== null) {
          nextEffect = sibling
          break up
        }
        nextEffect = nextEffect.return
      }
    }
  }
}

const commitMutationEffectOnFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags
  if ((flags & PlaceMent) !== NoFlags) {
    commitPlaceMent(finishedWork)
    finishedWork.flags &= ~PlaceMent // 将PlaceMent从finishedWork中移除
  }

  // flags 是否有Update
  // flags 是否有ChildDeletion
}

// 插入操作
const commitPlaceMent = (finishedWork: FiberNode) => {
  // 1、parent Dom 代表我需要将当前的fiberNode对应的真实Dom插入到谁下面
  // 2、finishedWork  要找到这个对应的Dom节点 也就是要插入的节点
  if (__DEV__) {
    console.warn('执行Placement操作：', finishedWork)
  }
  // 获取parent Dom
  const hostParent = getHostParent(finishedWork)
  // 找到finishedWork对应的dom 并且将这个dom  append到这个parentDom中
  appendPlacementNodeIntoContainer(finishedWork, hostParent)
}

// 获取父级的宿主环境的节点
function getHostParent(fiber: FiberNode): Container {
  let parent = fiber.return
  while (parent) {
    const parentTag = parent.tag
    // 只有两种情况，parentTag才对应宿主环境的节点  hostComponent 和 HostRoot
    // hostComponent 也就是div span
    // HostRoot 也就是div#root
    if (parentTag === HostComponent) {
      return parent.stateNode as Container // stateNode用于存储宿主环境对应的节点  也就是stateNode用于保存fiber对应的dom节点
    }
    if (parentTag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container
    }

    parent = parent.return
  }
  if (__DEV__) {
    console.warn('未找到host parent')
  }
}

// 将finishedWork对应的dom append到container中， 这里的finishedWork代表要插入的节点
function appendPlacementNodeIntoContainer(finishedWork: FiberNode, hostParent: Container) {
  // 由于传递进来的finishedWork不一定是一个host类型的fiber，所以需要 通过传递进来的fiber 向下遍历 找到host类型的fiber
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    // 对于插入的节点 不可能是的hostRoot
    appendChildToContainer(finishedWork.stateNode, hostParent)
    return
  }
  const child = finishedWork.child
  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent)
    let sibling = child.sibling
    while (sibling !== null) {
      appendPlacementNodeIntoContainer(sibling, hostParent)
      sibling = sibling.sibling
    }
  }
}

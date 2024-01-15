import { ElementType, Key, Props, Ref } from 'shared/ReactTypes'
import { FunctionComponent, HostComponent, WorkType } from './workTag'
import { Flags, NoFlags } from './fiberFlags'
import { Container } from 'hostConfig'

// 创建FiberNode
export class FiberNode {
  tag: WorkType // tag 就是指什么类型的fiberNode
  key: Key
  ref: Ref

  stateNode: any
  type: any

  return: FiberNode | null
  child: FiberNode | null
  sibling: FiberNode | null

  index: number

  pendingProps: Props
  memoizeProps: Props | null
  memoizedState: any
  UpdateQueue: unknown

  alternate: FiberNode | null // 用于fiberNode之间的切换

  flags: Flags
  subtreeFlags: Flags
  constructor(tag: WorkType, pendingProps: Props, key: Key) {
    // 对于fiberNode来说 是实例的属性
    this.tag = tag
    this.key = key

    // 对于HostComponent来说  如果是一个div的话 stateNode保存的就是div这个Dom
    this.stateNode = null
    // 对于一个FunctionComponent来说  type就是这个函数组件本身 () => {}
    this.type = null // fiberNode的类型

    // 表示节点之间的关系 构成树状结构
    /**
     * 为什么使用return表示父子关系 而不是用parent等其他字段?
     * 因为fiberNode作为一个工作单元,return指"FiberNode执行完了complete Work后返回的下一个父FiberNode"
     */
    this.return = null // 指向父FiberNode
    this.child = null
    this.sibling = null // 指向右边的兄弟fiberNode
    this.index = 0 // index是指如果同级的fiberNode有好几个, 比如<ul> <li> * 3 </ul>, 则第一个li的index是0 第二个li的index是1 第三个li的index是2

    this.ref = null

    // 作为工作单元
    this.pendingProps = pendingProps // pendingProps是指这个工作单元刚开始工作的时候,这个props是什么
    this.memoizeProps = null // memoizeProps 是指工作完了之后,这个工作单元fiberNode的props是什么
    this.memoizedState = null // memoizedState是指更新完成后的state baseState 1 update 2 -> memoizedState 2
    this.UpdateQueue = null

    this.alternate = null
    // 副作用
    this.flags = NoFlags
    this.subtreeFlags = NoFlags
  }
}

// 创建FiberRootNode
// container 表示根节点, 是页面的真实dom节点,document.getElementByIf("root")获取
// fiberRootNode 根节点 对应的fiber节点
export class FiberRootNode {
  container: Container // 表示挂载的那个fiber节点
  current: FiberNode
  finishedWork: FiberNode | null // 这个字段指向整个更新完成之后的 hostRootFiber
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container
    this.current = hostRootFiber //  将hostRootFiber 与 FiberRootNode 关联
    hostRootFiber.stateNode = this //  将hostRootFiber 与 FiberRootNode 关联
    this.finishedWork = null
  }
}

// fiberNode工作原理是双缓存机制 来回切换
export const createWorkInProgress = (current: FiberNode, pendingProps: Props): FiberNode => {
  let wip = current.alternate
  // 当首屏渲染的时候 wip就是null
  if (wip === null) {
    // 对应的mount
    wip = new FiberNode(current.tag, pendingProps, current.key)
    wip.stateNode = current.stateNode
    current.alternate = wip
  } else {
    // 应该返回与传进来的fiberNode在另外一个fiberTree上所对应的fiberNode
    // 对应update
    // 更新的时候 需要更新 pendingProps
    wip.pendingProps = pendingProps
    // 需要把副作用相关的东西清除掉,因为这些东西可能是上一次update遗留下来的
    wip.flags = NoFlags
    wip.subtreeFlags = NoFlags
  }
  wip.type = current.type
  wip.UpdateQueue = current.UpdateQueue
  wip.child = current.child
  wip.memoizeProps = current.memoizeProps
  wip.memoizedState = current.memoizedState
  return wip
}

export function createFiberFromElement(element: ElementType) {
  const { type, key, props } = element
  let fiberTag: WorkType = FunctionComponent
  if (typeof type === 'string') {
    // <div></div>  -> type :'div'
    fiberTag = HostComponent
  } else if (typeof type !== 'function' && __DEV__) {
    console.warn('未定义的类型', element)
  }
  const fiber = new FiberNode(fiberTag, props, key)
  fiber.type = type
  return fiber
}

export type WorkType =
  | typeof FunctionComponent
  | typeof HostRoot
  | typeof HostComponent
  | typeof HostText

export const FunctionComponent = 0
export const HostRoot = 3 // 项目挂载的根节点 ReactDom.render(Dom) 这个Dom对应的节点 就是HostRootFiber 类型就是 HostRoot
export const HostComponent = 5 // <div></div> 指原生类型的节点
export const HostText = 6 // 纯文本节点

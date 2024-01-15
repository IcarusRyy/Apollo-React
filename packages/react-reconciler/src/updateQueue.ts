import { Action } from 'shared/ReactTypes'

export interface Update<State> {
  action: Action<State>
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null
  }
}

// 代表数据更新的数据结构 update 实例化的方法
export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  }
}

// 代表updateQueue 实例化的方法  采用shared.pending这种数据结构,主要是为了在wip fiber和current fiber之间共用同一个updateQueue
export const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null,
    },
  } as UpdateQueue<State>
}
// 将update插入到updateQueue的方法
export const enqueueUpdate = <State>(UpdateQueue: UpdateQueue<State>, update: Update<State>) => {
  UpdateQueue.shared.pending = update
}
// 消费update的方法 计算状态的最新值
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null,
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  }
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action
    // baseState 1 update (x) => 4x -> memoizedState 4
    if (action instanceof Function) {
      result.memoizedState = action(baseState)
    } else {
      // baseState 1 update 2 -> memoizedState 2
      result.memoizedState = action
    }
  }
  return result
}

// JSX或者React.createElement方法执行的返回结果是 ReactElement结构的对象

import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { Key, Props, ReactElementType, Ref, Type, ElementType } from 'shared/ReactTypes'

/**
 * ReactElement构造函数
 * @param type
 * @param key 组件的key
 * @param ref 组件的ref
 * @param props 组件的props
 */
const ReactElement = function (type: Type, key: Key, ref: Ref, props: Props): ReactElementType {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE, // 通过这个属性来指明当前对象是ReactElement结构对象
    type,
    key,
    ref,
    props,

    __mark: 'Apollo', // 用于区分真实React中的ReactElement对象
  }
  return element
}

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null
  let ref: Ref = null
  const props: Props = {}

  for (const prop in props) {
    const val = config[prop]
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val
      }
      continue
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val
      }
      continue
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }
  }
  const maybeChildrenLength = maybeChildren.length
  if (maybeChildrenLength) {
    // [child] [child1, child2, child3]
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0]
    } else {
      props.children = maybeChildren
    }
  }
  return ReactElement(type, key, ref, props)
}

export const jsxDEV = (type: ElementType, config: any) => {
  let key: Key = null
  let ref: Ref = null
  const props: Props = {}

  for (const prop in props) {
    const val = config[prop]
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val
      }
      continue
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val
      }
      continue
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }
  }
  return ReactElement(type, key, ref, props)
}

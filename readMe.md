# conventional 规范集意义：

```
// 提交的类型：摘要信息
<type>: <subject>
```

## 常用的 type 值

- feat: 添加新功能
- fix: 修复 bug
- chore: 一些不影响功能的更改
- docs: 专指文档的修改
- perf: 性能方面的优化
- refactor: 代码重构
- test: 添加一些测试代码等等

# React 项目结构

- react (与宿主环境无关的公用方法，比如 React.createElement())
- react-reconciler (协调器的实现，与宿主环境无关)
- 各种宿主环境的包
- shared (公用辅助方法，与宿主环境无关)

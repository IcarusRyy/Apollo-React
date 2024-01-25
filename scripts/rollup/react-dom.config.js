import { getBaseRollupPlugins, getPackagesJSON, resolvePkgPath } from './utils'
import generatePackageJSON from 'rollup-plugin-generate-package-json'
const { name, module } = getPackagesJSON('react-dom')
// react-dom包的路径
const pkgPath = resolvePkgPath(name)
// react-dom产物路径
const pkgDistPath = resolvePkgPath(name, true)

export default [
  // react-dom
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${pkgDistPath}/index.js`,
        name: 'index.js',
        format: 'umd',
      },
      {
        file: `${pkgDistPath}/client.js`,
        name: 'client.js',
        format: 'umd',
      },
    ],
    plugins: [
      ...getBaseRollupPlugins(),
      // webpack resolve alias
      generatePackageJSON({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
        }),
      }),
    ],
  },
  // jsx-runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      // jsx-runtime
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        formate: 'umd',
      },
      // jsx-dev-runtime
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        formate: 'umd',
      },
    ],
    plugins: getBaseRollupPlugins(),
  },
]

# Sandpack + eslint

https://sandpack-lint.vercel.app/

#### 1. Setup eslint

All the setup is done in the `lint.ts` file, where we install the `eslint` and its rules. Also, you can find there the function `lintDiagnos`, which is used to check the code with eslint and generate the proper diagnostics array to the CodeMirrir.

#### 2. Setup webpack

As the `eslint` uses internally a require with an expression, we need to set up the webpack to resolve it using a specific plugin, so check the `next.config.js`.

#### 3. Setup Sandpack

Now Sandpack supports the `onLint` prop, which will be called when the Codemirror loads and in every code changes. This prop is a function that receives the Codemirror instance and expects a diagnostics array as a return.

#### 4. Lazy load the lint module

Once the component is rendered, and the CodeMirror is loaded, we need to lazy load the `lint.ts` module. This is done in a `useEffect` with a regular async import, and once the module is loaded, we replace the ref with the new instance.

```js
const lintDiagnostic = useRef < any > (() => []);

useEffect(function lazyLintModule() {
  import("../lint").then((module) => {
    lintDiagnostic.current = module.lintDiagnostic;
  });
}, []);

const onLintLazyLoad = useCallback(
  (code) => lintDiagnostic.current(code),
  [lintDiagnostic.current]
);
```
# Sandpack + eslint

https://sandpack-lint.vercel.app/

#### 1. Setup eslint

All the setup is done in the `lint.ts` file, where we install the `eslint` and its rules. Also, you can find there the function `lintDiagnostic`, which is used to check the code with eslint and generate the proper diagnostics array to the CodeMirror.

https://github.com/danilowoz/sandpack-lint/blob/master/lint.ts

#### 2. Setup webpack

As the `eslint` uses internally a require with an expression, we need to custom the webpack configuration to resolve it using a specific plugin, so check the `next.config.js`.

https://github.com/danilowoz/sandpack-lint/blob/master/next.config.js

#### 3. Setup Sandpack

Sandpack introduces the `onLint` prop, which will be called when the **Codemirror loads** and in **every code changes**. This prop is a function that receives the Codemirror instance and expects a diagnostics array as return.

https://github.com/danilowoz/sandpack-lint/blob/master/pages/index.tsx#L56-L62

#### 4. Lazy load the lint module

Once the component is rendered, and the CodeMirror is loaded, we need to lazy load the `lint.ts` module. This is done in a `useEffect` with a regular async import, and once the module is loaded, we replace a ref with the new function instance just loaded.

https://github.com/danilowoz/sandpack-lint/blob/master/pages/index.tsx#L41-L50

#### 5. Print the errors in the bundler

Sandpack has a custom component to print the error on top of the bundle preview, so as we already have the error messages from lint we just need to print them in this custom component.

https://github.com/danilowoz/sandpack-lint/blob/master/pages/index.tsx#L83-L95

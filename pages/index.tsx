import {
  SandpackCodeEditor,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import React, { useCallback, useEffect, useRef } from "react";

const reactCode = `function App() {
  const [a, setA] = React.useState("");
  // This should give a warning
  useEffect(() => {
    console.log(a);
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`;

const Editor = () => {
  const lintDiagnostic = useRef<any>(() => []);

  useEffect(function lazyLintModule() {
    import("../lint").then((module) => {
      lintDiagnostic.current = module.lintDiagnostic;
    });
  }, []);

  const onLintLazyLoad = useCallback(
    (code) => lintDiagnostic.current(code),
    [lintDiagnostic.current]
  );

  return <SandpackCodeEditor onLint={onLintLazyLoad} />;
};

const App: React.FC = () => {
  return (
    <>
      Hello Sandpack
      <SandpackProvider
        template="react"
        customSetup={{ files: { "/App.js": reactCode } }}
      >
        <Editor />
      </SandpackProvider>
    </>
  );
};

export default App;

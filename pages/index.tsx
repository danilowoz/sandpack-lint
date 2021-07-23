import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "@codesandbox/sandpack-react/dist/index.css";

const reactCode = `import { useState, useEffect } from "react"

export default function App() {
  const [a, setA] = useState("");

  useEffect(() => {
    console.log(a);
    // This should give a warning
  }, []);
  
  if(a) {
    // This should give an error
    const foo = useState()
  }

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
  const [diagnostic, setDiagnostic] = useState([]);

  useEffect(function lazyLintModule() {
    import("../lint").then((module) => {
      lintDiagnostic.current = module.lintDiagnostic;
    });
  }, []);

  const onLintLazyLoad = useCallback(
    (code) => lintDiagnostic.current(code),
    [lintDiagnostic.current]
  );

  return (
    <div>
      <SandpackCodeEditor
        showLineNumbers
        onLint={(doc) => {
          const { codeMirrorPayload, errors } = onLintLazyLoad(doc);

          setDiagnostic(errors);

          return codeMirrorPayload;
        }}
      />

      <div>
        {diagnostic.map((e) => {
          return (
            <p style={{ color: e.severity === 1 ? "orange" : "red" }}>
              [{e.line}:{e.column}] - {e.message}
            </p>
          );
        })}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <h1>Hello Sandpack</h1>
      <SandpackProvider
        template="react"
        customSetup={{ files: { "/App.js": reactCode } }}
      >
        <SandpackLayout>
          <Editor />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};

export default App;

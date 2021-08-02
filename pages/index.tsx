import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useClasser,
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

const Editor = ({ setDiagnostic }) => {
  const lintDiagnostic = useRef<any>(() => []);

  // This might be loaded once in the page
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
    </div>
  );
};

const App: React.FC = () => {
  const c = useClasser("sp");
  const [diagnostic, setDiagnostic] = useState([]);

  return (
    <>
      <h1>Hello Sandpack</h1>
      <SandpackProvider
        template="react"
        customSetup={{ files: { "/App.js": reactCode } }}
      >
        <SandpackLayout>
          <Editor setDiagnostic={setDiagnostic} />

          <div className={c("preview-container")}>
            {diagnostic.length > 0 && (
              <div className={c("overlay", "error")} style={{ zIndex: 99 }}>
                <div className={c("error-message")}>
                  {diagnostic.map((e) => {
                    return (
                      <p style={{ color: e.severity === 1 ? "orange" : "red" }}>
                        [{e.line}:{e.column}] - {e.message}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {diagnostic.length === 0 && <SandpackPreview />}
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};

export default App;

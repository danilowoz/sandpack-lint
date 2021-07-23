import { Linter } from "./node_modules/eslint/lib/linter/linter";
import { LintDiagnostic } from "@codesandbox/sandpack-react";
import { getCodeMirrorPosition } from "@codesandbox/sandpack-react/dist/cjs/components/CodeViewer/utils";
import type { Text } from "@codemirror/text";

const linter = new Linter();

// HACK! Eslint requires 'esquery' using `require`, but there's no commonjs interop.
// because of this it tries to run `esquery.parse()`, while there's only `esquery.default.parse()`.
// This hack places the functions in the right place.
const esquery = require("esquery");
esquery.parse = esquery.default?.parse;
esquery.matches = esquery.default?.matches;

const reactRules = require("eslint-plugin-react-hooks").rules;
linter.defineRules({
  "react-hooks/rules-of-hooks": reactRules["rules-of-hooks"],
  "react-hooks/exhaustive-deps": reactRules["exhaustive-deps"],
});

const options = {
  // TODO: Ives, do you really need this?
  // parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};

export const lintDiagnostic = (doc: Text): LintDiagnostic[] => {
  const codeString = doc.toString();
  const messages = linter.verify(codeString, options);

  return messages.map((error) => {
    if (!error) return;

    const from = getCodeMirrorPosition(doc, {
      line: error.line,
      column: error.column,
    });

    const to = getCodeMirrorPosition(doc, {
      line: error.endLine,
      column: error.endColumn,
    });

    const severity = {
      1: "warning",
      2: "error",
    };

    return {
      from,
      to,
      severity: severity[error.severity],
      message: error.message,
    };
  });
};

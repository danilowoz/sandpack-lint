import { Linter } from "../node_modules/eslint/lib/linter/linter";

const linter = new Linter();

// HACK! Eslint requires 'esquery' using `require`, but there's no commonjs interop.
// because of this it tries to run `esquery.parse()`, while there's only `esquery.default.parse()`.
// This hack places the functions in the right place.
const esquery = require("esquery");
esquery.parse = esquery.default?.parse;
esquery.matches = esquery.default?.matches;

const reactRules = require("eslint-plugin-react-hooks").rules;

// TODO: any other rules?
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
    "react-hooks/exhaustive-deps": "error",
  },
};

export const lintDiagnostic = (code: string) => {
  const messages = linter.verify(code, options);

  // TODO: refactor
  return messages.map((error) => {
    if (!error) return;

    let from = code.split("\n").reduce((acc, curr, i) => {
      // -1 is to fix the array index
      if (i < error.line - 1) {
        return acc + curr.length + 1;
      }
      return acc;
    }, 0);

    let to = code.split("").reduce((acc, curr, i) => {
      // -1 is to fix the array index
      if (i < error.endLine - 1) {
        return acc + curr.length + 1;
      }
      return acc;
    }, 0);

    return {
      from: from + error.column,
      to: to + error.endColumn,
      severity: "error",
      message: error.message,
    };
  });
};

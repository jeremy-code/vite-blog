import { Fragment } from "react";

import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { jsx, jsxs } from "react/jsx-runtime";
import { parseMarkdown } from "../utils/parseMarkdown";

const Markdown = ({ markdown }: { markdown: string }) => {
  const hastTree = parseMarkdown(markdown);

  return toJsxRuntime(hastTree, {
    Fragment,
    jsx,
    jsxs,
    passNode: true,
  });
};

export { Markdown };

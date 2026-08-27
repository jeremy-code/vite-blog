import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import { remarkAlert } from "remark-github-blockquote-alert";
import { defaultHandlers } from "mdast-util-to-hast";

import styles from "./styles.module.css";

import type { Element } from "hast";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkAlert)
  .use(remarkRehype, {
    handlers: {
      footnoteReference: (state, node) => {
        const output = defaultHandlers.footnoteReference(state, node);
        output.properties.className = [
          "before:content-['[']",
          "after:content-[']']",
        ];
        return output;
      },
      list: (state, node) => {
        const listElement = defaultHandlers.list(state, node);
        if (listElement.tagName === "ul") {
          listElement.properties.className = ["list-disc", "list-inside"];
        } else if (listElement.tagName === "ol") {
          listElement.properties.className = ["list-decimal", "list-inside"];
        }

        return listElement;
      },
      code: (state, node) => {
        const preElement = defaultHandlers.code(state, node);
        const codeElement = preElement.children.at(0);

        if (
          codeElement === undefined ||
          codeElement.type !== "element" ||
          codeElement.tagName !== "code"
        ) {
          return preElement;
        }

        const language = node.lang ? node.lang.split(/\s+/) : [];

        if (language.length > 0) {
          codeElement.properties["data-language"] = language[0];
        }

        return preElement;
      },
    },
  })
  .use(rehypeExternalLinks, { rel: ["nofollow"] })
  .use(rehypeSlug);

const parseMarkdown = (markdown: string) => {
  const hastTree = processor.runSync(processor.parse(markdown));

  const lastNode = hastTree.children.at(-1);

  if (lastNode?.type === "element" && lastNode.properties["dataFootnotes"]) {
    lastNode.properties.className = [
      ...(lastNode.properties.className ?? []),
      styles.footnotes,
    ];
  }
  return hastTree;
};

export { parseMarkdown };

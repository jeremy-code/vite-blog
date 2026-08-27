import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema, type Options } from "rehype-sanitize";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import { remarkAlert } from "remark-github-blockquote-alert";
import { defaultHandlers } from "mdast-util-to-hast";
import deepmerge from "deepmerge";

const sanitizeOptions: Options = deepmerge(defaultSchema, {
  attributes: {
    ul: ["className", "list-disc"],
    ol: ["className", "list-decimal"],
    code: ["data-language"],
    "*": ["className"],
  },
});

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
          listElement.properties["className"] = ["list-disc", "list-inside"];
        }
        if (listElement.tagName === "ol") {
          listElement.properties["className"] = ["list-decimal", "list-inside"];
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
  // .use(rehypeSanitize, sanitizeOptions)
  .use(rehypeExternalLinks, { rel: ["nofollow"] })
  .use(rehypeSlug);

const parseMarkdown = (markdown: string) => {
  return processor.runSync(processor.parse(markdown));
};

export { parseMarkdown };

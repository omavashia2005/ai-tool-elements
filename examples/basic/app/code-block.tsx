import type { JSX } from "react";
import { codeToHtml } from "shiki";

import { CopyButton } from "./copy-button";

export async function CodeBlock({
  code,
  filename,
  lang = "tsx",
}: {
  code: string;
  filename: string;
  lang?: string;
}): Promise<JSX.Element> {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark-default",
    colorReplacements: { "#0d1117": "transparent" },
  });

  return (
    <figure className="code-block">
      <figcaption>
        <span className="filename">{filename}</span>
        <span className="lang-badge">{lang}</span>
        <CopyButton text={code} />
      </figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}

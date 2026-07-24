# ai-tool-elements

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

为工具和连接器提供带类型、供应商中立的 React 卡片。

## 安装

```sh
npm install ai-tool-elements
```

```tsx
import {
  Exa,
  Gmail,
  Notion,
  Slack,
  ToolCard,
  toolCatalog,
} from "ai-tool-elements";
import "ai-tool-elements/styles.css";

export function Tools() {
  return toolCatalog.map((tool) => (
    <ToolCard key={tool.id} tool={tool} />
  ));
}
```

`ToolCard` 组合了 shadcn 的 `Card`、`CardHeader`、`CardTitle`、
`CardDescription`、`CardContent`、`CardAction` 和 `CardFooter`。自定义工具
只需提供 `id` 和 `name`；`description`、`image` 以及带类型的
必填/可选 `fields` 均为可选项。

目录中的每一项也都作为带类型的命名导出提供，因此可以直接导入单个工具
（`Slack`、`Gmail`、`Notion`、`Exa` 等）。

v0 目录包含 1000 多个工具，并在可用时匹配相应徽标。

可用徽标通过
[`@thesvg/icons`](https://www.npmjs.com/package/@thesvg/icons) 提供支持 tree shaking 的导入。导入某个
命名工具时会包含其匹配的图标；导入 `toolCatalog` 时会包含整个目录中
匹配的图标。没有合适
徽标时，工具可以省略 `image`。

卡片及其字段定义与后端无关，不需要连接器服务。产品名称和徽标是其
各自
所有者的商标。

## 自定义工具

项目专用工具可以使用相同的公共类型，无需更改软件包
目录：

```ts
import type { Tool } from "ai-tool-elements";

export const Example = {
  id: "example",
  name: "Example",
  image: { type: "url", src: "https://example.com/logo.svg" },
} as const satisfies Tool;
```

`image` 是可选项。

## 工具调用

当参数正在流式传输或执行仍处于等待状态时，原样传入 AI SDK 的状态和输入。
将成功的输出渲染为 React 内容：

```tsx
import { ToolCallCard } from "ai-tool-elements";

<ToolCallCard
  tool={Weather}
  state={part.state}
  input={part.input}
  output={
    part.state === "output-available"
      ? <WeatherResult result={part.output} />
      : undefined
  }
  errorText={
    part.state === "output-error" ? part.errorText : undefined
  }
  actions={approvalOrCancelButtons}
/>
```

支持的状态包括 `input-streaming`、`input-available`、
`approval-requested`、`approval-responded`、`output-available`、
`output-error`、`output-denied` 和 `output-cancelled`。最后一种状态是
该库针对完成前取消的调用所提供的扩展。使用 `actions` 提供批准或
取消控件。

## 可编辑示例

运行 Next.js 展示应用：

```sh
npm run example
```

然后编辑 `examples/basic/app/page.tsx`。使用 `npm run example:build`
创建静态生产构建。

## 路线图

- [ ] 添加更多 ShadCN 组件
- [ ] 为主要工具 API 提供商提供统一 UI。
- [ ] 智能体技能

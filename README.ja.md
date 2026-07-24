# ai-tool-elements

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

ツールとコネクター向けの、型付きでベンダー中立な React カードです。

## インストール

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

`ToolCard` は、shadcn の `Card`、`CardHeader`、`CardTitle`、
`CardDescription`、`CardContent`、`CardAction`、`CardFooter` を
組み合わせます。カスタムツールに必要なのは `id` と `name` だけです。
`description`、`image`、および型付きの必須/任意 `fields` は省略できます。

カタログの各項目は型付きの名前付きエクスポートとしても提供されるため、個々の
ツール（`Slack`、`Gmail`、`Notion`、`Exa` など）を直接インポートできます。

v0 カタログには 1000 を超えるツールが含まれ、利用可能な場合は対応するロゴが割り当てられています。

利用可能なロゴには、[`@thesvg/icons`](https://www.npmjs.com/package/@thesvg/icons) の
tree shaking 対応インポートを使用します。名前付きツールをインポートすると
対応するアイコンが含まれ、`toolCatalog` をインポートするとカタログ全体の
対応アイコンが含まれます。適切なロゴがない場合、ツールは `image` を
省略できます。

カードとそのフィールド定義はバックエンドに依存せず、
コネクターサービスも必要ありません。製品名とロゴは、それぞれの
所有者の商標です。

## カスタムツール

プロジェクト固有のツールは、パッケージカタログを変更せずに同じ公開型を
使用できます。

```ts
import type { Tool } from "ai-tool-elements";

export const Example = {
  id: "example",
  name: "Example",
  image: { type: "url", src: "https://example.com/logo.svg" },
} as const satisfies Tool;
```

`image` は任意です。

## ツール呼び出し

引数のストリーミング中、または実行の待機中は、AI SDK の状態と入力を
そのまま渡します。成功した出力は React コンテンツとしてレンダリングします。

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

対応する状態は `input-streaming`、`input-available`、
`approval-requested`、`approval-responded`、`output-available`、
`output-error`、`output-denied`、`output-cancelled` です。最後の状態は、
完了前にキャンセルされた呼び出しのためのライブラリ拡張です。承認または
キャンセルのコントロールには `actions` を使用します。

## 編集可能なサンプル

Next.js のショーケースを実行します。

```sh
npm run example
```

次に `examples/basic/app/page.tsx` を編集します。静的な本番ビルドは
`npm run example:build` で作成します。

## ロードマップ

- [ ] ShadCN コンポーネントをさらに追加
- [ ] 主要なツール API プロバイダー向けの統一 UI。
- [ ] エージェントスキル

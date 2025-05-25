"use client";

import { RichTextEditor as MantineRichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import PlaceHolder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import InsertImageControl from "../control/insertImageControl";
import { useRef } from "react";

const content = `これは <strong>テスト用の文章</strong> です。RichTextEditor の各種スタイルを確認する目的で作成されています。  

以下は、いくつかの<strong>機能</strong>の確認です。

<br /><br />

<strong>リスト:</strong>  

<ul>

  <li>太字</li>

  <li>下線<u>（例）</u></li>

  <li>取り消し線<s>（例）</s></li>

</ul>

<br />

<strong>コードスニペット:</strong>  

<pre><code>function greet(name) {

  return Hello!;

}</code></pre>

<br />

<strong>段落:</strong><br />

これは文章の改行をテストするための段落です。  

2行目も正常に表示されるか確認してください。

<br /><br />

最後に、<strong>重要なメッセージ</strong>としてこの文章を締めくくります。`;

type Props = {
  onChange: (html: string, blobToFile?: Map<string, File>) => void;
  width: string;
  minHeight: string;
};

export default function RichTextEditor({ onChange, width, minHeight }: Props) {
  const blobToFile = useRef<Map<string, File>>(new Map());
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      PlaceHolder.configure({
        placeholder: "ここに本文を入力...",
      }),
      Image,
    ],
    content,
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), blobToFile.current);
    },
  });
  return (
    <MantineRichTextEditor
      editor={editor}
      w={width}
      mih={minHeight}
      labels={{
        boldControlLabel: "太字",
        italicControlLabel: "斜体",
        underlineControlLabel: "下線",
        strikeControlLabel: "取り消し線",
        clearFormattingControlLabel: "書式をクリア",
        highlightControlLabel: "ハイライト",
        codeControlLabel: "コード",

        h1ControlLabel: "見出し1",
        h2ControlLabel: "見出し2",
        h3ControlLabel: "見出し3",
        h4ControlLabel: "見出し4",

        blockquoteControlLabel: "引用",
        hrControlLabel: "区切り線",
        bulletListControlLabel: "箇条書き",
        orderedListControlLabel: "番号付きリスト",
        subscriptControlLabel: "下付き文字",
        superscriptControlLabel: "上付き文字",

        linkControlLabel: "リンク挿入",
        unlinkControlLabel: "リンク解除",

        alignLeftControlLabel: "左寄せ",
        alignCenterControlLabel: "中央寄せ",
        alignJustifyControlLabel: "両端揃え",
        alignRightControlLabel: "右寄せ",

        undoControlLabel: "元に戻す",
        redoControlLabel: "やり直す",
      }}
    >
      <MantineRichTextEditor.Toolbar>
        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Bold />
          <MantineRichTextEditor.Italic />
          <MantineRichTextEditor.Underline />
          <MantineRichTextEditor.Strikethrough />
          <MantineRichTextEditor.ClearFormatting />
          <MantineRichTextEditor.Highlight />
          <MantineRichTextEditor.Code />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.H1 />
          <MantineRichTextEditor.H2 />
          <MantineRichTextEditor.H3 />
          <MantineRichTextEditor.H4 />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Blockquote />
          <MantineRichTextEditor.Hr />
          <MantineRichTextEditor.BulletList />
          <MantineRichTextEditor.OrderedList />
          <MantineRichTextEditor.Subscript />
          <MantineRichTextEditor.Superscript />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Link />
          <MantineRichTextEditor.Unlink />
          <InsertImageControl blobToFileRef={blobToFile} />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.AlignLeft />
          <MantineRichTextEditor.AlignCenter />
          <MantineRichTextEditor.AlignJustify />
          <MantineRichTextEditor.AlignRight />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Undo />
          <MantineRichTextEditor.Redo />
        </MantineRichTextEditor.ControlsGroup>
      </MantineRichTextEditor.Toolbar>

      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
}

import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import React, { useRef } from "react";
import { IconPhoto } from "@tabler/icons-react";

type Props = {
  blobToFileRef: React.RefObject<Map<string, File>>;
};
const maxSize = 1 * 1024 * 1024;

export default function InsertImageControl({ blobToFileRef }: Props) {
  const { editor } = useRichTextEditorContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadImage = () => inputRef?.current?.click();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor || editor === undefined) {
      return;
    }
    if (file.size > maxSize) {
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    blobToFileRef.current.set(blobUrl, file);
    editor.chain().focus().setImage({ src: blobUrl }).run();
  };
  return (
    <>
      <RichTextEditor.Control
        onClick={uploadImage}
        aria-label="画像"
        title="画像"
      >
        <IconPhoto color="gray" />
      </RichTextEditor.Control>
      <input
        type="file"
        accept="image/*"
        aria-label="画像アップロード"
        value=""
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}

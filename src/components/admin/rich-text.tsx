"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, type Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";
import { uploadImageFile } from "./image-uploader";

export function RichText({
  initialHtml,
  initialJson,
  onChange,
}: {
  initialHtml: string;
  initialJson: unknown;
  onChange: (html: string, json: unknown) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] } }), Image],
    content: (initialJson as object) ?? initialHtml ?? "",
    onUpdate: ({ editor }) => onChange(editor.getHTML(), editor.getJSON()),
    editorProps: { attributes: { class: "prose-brand min-h-[18rem] px-4 py-3 focus:outline-none" } },
  });

  const insertImage = async (file: File | undefined) => {
    if (!file || !editor) return;
    try {
      const url = await uploadImageFile(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      alert("Image upload failed. Use JPG, PNG or WebP under 10 MB.");
    }
  };

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave blank to remove):", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-forest/20 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-forest/10 bg-stone/50 p-2">
        <Btn editor={editor} label="B" title="Bold" cmd={(e) => e.chain().focus().toggleBold().run()} active="bold" bold />
        <Btn editor={editor} label="I" title="Italic" cmd={(e) => e.chain().focus().toggleItalic().run()} active="italic" italic />
        <Btn editor={editor} label="U" title="Underline" cmd={(e) => e.chain().focus().toggleUnderline().run()} active="underline" />
        <Btn editor={editor} label="S" title="Strikethrough" cmd={(e) => e.chain().focus().toggleStrike().run()} active="strike" />
        <Divider />
        <Btn editor={editor} label="H2" title="Heading" cmd={(e) => e.chain().focus().toggleHeading({ level: 2 }).run()} active="heading" activeAttrs={{ level: 2 }} />
        <Btn editor={editor} label="H3" title="Subheading" cmd={(e) => e.chain().focus().toggleHeading({ level: 3 }).run()} active="heading" activeAttrs={{ level: 3 }} />
        <Divider />
        <Btn editor={editor} label="• List" title="Bullet list" cmd={(e) => e.chain().focus().toggleBulletList().run()} active="bulletList" />
        <Btn editor={editor} label="1. List" title="Numbered list" cmd={(e) => e.chain().focus().toggleOrderedList().run()} active="orderedList" />
        <Btn editor={editor} label="Quote" title="Quote" cmd={(e) => e.chain().focus().toggleBlockquote().run()} active="blockquote" />
        <Divider />
        <button type="button" title="Add link" onClick={setLink} className="rounded px-2.5 py-1.5 text-sm hover:bg-stone">
          Link
        </button>
        <button type="button" title="Add image" onClick={() => fileRef.current?.click()} className="rounded px-2.5 py-1.5 text-sm hover:bg-stone">
          Image
        </button>
      </div>
      <EditorContent editor={editor} />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => insertImage(e.target.files?.[0])} />
    </div>
  );
}

function Divider() {
  return <span className="mx-1 w-px self-stretch bg-forest/15" aria-hidden="true" />;
}

function Btn({
  editor,
  label,
  title,
  cmd,
  active,
  activeAttrs,
  bold,
  italic,
}: {
  editor: Editor | null;
  label: string;
  title: string;
  cmd: (e: Editor) => void;
  active: string;
  activeAttrs?: Record<string, unknown>;
  bold?: boolean;
  italic?: boolean;
}) {
  const on = editor?.isActive(active, activeAttrs) ?? false;
  return (
    <button
      type="button"
      title={title}
      aria-pressed={on}
      disabled={!editor}
      onClick={() => editor && cmd(editor)}
      className={`min-w-9 rounded px-2.5 py-1.5 text-sm hover:bg-stone ${on ? "bg-forest text-sand hover:bg-forest" : ""} ${bold ? "font-bold" : ""} ${italic ? "italic" : ""}`}
    >
      {label}
    </button>
  );
}

import { useEditor, EditorContent } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { StarterKit } from "@tiptap/starter-kit";

import { useEffect } from "react";
import CustomImage from "@/extensions/nodes/CustomImage";
import TextAlign from "@tiptap/extension-text-align";
import Menubar from "./tiptap/menubar";
import { TextSelection } from "@tiptap/pm/state";

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  CustomImage,
  Image.configure({
    HTMLAttributes: {
      class: "w-full h-auto",
    },
  }),
  Link.configure({
    openOnClick: true,
    autolink: false,
    defaultProtocol: "https",
    HTMLAttributes: {
      class: "text-blue-500 underline cursor-pointer",
    },
  }),
  Underline.configure({
    HTMLAttributes: {
      class: "underline",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  // table
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Typography,
];
const Tiptap = ({ content, setBlogContent, onChange, trackDroppedImage }) => {
  const editor = useEditor({
    extensions,
    content: content,
    onUpdate({ editor }) {
      if (setBlogContent) {
        setBlogContent(editor.getHTML());
      } else {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          "h-[300px] w-full bg-gray-100 text-wrap rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors  overflow-x-hidden break-words whitespace-pre-wrap file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto",
      },
      handleDrop: function (view, event, slice, moved) {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          // if dropping external files
          let file = event.dataTransfer.files[0]; // the dropped file
          let filesize = (file.size / 1024 / 1024).toFixed(4); // get the filesize in MB
          if (
            (file.type === "image/jpeg" || file.type === "image/png") &&
            filesize < 10
          ) {
            // check valid image type under 10MB
            // check the dimensions
            let _URL = window.URL || window.webkitURL;
            // let img = new Image(); /* global Image */
            let img = document.createElement("img"); /* global Image */
            img.src = _URL.createObjectURL(file);
            img.onload = function () {
              if (this.width > 5000 || this.height > 5000) {
                window.alert(
                  "Your images need to be less than 5000 pixels in height and width."
                );
              } else {
                const { schema } = view.state;
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });

                // Check if there is already content at the position
                let pos = coordinates.pos;
                const nodeAtPosition = view.state.doc.nodeAt(pos);

                // Adjust the position if there's already content at the drop position
                if (nodeAtPosition) {
                  pos += 1; // Shift the position by 1 if it's overlapping
                }
                const node = schema.nodes.image.create({
                  src: img.src,
                });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
                trackDroppedImage(img.src, file);
              }
            };
          } else {
            window.alert(
              "Images need to be in jpg or png format and less than 10mb in size."
            );
          }
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      console.log(content, "content in tiptap");
      // Save cursor position
      const { from, to } = editor.state.selection;

      // update content
      editor.commands.setContent(content);

      // Restore cursor position
      const newFrom = Math.min(from, editor.state.doc.content.size);
      const newTo = Math.min(to, editor.state.doc.content.size);
      const textSelection = new TextSelection(
        editor.state.doc.resolve(newFrom),
        editor.state.doc.resolve(newTo)
      );

      editor.view.dispatch(editor.view.state.tr.setSelection(textSelection));
    }
  }, [editor, content]);

  return (
    <>
      <Menubar editor={editor} trackDroppedImage={trackDroppedImage} />
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;

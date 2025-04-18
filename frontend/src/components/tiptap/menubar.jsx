import React, { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Bold,
  Italic,
  Link2,
  Link2Off,
  ListOrdered,
  Image as Picture,
  UnderlineIcon,
} from "lucide-react";
import { ListBulletIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import HeadingMenu from "./headingMenu";
import TextMenu from "./textMenu";
import TiptapTable from "./table";

export default function Menubar({ editor, trackDroppedImage }) {
  if (!editor) {
    return null;
  }

  const [images, setImages] = useState([]);
  const [url, setUrl] = useState("");
  const [link, setLink] = useState("");
  // add image
  const addImage = useCallback(() => {
    if (url.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
      setUrl("");
    }
  }, [editor, url]);

  const addImageFromDevice = (event) => {
    const file = event.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, { blobUrl, file }]);
      editor
        .chain()
        .focus()
        .insertContent({
          type: "customImage",
          attrs: { src: blobUrl },
        })
        .run();

      trackDroppedImage(blobUrl, file);
    }
  };

  // add link

  const setLinkHandler = useCallback(() => {
    const trimmedLink = link.trim();

    if (!trimmedLink) {
      // Unset the link if input is empty
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      // Set the new link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: trimmedLink })
        .run();
    }

    setLink(""); // Clear the input
  }, [editor, link]);

  if (!editor) {
    return null;
  }

  const toolbarConfig = useMemo(() => {
    return [
      {
        label: "Bold",
        icon: Bold,
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive("bold"),
        isDisabled: () => !editor.can().chain().focus().toggleBold().run(),
        type: "button",
        variant: "ghost",
      },
      {
        label: "Italic",
        icon: Italic,
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive("italic"),
        isDisabled: () => !editor.can().chain().focus().toggleItalic().run(),
        type: "button",
        variant: "ghost",
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        action: () => editor.chain().focus().toggleUnderline().run(),
        isActive: () => editor.isActive("underline"),
        type: "button",
        variant: "ghost",
      },
      {
        label: "Image",
        type: "popover",
        icon: Picture,
        content: (
          <div className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              type="url"
            />
            <Button onClick={addImage}>Confirm</Button>
          </div>
        ),
      },
      {
        label: "Link",
        type: "popover",
        icon: Link2,
        content: (
          <div className="flex gap-2">
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter URL"
              type="url"
            />
            <Button onClick={setLinkHandler}>Confirm</Button>
          </div>
        ),
      },
      {
        label: "Remove Link",
        icon: Link2Off,
        action: () => editor.chain().focus().unsetLink().run(),
        isDisabled: () => !editor.isActive("link"),
        type: "button",
        variant: "ghost",
      },
      {
        label: "Ordered List",
        icon: ListOrdered,
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.isActive("orderedList"),
        type: "button",
        variant: "ghost",
      },
      {
        label: "Bullet List",
        icon: ListBulletIcon,
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: () => editor.isActive("bulletList"),
        type: "button",
        variant: "ghost",
      },
    ];
  }, [editor, url, link]);

  return (
    <div className="toolbar flex gap-4 flex-wrap">
      <TiptapTable editor={editor} />
      <HeadingMenu editor={editor} />
      <TextMenu editor={editor} />
      {toolbarConfig.map((item, index) => {
        if (item.type === "button") {
          return (
            <Button
              key={index}
              variant={item.variant}
              type="button"
              onClick={item.action}
              disabled={item.isDisabled ? item.isDisabled() : false}
              className={item.isActive && item.isActive() ? "is-active" : ""}
            >
              {<item.icon /> || item.label}
            </Button>
          );
        }

        if (item.type === "popover") {
          return (
            <Popover key={index}>
              <PopoverTrigger>{item.icon && <item.icon />}</PopoverTrigger>
              <PopoverContent>{item.content}</PopoverContent>
            </Popover>
          );
        }

        return null;
      })}
    </div>
  );
}

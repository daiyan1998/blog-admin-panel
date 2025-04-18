import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";

const TextMenu = ({ editor }) => {
  const textConfig = [
    {
      label: "Right",
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
      type: "button",
      variant: "ghost",
    },
    {
      label: "Left",
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
      type: "button",
      variant: "ghost",
    },
    {
      label: "Center",
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
      type: "button",
      variant: "ghost",
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Text Align</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto flex flex-wrap p-6 gap-4">
        <DropdownMenuGroup>
          {textConfig.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={item.action}
              className={item.isActive() ? "is-active" : ""}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TextMenu;

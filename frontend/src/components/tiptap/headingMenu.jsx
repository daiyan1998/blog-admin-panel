import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Heading } from "lucide-react";

const HeadingMenu = ({ editor }) => {
  const headingLevels = [1, 2, 3, 4, 5, 6];
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <Heading />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup className="flex">
            {headingLevels.map((level) => (
              <DropdownMenuItem
                key={level}
                variant="ghost"
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
                className={
                  editor.isActive("heading", { level }) ? "is-active" : ""
                }
              >
                H{level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default HeadingMenu;

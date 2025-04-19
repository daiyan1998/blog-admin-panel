import React, { useMemo } from "react";
import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  GitMerge,
  Rows2,
  Table2,
  ToggleLeft,
} from "lucide-react";
const TiptapTable = ({ editor }) => {
  const menuConfig = useMemo(
    () => [
      {
        label: "Table",
        items: [
          {
            label: "Insert table",
            icon: Table2,
            action: () =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run(),
          },
          {
            label: "Delete table",
            icon: Table2,
            action: () => editor.chain().focus().deleteTable().run(),
          },
        ],
      },
      {
        label: "Columns",
        items: [
          {
            label: "Add column before",
            icon: Columns2,
            action: () => editor.chain().focus().addColumnBefore().run(),
          },
          {
            label: "Add column after",
            icon: Columns2,
            action: () => editor.chain().focus().addColumnAfter().run(),
          },
          {
            label: "Delete column",
            icon: Columns2,
            action: () => editor.chain().focus().deleteColumn().run(),
          },
        ],
      },
      {
        label: "Rows",
        items: [
          {
            label: "Add row before",
            icon: Rows2,
            action: () => editor.chain().focus().addRowBefore().run(),
          },
          {
            label: "Add row after",
            icon: Rows2,
            action: () => editor.chain().focus().addRowAfter().run(),
          },
          {
            label: "Delete row",
            icon: Rows2,
            action: () => editor.chain().focus().deleteRow().run(),
          },
        ],
      },
      {
        label: "Toggle",
        items: [
          {
            label: "Toggle header column",
            icon: ToggleLeft,
            action: () => editor.chain().focus().toggleHeaderColumn().run(),
          },
          {
            label: "Toggle header row",
            icon: ToggleLeft,
            action: () => editor.chain().focus().toggleHeaderRow().run(),
          },
          {
            label: "Toggle header cell",
            icon: ToggleLeft,
            action: () => editor.chain().focus().toggleHeaderCell().run(),
          },
        ],
      },
      {
        label: "Merge",
        items: [
          {
            label: "Merge or split",
            icon: GitMerge,
            action: () => editor.chain().focus().mergeOrSplit().run(),
          },
          {
            label: "Merge cells",
            icon: GitMerge,
            action: () => editor.chain().focus().mergeCells().run(),
          },
        ],
      },
      {
        label: "Cell",
        items: [
          {
            label: "Split cell",
            action: () => editor.chain().focus().splitCell().run(),
          },
          {
            label: "Set cell attribute",
            action: () =>
              editor.chain().focus().setCellAttribute("colspan", 2).run(),
          },
        ],
      },
      {
        label: "Navigation",
        items: [
          {
            label: "Go to next cell",
            icon: ChevronRight,
            action: () => editor.chain().focus().goToNextCell().run(),
          },
          {
            label: "Go to previous cell",
            icon: ChevronLeft,
            action: () => editor.chain().focus().goToPreviousCell().run(),
          },
        ],
      },
    ],
    [editor]
  );
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Table</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto flex flex-wrap p-6 gap-4">
          {menuConfig.map((group, index) => (
            <React.Fragment key={index}>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {group.items.map((item, itemIndex) => (
                  <DropdownMenuItem key={itemIndex} onClick={item.action}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
export default TiptapTable;

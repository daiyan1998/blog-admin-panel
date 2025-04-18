"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, CircleX } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getTags } from "@/api/fetchTags";

export function SelectTag({ form, selectedTags, setSelectedTags }) {
  const { data: tags } = useQuery({
    queryFn: () => getTags(),
  });

  const [remainingTags, setRemainingTags] = useState([]);
  // const [remainingCategories, setRemainingCategories] = useState(() =>
  //   categories?.filter(
  //     (category) =>
  //       !selectedCategories.some((selected) => selected.id === category.id)
  //   )
  // );

  useEffect(() => {
    if (tags) {
      setRemainingTags(
        tags.filter(
          (category) =>
            !selectedTags.some((selected) => selected.id === category.id)
        )
      );
    }
  }, [tags]);
  function handleSelectTag(category) {
    setSelectedTags([...selectedTags, category]);

    setRemainingTags(remainingTags.filter((item) => item.id !== category.id));
  }

  function deleteCategoryHandler(category) {
    setSelectedTags(selectedTags.filter((item) => item !== category));

    setRemainingTags([...remainingTags, category]);
  }

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem className="flex items-center">
          <FormLabel>Tags</FormLabel>
          <div className="flex gap-2 flex-wrap mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              {selectedTags?.map((category, i) => (
                <Badge
                  key={category.id + i}
                  variant="secondary"
                  className="cursor-pointer"
                >
                  {category?.name || category}{" "}
                  <CircleX
                    className="ml-4 h-4 w-4 text-red-500"
                    onClick={() => deleteCategoryHandler(category)}
                  />
                </Badge>
              ))}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="ghost"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? tags?.find((category) => category.id === field.value)
                          ?.id
                      : "Select category"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {remainingTags?.map((category, i) => (
                        <CommandItem
                          value={category.id}
                          key={category.id + i}
                          onSelect={() => {
                            form.setValue("category", category.id);
                            handleSelectTag({
                              name: category.name,
                              id: category.id,
                            });
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              category.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

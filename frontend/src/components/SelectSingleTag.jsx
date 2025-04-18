import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/fetchCategories";
import { getTags } from "@/api/fetchTags";

const SelectSingleTag = ({ onChange, value }) => {
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });
  return (
    <div>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {tags?.map((tag) => (
              <SelectItem key={tag.id} value={`${tag.id}`}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectSingleTag;

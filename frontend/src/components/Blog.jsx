import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NotebookPen } from "lucide-react";
import { Link } from "@tanstack/react-router";

const Blog = () => {
  return (
    <Accordion type="single" collapsible className="min-w-20">
      <AccordionItem value="item-1">
        <div className="flex items-center">
          <NotebookPen className="flex-none mr-2 h-4 w-4" />
          <AccordionTrigger className="flex-auto w-20 text-lg">
            Blog
          </AccordionTrigger>
        </div>
        <div className="pl-6">
          <AccordionContent>
            <Link to="/blogs">List</Link>
          </AccordionContent>
          <AccordionContent>
            <Link to="/blogs/create">Create</Link>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default Blog;

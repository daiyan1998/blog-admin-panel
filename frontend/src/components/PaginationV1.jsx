import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationV1({ currentPage, setPage, pages, setPages }) {
  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            disabled={currentPage === 1 ? true : false}
            onClick={() => setPage(currentPage === 1 ? 1 : currentPage - 1)}
          >
            <Link
              to="/blogs"
              search={{
                page: currentPage - 1,
              }}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4 inline-block" />
              Previous
            </Link>
          </Button>
        </PaginationItem>
        {Array.from({ length: pages }).map((_, index) => (
          <PaginationItem key={index}>
            <Link
              to="/blogs"
              search={{ page: index + 1 }}
              onClick={() => setPage(index + 1)}
            >
              <Button
                variant={currentPage === index + 1 ? "default" : "ghost"}
                size="icon"
              >
                {index + 1}
              </Button>
            </Link>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem disabled={currentPage === pages ? true : false}>
          <Button
            variant="outline"
            disabled={currentPage === pages ? true : false}
            onClick={() =>
              setPage(currentPage === pages ? pages : currentPage + 1)
            }
          >
            <Link
              to="/blogs"
              search={{
                page: currentPage + 1,
              }}
              className="flex items-center"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

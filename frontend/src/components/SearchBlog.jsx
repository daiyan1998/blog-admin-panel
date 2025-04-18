"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "@tanstack/react-router";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

const FormSchema = z.object({
  keyword: z.string({
    required_error: "Please select a blog.",
  }),
});

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export function SearchBlog() {
  const [blogs, setBlogs] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const fetchBlogs = (keyword) => {
    api
      .get(`http://localhost:8000/api/v1/blogs/search?keyword=${keyword}`, {
        withCredentials: true,
      })
      .then((res) => {
        setBlogs(res.data.data);
      });
  };

  const debouncedFetchBlogs = debounce(fetchBlogs, 1000);

  function onSubmit(data) {
    debouncedFetchBlogs(data.keyword);
  }

  useEffect(() => {
    const handleClickOutsite = (e) => {
      if (!e.target.closest("form")) {
        setInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsite);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsite);
    };
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onChange={form.handleSubmit(onSubmit)}
          className=" mb-6 w-[250px] relative"
        >
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <Input
                name="keyword"
                placeholder="Search.."
                {...field}
                onFocus={() => setInputFocused(true)}
              />
            )}
          />
          {inputFocused && blogs.length === 0 && (
            <div className="absolute inset-auto text-sm bg-gradient-to-r from-sky-50 to-purple-50 text-gray-500 h-[40px] w-[250px]  p-2">
              Please enter keyword
            </div>
          )}
          {blogs.length > 0 && inputFocused && (
            <div className="absolute inset-auto  bg-gradient-to-r from-sky-50 to-purple-50  p-3 max-h-[300px] w-[400px] overflow-y-scroll rounded-sm">
              {blogs.map((blog) => (
                <Link to={`/blogs/${blog.id}`} key={blog.id}>
                  <div className="flex items-center justify-between border-b border-slate-200 py-4 hover:bg-sky-100">
                    <div className="flex items-center gap-2">
                      <img
                        className="h-10 w-10 rounded-sm"
                        src="https://images.unsplash.com/photo-1685367024091-12959d6430ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                        loading="lazy"
                      />
                      <p>{blog.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </form>
      </Form>
    </>
  );
}

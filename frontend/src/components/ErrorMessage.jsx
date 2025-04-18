import React from "react";
import { Button } from "./ui/button";
import { Ban } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function ErrorMessage({ message }) {
  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center gap-2">
      <Ban className="h-16 w-16" />
      <p className="text-2xl font-bold">{message}</p>

      <Button>
        <Link to="/blogs">Back</Link>
      </Button>
    </div>
  );
}

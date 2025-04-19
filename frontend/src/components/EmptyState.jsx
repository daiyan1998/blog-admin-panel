import React from "react";
import { Button } from "./ui/button";
import { FolderPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import PropTypes from "prop-types";

export default function EmptyState({
  title,
  description,
  buttonText,
  className,
  link,
}) {
  return (
    <div
      className={`container mx-auto  flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <FolderPlus className="h-16 w-16" />
      <p className="text-2xl font-bold">{title}</p>
      <p>{description}</p>

      {buttonText && (
        <Button>
          {link ? (
            <Link to={link} className="text-white font-bold">
              {buttonText}
            </Link>
          ) : (
            buttonText
          )}
        </Button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  className: PropTypes.string,
  link: PropTypes.string,
};

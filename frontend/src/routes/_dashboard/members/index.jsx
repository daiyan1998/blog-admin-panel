import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMember,
  deleteMember,
  getMembers,
  updateMember,
} from "@/api/fetchMembers";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BASE_URL } from "@/lib/constants";

export const Route = createFileRoute("/_dashboard/members/")({
  component: Members,
});

function Members() {
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(),
  });

  const deleteMemberHandler = useMutation({
    mutationFn: (id) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Our Members</div>
        <DialogAddMember />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {members?.map((member) => (
          <Card
            key={member.id}
            className="w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
          >
            <CardHeader className="relative h-48 group">
              {/* Image with Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 rounded-t-lg" />
              <img
                src={`${BASE_URL}/${member.img}`}
                alt={member.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
              {/* Dropdown Menu for Edit/Delete */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors duration-200">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DialogEditMember data={member} />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => deleteMemberHandler.mutate(member.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            {/* Member Details */}
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600">{member.designation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DialogEditMember({ data: member }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm({
    defaultValues: {
      id: member.id,
      name: member.name,
      designation: member.designation,
      image: member.image || "",
    },
  });

  // Watch the image field to generate a preview
  const imageFile = watch("image");
  const imagePreview =
    imageFile && imageFile[0] ? URL.createObjectURL(imageFile[0]) : null;

  const updateMemberHandler = useMutation({
    mutationFn: (data) => updateMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const onSubmit = (data) => {
    // const formData = new FormData();
    // formData.append("id", data.id);
    // formData.append("name", data.name);
    // formData.append("designation", data.designation);
    // if (data.image && data.image[0]) {
    //   formData.append("image", data.image[0]);
    // }
    const formData = data;
    formData.image = data.image[0];
    updateMemberHandler.mutate(formData);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Member</DialogTitle>
          <DialogDescription>
            Make changes to your Member here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="col-span-3 col-start-2 text-sm text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Designation Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="designation" className="text-right">
                Designation
              </Label>
              <Input
                id="designation"
                className="col-span-3"
                {...register("designation")}
              />
            </div>

            {/* Image Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                type="file"
                className="col-span-3"
                {...register("image")}
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Preview</Label>
                <div className="col-span-3">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="mt-2 rounded-lg"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DialogAddMember() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      designation: "",
      image: "",
    },
  });

  // Watch the image field to generate a preview
  const imageFile = watch("image");
  const imagePreview =
    imageFile && imageFile[0] ? URL.createObjectURL(imageFile[0]) : null;

  const createMemberHandler = useMutation({
    mutationFn: (data) => createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      reset();
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("designation", data.designation);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    createMemberHandler.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Member</DialogTitle>
          <DialogDescription>
            Make changes to your Member here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="col-span-3 col-start-2 text-sm text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Designation Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="designation" className="text-right">
                Designation
              </Label>
              <Input
                id="designation"
                className="col-span-3"
                {...register("designation")}
              />
            </div>

            {/* Image Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                type="file"
                className="col-span-3"
                {...register("image")}
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Preview</Label>
                <div className="col-span-3">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="mt-2 rounded-lg"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

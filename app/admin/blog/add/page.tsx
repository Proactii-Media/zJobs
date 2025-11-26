"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { blogSchema } from "@/lib/validations";
import { convertToBase64 } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

//* Dynamically import React Quill (it won't run server-side)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import { Textarea } from "@/components/ui/textarea";

type BlogFormData = z.infer<typeof blogSchema>;

const AddBlog = () => {
  // * useStates
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postImage, setPostImage] = useState("");

  // * hooks
  const router = useRouter();
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  // * functions
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setPostImage(base64);
      onChange(base64); // This sets the form value
    }
  };

  const handleSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          metaKeywords: data.metaKeywords || "",
        }),
      });

      if (response.ok) {
        form.reset();
        setPostImage("");
        router.push("/admin/blog");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit form:", errorData);
        alert(`Failed to submit form: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        `Error submitting form: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
        Add Blogs
      </h1>
      <div className="bg-white border border-gray-300 rounded-xl p-6 text-black">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".jpeg, .png, .jpg"
                        onChange={(e) => handleFileUpload(e, onChange)}
                        {...field}
                        defaultValue={value}
                      />
                    </FormControl>
                    {postImage && (
                      <Image
                        src={postImage}
                        alt="Preview"
                        height={200}
                        width={200}
                        style={{ maxWidth: "200px" }}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="User" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heading</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Heading" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      {/* Use React Quill for rich text editing */}
                      <ReactQuill
                        {...field}
                        theme="snow"
                        value={value || ""}
                        onChange={onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Meta Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Keywords (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Meta Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="text-white px-6 mt-5"
              disabled={isSubmitting}
              onClick={() => router.push("/admin/blog")}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default AddBlog;

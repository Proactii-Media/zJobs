import { Metadata } from "next";
import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBlogs } from "@/lib/actions/blog.actions";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface Blog {
  _id: string;
  image: string;
  user: string;
  date: string;
  heading: string;
  description: string;
  category: string;
}

/* ✅ STATIC METADATA FOR LIST PAGE */
export const metadata: Metadata = {
  title: "Blog - NanoSoft IT",
  description:
    "Explore the NanoSoft IT Blog for insights, tutorials, and IT industry trends.",
  keywords: [
    "IT Blog",
    "Technology Blog",
    "Software Development",
    "NanoSoft IT",
  ],
};

export default async function Blog() {
  const blogs = (await getBlogs()) as Blog[];

  return (
    <section>
      {/* Breadcrumb */}
      <div className="bg-indigo-50 h-14 flex items-center">
        <div className="container max-w-7xl mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Blogs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <div className="mt-10 text-center">
        <h1 className="text-4xl font-bold">IT Blog</h1>
        <p className="text-gray-500 max-w-xl mx-auto mt-3">
          Insights and best practices in managed IT services and enterprise
          technology.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-5 pb-10">
        {blogs.map((blog) => (
          <Link href={`/blog/${blog._id}`} key={blog._id}>
            <Card className="h-full flex flex-col hover:shadow-lg transition">
              <CardHeader className="p-0">
                <Image
                  src={blog.image}
                  alt={blog.heading}
                  width={400}
                  height={200}
                  className="h-48 w-full object-cover"
                />
              </CardHeader>

              <CardContent className="flex-1 p-4">
                <p className="text-sm text-gray-500 mb-2">
                  {blog.user} •{" "}
                  {new Date(blog.date).toLocaleDateString()}
                  <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs">
                    {blog.category}
                  </span>
                </p>

                <h2 className="font-semibold text-lg mb-2">
                  {blog.heading}
                </h2>

                <div
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: blog.description.slice(0, 100) + "...",
                  }}
                />
              </CardContent>

              <CardFooter>
                <span className="text-indigo-600 flex items-center">
                  Read more <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

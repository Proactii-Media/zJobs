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

// Define the Blog type
interface Blog {
  _id: string;
  image: string;
  user: string;
  date: string;
  heading: string;
  description: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
}

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const blogs = (await getBlogs()) as Blog[];

  const titles = blogs.map((blog) => blog.metaTitle).join(", ");
  const descriptions = blogs.map((blog) => blog.metaDescription).join(". ");

  const keywordsSet = new Set<string>();
  blogs.forEach((blog) => {
    if (blog.metaKeywords) {
      blog.metaKeywords.split(",").forEach((keyword: string) => {
        keywordsSet.add(keyword.trim());
      });
    }
  });
  const keywords = Array.from(keywordsSet).join(", ");

  return {
    title: `Blog - NanoSoft IT | ${titles.substring(0, 60)}...`,
    description: descriptions.substring(0, 160),
    keywords: keywords,
    openGraph: {
      title: `Blog - NanoSoft IT`,
      description: descriptions.substring(0, 160),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Blog - NanoSoft IT`,
      description: descriptions.substring(0, 160),
    },
  };
}

export default async function Blog() {
  const blogs = (await getBlogs()) as Blog[];

  return (
    <section>
      <div className="bg-indigo-50 h-14 flex items-center">
        <div className="container max-w-7xl mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList className="text-sm md:text-base">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Blogs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Blog intro */}
      <div className="mt-10">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-neutral-700">IT Blog</h1>
          <p className="sm:w-1/3 text-center text-gray-500 text-base py-3">
            Explore the NanoSoft IT Blog for valuable insights and thought
            leadership on industry best practices in managed IT services and
            enterprise IT trends.
          </p>
        </div>
      </div>

      {/* Blogs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-5 pb-10">
        {blogs.map((blog: Blog) => (
          <Link
            href={`/blog/${blog._id}`}
            className="text-blue-500 hover:text-blue-700 inline-flex items-center"
            key={blog._id}
          >
            <Card className="bg-white rounded-lg shadow-md h-full flex flex-col">
              <CardHeader className="p-0 overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.heading}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg transform hover:scale-110 transition ease-out duration-500"
                />
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <p className="text-sm text-gray-500 mb-2">
                  By {blog.user} • {new Date(blog.date).toLocaleDateString()}
                  <span className="rounded-full px-4 py-1 ml-2 font-medium bg-indigo-100 text-indigo-500">
                    {blog.category}
                  </span>
                </p>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {blog.heading}
                </h2>
                <div
                  className="text-gray-600 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: blog.description.substring(0, 100).concat("..."),
                  }}
                />
              </CardContent>
              <CardFooter>
                <span className="text-indigo-500 hover:text-indigo-700 inline-flex items-center">
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

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/actions/blog.actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CalendarDays, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getBlogById(params.id);

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.metaKeywords,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      images: [{ url: post.image }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getBlogById(params.id);
  const blogUrl = `https://zjobs-nine.vercel.app/blog/${params.id}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    blogUrl
  )}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    blogUrl
  )}&text=${encodeURIComponent(post.heading)}`;

  if (!post) {
    notFound();
  }

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
                <BreadcrumbLink
                  href="/blog"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Blogs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Blog-Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image container with sticky positioning */}
              <div className="md:w-1/2 lg:w-2/5">
                <div className="sticky top-4">
                  <Image
                    src={post.image}
                    alt={post.heading}
                    width={800}
                    height={450}
                    className="w-full h-auto rounded-lg shadow-md mb-4"
                  />

                  {/* Added engagement section below image */}
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Share & Connect
                    </h3>

                    {/* Social sharing buttons */}
                    <div className="flex gap-4 mb-6">
                      <Link href={facebookShareUrl} target="_blank">
                        <Button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Share
                        </Button>
                      </Link>
                      <Link href={twitterShareUrl} target="_blank">
                        <Button className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                          Tweet
                        </Button>
                      </Link>
                    </div>

                    {/* Related tags */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">
                        Related Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {post.metaKeywords
                          ?.split(",")
                          .map((keyword: string, index: string) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-indigo-300 transition cursor-pointer"
                            >
                              {keyword.trim()}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Author info */}
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {post.user}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Content Creator
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content container */}
              <div className="md:w-1/2 lg:w-3/5">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {post.heading}
                </h1>

                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-4">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 text-indigo-500" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="rounded-full px-4 py-1 font-medium bg-indigo-100 text-indigo-500">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div
                  className="prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

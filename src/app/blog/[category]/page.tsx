import { notFound } from "next/navigation";
import { getBlogPosts } from "../utils";
import Link from "next/link";
import Container from "@/components/container";
import Header from "@/components/Header";
import CardCategory from "@/components/CardCategory";
import NotFound from "@/components/NotFound";

// ✅ Correct static params
export function generateStaticParams() {
  const posts = getBlogPosts();
  const categories = Array.from(new Set(posts.map((post) => post.metadata.category)));
  return categories.map((category) => ({ category }));
}

// ✅ Metadata function now async (and awaits params)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return {
    title: category.toUpperCase(),
    description: `All articles regarding ${category}`,
  };
}

// ✅ Page function awaits params (Next.js 15 convention)
export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const posts = getBlogPosts().filter(
    (post) => post.metadata.category === category
  );

  if (!posts.length) {
    return <NotFound />;
  }

  return (
    <>
      <Header>
        <Container>
          <h1 className="title font-semibold text-2xl tracking-wider mt-4 uppercase">
            {category}
          </h1>
        </Container>
      </Header>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {posts
            .sort(
              (a, b) =>
                new Date(b.metadata.publishedAt).getTime() -
                new Date(a.metadata.publishedAt).getTime()
            )
            .map((post) => (
              <Link
                href={`/blog/${post.metadata.category}/${post.slug}`}
                key={post.slug}
              >
                <CardCategory
                  title={post.metadata.title}
                  summary={post.metadata.summary}
                  date={post.metadata.publishedAt}
                />
              </Link>
            ))}
        </div>
      </Container>
    </>
  );
}

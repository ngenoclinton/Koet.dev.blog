import { notFound } from "next/navigation";
import { formatDate, getBlogPosts } from "../../utils";
import Header from "@/components/Header";
import { CustomMDX } from "@/components/mdx";
import ReportViews from "@/components/ReportViews";
import { baseUrl } from "@/app/sitemap";
import { BreadcrumbWithCustomSeparator } from "@/components/BreadCrumb";
import Container from "@/components/container";

// ✅ Correct type for the new Next.js convention
type BlogPageParams = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

// ✅ Fine for static params
export function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    category: post.metadata.category,
    slug: post.slug,
  }));
}

// ✅ Metadata must await params (Next.js 15+)
export async function generateMetadata({ params }: BlogPageParams) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) return;

  const { title, publishedAt: publishedTime, summary: description, image } =
    post.metadata;

  const ogImage =
    image || `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.metadata.category}/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ✅ Page component now awaits params
export default async function Page({ params }: BlogPageParams) {
  const { category, slug } = await params;
  const post = getBlogPosts().find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.metadata.category}/${post.slug}`,
            author: {
              "@type": "Person",
              name: "Coding Jitsu Blog",
            },
          }),
        }}
      />

      <ReportViews
        category={post.metadata.category}
        title={post.metadata.title}
        slug={post.slug}
      />

      <Header>
        <Container>
          <BreadcrumbWithCustomSeparator
            category={post.metadata.category}
            slug={post.slug}
          />
          <h1 className="title font-semibold text-2xl tracking-tighter mt-4">
            {post.metadata.title}
          </h1>
          <div className="flex justify-between items-center mt-2 mb-4 text-sm">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              {formatDate(post.metadata.publishedAt)}
            </p>
          </div>
        </Container>
      </Header>

      <Container>
        <article className="prose">
          <CustomMDX source={post.content} />
        </article>
      </Container>
    </>
  );
}

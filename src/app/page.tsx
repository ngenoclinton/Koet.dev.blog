import Container from "@/components/container";
import PopularPosts from "@/components/home/PopularPosts";
import TopCatogories from "@/components/home/TopCatogories";
import LatestPosts from "@/components/latest-posts";
import { MainNav } from "@/components/main-nav";

export default function Home() {
  return (
    <Container>
      <main className="relative flex flex-col items-start justify-evenly mt-16 md:flex-row">
        <div>
          <LatestPosts />
        </div>
        <div className="h-screen sticky top-0">
          <div>
            <h1 className="font-bold mb-4">TOP CATEGORIES</h1>
            <TopCatogories/>
          </div>
          <div className="mt-10 sticky top-0">
            <h1 className="font-bold mb-4">POPULAR POSTS</h1>
            <PopularPosts />
          </div>
        </div>
      </main>
    </Container>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { BlogCard } from "./BlogCard";
import { fetchPosts, type BlogPost } from "@/api/client";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

export function Community() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        setPosts(data.slice(0, 4));
      })
      .catch((err) => {
        console.error("Failed to load blog posts:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="community" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="writing & ideas"
          title="My Community."
          intro="Notes from building on the web — lessons from shipping marketplaces, growing traffic, and working with developers around the world."
        />

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col h-[320px] rounded-2xl border border-border bg-surface/50 p-5">
                <div className="aspect-[16/10] bg-slate-200/50 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200/50 rounded w-1/3 mb-2" />
                <div className="h-6 bg-slate-200/50 rounded w-3/4 mb-2" />
                <div className="h-10 bg-slate-200/50 rounded w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {posts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </motion.div>
        )}

        {/* View All Articles Button */}
        {!loading && posts.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-10 flex justify-center"
          >
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/5 px-7 py-3 text-sm font-semibold text-accent backdrop-blur transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-glow-sm hover:scale-[1.02]"
            >
              View All Articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

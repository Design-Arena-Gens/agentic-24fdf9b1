"use client";

import { allPosts } from "@/lib/storage";
import type { VehicleType } from "@/lib/types";
import { useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function Home() {
  const [filter, setFilter] = useState<VehicleType | "all">("all");
  const [query, setQuery] = useState("");
  const posts = allPosts();

  const filtered = useMemo(() => {
    let p = posts;
    if (filter !== "all") p = p.filter((x) => x.type === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      p = p.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          x.authorHandle.toLowerCase().includes(q) ||
          x.specs.make.toLowerCase().includes(q) ||
          x.specs.model.toLowerCase().includes(q)
      );
    }
    return p;
  }, [posts, filter, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h1 className="text-2xl font-semibold">Community Feed</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search builds or @handle..."
            className="px-3 py-2 rounded bg-white/5 border border-white/10 w-64"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex rounded overflow-hidden border border-white/10">
            <Tab active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </Tab>
            <Tab active={filter === "car"} onClick={() => setFilter("car")}>
              Cars
            </Tab>
            <Tab active={filter === "bike"} onClick={() => setFilter("bike")}>
              Bikes
            </Tab>
          </div>
          <Link
            href="/create"
            className="ml-2 px-3 py-2 rounded bg-foreground text-background text-sm"
          >
            Share your build
          </Link>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-white/70 text-sm">No posts yet. Be the first to share!</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm ${active ? "bg-white/20" : "bg-white/10 hover:bg-white/15"}`}
    >
      {children}
    </button>
  );
}

"use client";

import { likePost, followHandle } from "@/lib/storage";
import type { Post } from "@/lib/types";
import { useState } from "react";
import cn from "classnames";

export default function PostCard({ post }: { post: Post }) {
  const [likes, setLikes] = useState<number>(post.likes);

  const onLike = () => {
    likePost(post.id);
    setLikes((x) => x + 1);
  };

  const onFollow = () => {
    followHandle(post.authorHandle);
    // no local state needed
  };

  return (
    <article className="rounded-lg overflow-hidden border border-white/10 bg-white/5">
      <div className="relative w-full h-64 sm:h-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl}
          alt={post.title}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <span
            className={cn(
              "text-xs uppercase rounded px-2 py-1",
              post.type === "car" ? "bg-blue-500/20 text-blue-300" : "bg-emerald-500/20 text-emerald-300"
            )}
          >
            {post.type}
          </span>
        </div>
        <div className="text-sm text-white/70">
          by <span className="font-mono">@{post.authorHandle}</span>
          {post.location?.name ? <> ? {post.location.name}</> : null}
        </div>
        {post.description ? (
          <p className="text-sm leading-relaxed">{post.description}</p>
        ) : null}
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
          <Spec label="Make" value={post.specs.make} />
          <Spec label="Model" value={post.specs.model} />
          {post.specs.year ? <Spec label="Year" value={String(post.specs.year)} /> : null}
          {post.specs.engine ? <Spec label="Engine" value={post.specs.engine} /> : null}
          {post.specs.horsepower ? <Spec label="HP" value={String(post.specs.horsepower)} /> : null}
          {post.specs.color ? <Spec label="Color" value={post.specs.color} /> : null}
        </div>
        {post.mods?.length ? (
          <div className="flex flex-wrap gap-2">
            {post.mods.map((m, i) => (
              <span key={i} className="text-xs bg-white/10 rounded px-2 py-1">
                {m}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onLike}
            className="text-sm rounded px-3 py-1.5 bg-white/10 hover:bg-white/20 transition"
          >
            ?? {likes}
          </button>
          <button
            onClick={onFollow}
            className="text-sm rounded px-3 py-1.5 bg-white/10 hover:bg-white/20 transition"
          >
            Follow @{post.authorHandle}
          </button>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-white/5 border border-white/10 p-2">
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
      <div className="text-xs">{value}</div>
    </div>
  );
}


"use client";

import PostCard from "@/components/PostCard";
import { myPosts, myProfile, setBio, setHandle, knownHandles, followHandle } from "@/lib/storage";
import { useMemo, useState } from "react";

export default function ProfilePage() {
  const profile = myProfile();
  const [handle, setHandleState] = useState(profile.handle);
  const [bio, setBioState] = useState(profile.bio ?? "");
  const posts = myPosts();

  const suggestions = useMemo(() => {
    return knownHandles().filter((h) => h !== handle && !profile.following.includes(h)).slice(0, 8);
  }, [handle, profile.following]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-3">
          <div className="rounded border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="space-y-1">
              <label className="text-sm">Handle</label>
              <div className="flex gap-2">
                <span className="px-2 py-2 rounded bg-white/10 text-white/70">@</span>
                <input
                  className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10"
                  value={handle}
                  onChange={(e) => setHandleState(e.target.value)}
                />
                <button
                  className="px-3 py-2 rounded bg-foreground text-background"
                  onClick={() => setHandle(handle)}
                >
                  Save
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm">Bio</label>
              <textarea
                className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
                value={bio}
                onChange={(e) => setBioState(e.target.value)}
                rows={3}
              />
              <div>
                <button
                  className="px-3 py-2 rounded bg-foreground text-background"
                  onClick={() => setBio(bio)}
                >
                  Update Bio
                </button>
              </div>
            </div>
          </div>
          <div className="rounded border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold mb-2">Following</h2>
            {profile.following.length === 0 ? (
              <div className="text-sm text-white/70">You aren&apos;t following anyone yet.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.following.map((h) => (
                  <span key={h} className="px-2 py-1 text-sm rounded bg-white/10">@{h}</span>
                ))}
              </div>
            )}
          </div>
          {suggestions.length ? (
            <div className="rounded border border-white/10 bg-white/5 p-4">
              <h2 className="text-lg font-semibold mb-2">People to follow</h2>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((h) => (
                  <button
                    key={h}
                    className="px-3 py-1.5 text-sm rounded bg-white/10 hover:bg-white/20"
                    onClick={() => followHandle(h)}
                  >
                    @{h}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">My Builds</h2>
          {posts.length === 0 ? (
            <div className="text-sm text-white/70">You haven&apos;t shared any builds yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


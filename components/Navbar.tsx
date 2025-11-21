import Link from "next/link";
import { myHandle } from "@/lib/storage";

export default function Navbar() {
  // This renders on server first; avoid direct localStorage access here.
  const handle = typeof window !== "undefined" ? myHandle() : "my-profile";
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          Gearheads
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Feed
          </Link>
          <Link href="/create" className="hover:underline">
            Create
          </Link>
          <Link href="/meetups" className="hover:underline">
            Meetups
          </Link>
          <Link href="/profile" className="hover:underline">
            @{handle}
          </Link>
        </nav>
      </div>
    </header>
  );
}


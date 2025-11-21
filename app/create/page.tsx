import PostForm from "@/components/PostForm";

export const dynamic = "force-dynamic";

export default function CreatePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Share Your Build</h1>
      <PostForm />
    </div>
  );
}


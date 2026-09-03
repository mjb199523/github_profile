import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background min-h-screen">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-20 px-8 text-center">
        <p className="text-accent font-medium tracking-widest text-sm mb-4 uppercase">
          GITHUB PROFILE DESIGNER
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6 max-w-2xl">
          Build a GitHub profile worth looking at.
        </h1>
        <p className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed">
          Create a polished GitHub Profile README from your GitHub profile. Customize your story, projects and tech stack, preview it live, and copy it when you are ready.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/generator"
            className="flex h-12 items-center justify-center rounded-lg bg-accent px-8 font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer"
          >
            Create My README →
          </Link>
        </div>
      </main>
    </div>
  );
}

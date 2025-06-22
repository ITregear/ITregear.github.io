import TabsNav from "@/components/ui/tabs";

export default function TopSecret() {
  return (
    <div className="bg-vintage-beige text-typewriter-dark font-typewriter min-h-screen">
      <TabsNav />
      <main className="container mx-auto px-6 pt-24 pb-24 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-stamp-red mb-6">TOP SECRET</h1>
        <p className="text-lg text-typewriter-medium text-center max-w-xl">
          This area is restricted. Authorized personnel only.<br />
          Please return to a public section of the site.
        </p>
      </main>
    </div>
  );
} 
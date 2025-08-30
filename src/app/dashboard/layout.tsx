import Navbar from "@/components/Navbar";
import PublishPost from "@/components/PublishPost";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <PublishPost />

      <div className="">
        <main>{children}</main>
        <Toaster />
      </div>
    </div>
  );
}

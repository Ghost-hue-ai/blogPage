import Navbar from "@/components/Navbar";
import PublishPost from "@/components/PublishPost";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/contexts/SidebarContext";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div>
        <Sidebar />
        <div className="">
          <main>{children}</main>
          <Toaster />
        </div>
      </div>
    </SidebarProvider>
  );
}

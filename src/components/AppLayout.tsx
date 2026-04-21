import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold text-foreground">LifeTracker</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
          <footer className="border-t bg-blue-100 px-6 py-3 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground">LifeTracker Wellness</p>
            <p className="mt-1">
              Desarrollado por{" "}
              <span className="font-medium text-foreground">Mariana Carvajal Rueda</span>
              {" "}&{" "}
              <span className="font-medium text-foreground">Andrea Marín Díaz</span>
              {" "}— Desarrolladoras FullStack
            </p>
            <p className="mt-1 text-xs">© {new Date().getFullYear()} Todos los derechos reservados</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
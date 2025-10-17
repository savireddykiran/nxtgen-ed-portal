import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface TopNavProps {
  userName: string;
  role: string;
}

export function TopNav({ userName, role }: TopNavProps) {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-4 gap-4">
      <SidebarTrigger />
      
      <div className="flex-1">
        <h2 className="text-lg font-semibold">
          Welcome, {userName} ({role.charAt(0).toUpperCase() + role.slice(1)})
        </h2>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/discussions")}
        className="relative"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </header>
  );
}

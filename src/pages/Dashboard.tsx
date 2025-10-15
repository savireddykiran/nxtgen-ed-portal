import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and fetch their role
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      
      // Fetch user role from database
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      
      setRole(roleData?.role || "student");
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Nxtgen LMS</span>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-card p-8 rounded-2xl border border-border mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!
            </h1>
            <p className="text-muted-foreground">
              Email: {user?.email}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="gradient-card p-6 rounded-2xl border border-border">
              <h2 className="text-xl font-bold mb-4">Dashboard Coming Soon</h2>
              <p className="text-muted-foreground">
                Your personalized {role} dashboard will be available in Phase 2.
                Stay tuned for exciting features!
              </p>
            </div>

            <div className="gradient-card p-6 rounded-2xl border border-border">
              <h2 className="text-xl font-bold mb-4">Your Role</h2>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                role === "teacher" 
                  ? "bg-secondary/10 text-secondary border border-secondary/20" 
                  : "bg-primary/10 text-primary border border-primary/20"
              }`}>
                {role === "teacher" ? <GraduationCap className="h-5 w-5" /> : null}
                <span className="font-semibold capitalize">{role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

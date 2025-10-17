import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, FileText, Users, Award } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNav } from "@/components/TopNav";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    students: 0,
    avgGrade: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchStats();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", session.user.id)
      .single();
    
    setRole(roleData?.role || "student");
    setUserName(profile?.full_name || "User");
    setLoading(false);
  };

  const fetchStats = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleData?.role === "teacher") {
      const { data: coursesData } = await supabase
        .from("courses")
        .select("id")
        .eq("teacher_id", session.user.id);

      const { data: assignmentsData } = await supabase
        .from("assignments")
        .select("id, course_id")
        .in("course_id", coursesData?.map(c => c.id) || []);

      const { data: enrollmentsData } = await supabase
        .from("enrollments")
        .select("id")
        .in("course_id", coursesData?.map(c => c.id) || []);

      setStats({
        courses: coursesData?.length || 0,
        assignments: assignmentsData?.length || 0,
        students: enrollmentsData?.length || 0,
        avgGrade: 0,
      });
    } else {
      const { data: enrollmentsData } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("student_id", session.user.id);

      const { data: submissionsData } = await supabase
        .from("submissions")
        .select(`
          id,
          assignment_id,
          assignments(course_id)
        `)
        .eq("student_id", session.user.id);

      const { data: gradesData } = await supabase
        .from("grades")
        .select("grade, submission_id")
        .in("submission_id", submissionsData?.map(s => s.id) || []);

      const avgGrade = gradesData && gradesData.length > 0
        ? gradesData.reduce((acc, g) => acc + (Number(g.grade) || 0), 0) / gradesData.length
        : 0;

      setStats({
        courses: enrollmentsData?.length || 0,
        assignments: submissionsData?.length || 0,
        students: 0,
        avgGrade: Math.round(avgGrade),
      });
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col">
          <TopNav userName={userName} role={role} />
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {role === "teacher" ? "My Courses" : "Enrolled"}
                        </p>
                        <p className="text-2xl font-bold">{stats.courses}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-secondary/10">
                        <FileText className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {role === "teacher" ? "Assignments" : "Submitted"}
                        </p>
                        <p className="text-2xl font-bold">{stats.assignments}</p>
                      </div>
                    </div>
                  </Card>

                  {role === "teacher" && (
                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-accent/10">
                          <Users className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Students</p>
                          <p className="text-2xl font-bold">{stats.students}</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {role === "student" && (
                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-accent/10">
                          <Award className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Grade</p>
                          <p className="text-2xl font-bold">{stats.avgGrade}%</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => navigate("/courses")}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        {role === "teacher" ? "Manage Courses" : "Browse Courses"}
                      </Button>
                      {role === "teacher" && (
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => navigate("/create-course")}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Create New Course
                        </Button>
                      )}
                      {role === "student" && (
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => navigate("/my-courses")}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          View My Grades
                        </Button>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Account Info</h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-medium capitalize">{role}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

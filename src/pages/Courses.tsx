import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BookOpen, Clock, User, LogOut } from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchCourses();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();
    
    setRole(roleData?.role || "student");
  };

  const fetchCourses = async () => {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select(`
          *,
          profiles!courses_teacher_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false });

      if (coursesError) throw coursesError;

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: enrollmentsData } = await supabase
          .from("enrollments")
          .select("course_id")
          .eq("student_id", session.user.id);

        setEnrolledCourses(enrollmentsData?.map(e => e.course_id) || []);
      }

      setCourses(coursesData || []);
    } catch (error: any) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("enrollments")
        .insert({
          course_id: courseId,
          student_id: session.user.id
        });

      if (error) throw error;

      toast.success("Successfully enrolled in course!");
      setEnrolledCourses([...enrolledCourses, courseId]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Nxtgen LMS
          </h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            {role === "teacher" && (
              <Button onClick={() => navigate("/create-course")}>
                Create Course
              </Button>
            )}
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Available Courses</h2>
          <p className="text-muted-foreground">
            {role === "student" ? "Browse and enroll in courses" : "View all courses"}
          </p>
        </div>

        {courses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No courses available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {course.profiles?.full_name || "Unknown Teacher"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  {role === "student" && (
                    <Button
                      className="w-full"
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolledCourses.includes(course.id)}
                    >
                      {enrolledCourses.includes(course.id) ? "Enrolled" : "Enroll Now"}
                    </Button>
                  )}
                  <Button
                    className="w-full mt-2"
                    variant="outline"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    View Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;

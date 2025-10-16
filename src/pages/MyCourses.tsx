import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [grades, setGrades] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select(`
          *,
          courses(
            *,
            profiles!courses_teacher_id_fkey(full_name)
          )
        `)
        .eq("student_id", session.user.id)
        .order("enrolled_at", { ascending: false });

      if (enrollmentsError) throw enrollmentsError;

      setEnrolledCourses(enrollmentsData || []);

      // Fetch grades for each course
      const gradesMap = new Map();
      for (const enrollment of enrollmentsData || []) {
        const { data: courseGrades } = await supabase
          .from("submissions")
          .select(`
            *,
            grades(*),
            assignments(course_id)
          `)
          .eq("student_id", session.user.id)
          .eq("assignments.course_id", enrollment.course_id);

        if (courseGrades && courseGrades.length > 0) {
          const totalGrades = courseGrades.filter(s => s.grades);
          if (totalGrades.length > 0) {
            const average = totalGrades.reduce((sum, s) => sum + (s.grades?.grade || 0), 0) / totalGrades.length;
            gradesMap.set(enrollment.course_id, average.toFixed(2));
          }
        }
      }
      setGrades(gradesMap);

    } catch (error: any) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
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
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/courses")}>
            Browse Courses
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Enrolled Courses</h2>
          <p className="text-muted-foreground">Track your progress and grades</p>
        </div>

        {enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
              <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enrollment) => (
              <Card 
                key={enrollment.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/course/${enrollment.courses.id}`)}
              >
                <CardHeader>
                  <CardTitle>{enrollment.courses.title}</CardTitle>
                  <CardDescription>
                    Instructor: {enrollment.courses.profiles?.full_name || "Unknown"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {enrollment.courses.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </span>
                    {grades.has(enrollment.course_id) && (
                      <div className="bg-primary/10 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold">
                          Avg: {grades.get(enrollment.course_id)}%
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;

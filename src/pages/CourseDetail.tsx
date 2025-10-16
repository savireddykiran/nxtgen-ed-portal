import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Users, FileText, MessageSquare, Upload } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [role, setRole] = useState<string>("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
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

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select(`
          *,
          profiles!courses_teacher_id_fkey(full_name)
        `)
        .eq("id", id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: enrollmentData } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", id)
        .eq("student_id", session.user.id)
        .maybeSingle();

      setIsEnrolled(!!enrollmentData);

      if (roleData?.role === "teacher" && courseData.teacher_id === session.user.id) {
        const { data: studentsData } = await supabase
          .from("enrollments")
          .select(`
            *,
            profiles!enrollments_student_id_fkey(full_name)
          `)
          .eq("course_id", id);

        setStudents(studentsData || []);
      }

      const { data: assignmentsData } = await supabase
        .from("assignments")
        .select("*")
        .eq("course_id", id)
        .order("created_at", { ascending: false });

      setAssignments(assignmentsData || []);

      const { data: materialsData } = await supabase
        .from("course_materials")
        .select("*")
        .eq("course_id", id)
        .order("uploaded_at", { ascending: false });

      setMaterials(materialsData || []);

    } catch (error: any) {
      toast.error("Failed to load course data");
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

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/courses")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{course.title}</CardTitle>
            <p className="text-muted-foreground">
              Instructor: {course.profiles?.full_name || "Unknown"}
            </p>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{course.description}</p>
            <p className="text-sm text-muted-foreground">Duration: {course.duration}</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assignments">
              <FileText className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="materials">
              <Upload className="h-4 w-4 mr-2" />
              Materials
            </TabsTrigger>
            {role === "teacher" && (
              <TabsTrigger value="students">
                <Users className="h-4 w-4 mr-2" />
                Students
              </TabsTrigger>
            )}
            <TabsTrigger value="discussion">
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Assignments</h3>
              {role === "teacher" && (
                <Button onClick={() => navigate(`/course/${id}/create-assignment`)}>
                  Create Assignment
                </Button>
              )}
            </div>
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No assignments yet
                </CardContent>
              </Card>
            ) : (
              assignments.map((assignment) => (
                <Card key={assignment.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/assignment/${assignment.id}`)}>
                  <CardHeader>
                    <CardTitle>{assignment.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                    {assignment.due_date && (
                      <p className="text-sm">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Course Materials</h3>
              {role === "teacher" && (
                <Button onClick={() => navigate(`/course/${id}/upload-material`)}>
                  Upload Material
                </Button>
              )}
            </div>
            {materials.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No materials uploaded yet
                </CardContent>
              </Card>
            ) : (
              materials.map((material) => (
                <Card key={material.id}>
                  <CardContent className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{material.title}</h4>
                      <p className="text-sm text-muted-foreground">{material.file_type}</p>
                    </div>
                    <Button variant="outline" onClick={() => window.open(material.file_url, '_blank')}>
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {role === "teacher" && (
            <TabsContent value="students" className="space-y-4">
              <h3 className="text-xl font-semibold">Enrolled Students</h3>
              {students.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No students enrolled yet
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-4">
                    <ul className="space-y-2">
                      {students.map((enrollment) => (
                        <li key={enrollment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <span>{enrollment.profiles?.full_name || "Unknown Student"}</span>
                          <span className="text-sm text-muted-foreground">
                            Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="discussion" className="space-y-4">
            <h3 className="text-xl font-semibold">Course Discussion</h3>
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Discussion forum coming soon
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;

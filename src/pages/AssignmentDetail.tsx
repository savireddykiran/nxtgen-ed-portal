import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Upload, FileText } from "lucide-react";

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<any>(null);
  const [role, setRole] = useState<string>("");
  const [submission, setSubmission] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignmentData();
  }, [id]);

  const fetchAssignmentData = async () => {
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

      const { data: assignmentData, error: assignmentError } = await supabase
        .from("assignments")
        .select(`
          *,
          courses(
            id,
            title,
            teacher_id
          )
        `)
        .eq("id", id)
        .single();

      if (assignmentError) throw assignmentError;
      setAssignment(assignmentData);

      if (roleData?.role === "student") {
        const { data: submissionData } = await supabase
          .from("submissions")
          .select(`
            *,
            grades(*)
          `)
          .eq("assignment_id", id)
          .eq("student_id", session.user.id)
          .maybeSingle();

        setSubmission(submissionData);
        if (submissionData) {
          setContent(submissionData.content || "");
        }
      } else if (roleData?.role === "teacher" && assignmentData.courses.teacher_id === session.user.id) {
        const { data: submissionsData } = await supabase
          .from("submissions")
          .select(`
            *,
            profiles!submissions_student_id_fkey(full_name),
            grades(*)
          `)
          .eq("assignment_id", id);

        setSubmissions(submissionsData || []);
      }

    } catch (error: any) {
      toast.error("Failed to load assignment data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (submission) {
        const { error } = await supabase
          .from("submissions")
          .update({ content })
          .eq("id", submission.id);

        if (error) throw error;
        toast.success("Submission updated successfully!");
      } else {
        const { error } = await supabase
          .from("submissions")
          .insert({
            assignment_id: id,
            student_id: session.user.id,
            content
          });

        if (error) throw error;
        toast.success("Assignment submitted successfully!");
      }

      fetchAssignmentData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGradeSubmission = async (submissionId: string, grade: number, feedback: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: existingGrade } = await supabase
        .from("grades")
        .select("*")
        .eq("submission_id", submissionId)
        .maybeSingle();

      if (existingGrade) {
        const { error } = await supabase
          .from("grades")
          .update({ grade, feedback })
          .eq("id", existingGrade.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("grades")
          .insert({
            submission_id: submissionId,
            grade,
            feedback,
            graded_by: session.user.id
          });

        if (error) throw error;
      }

      toast.success("Grade submitted successfully!");
      fetchAssignmentData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Assignment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(`/course/${assignment.courses.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{assignment.title}</CardTitle>
            <p className="text-muted-foreground">
              Course: {assignment.courses.title}
            </p>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{assignment.description}</p>
            {assignment.due_date && (
              <p className="text-sm text-muted-foreground">
                Due: {new Date(assignment.due_date).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        {role === "student" && (
          <Card>
            <CardHeader>
              <CardTitle>Your Submission</CardTitle>
            </CardHeader>
            <CardContent>
              {submission?.grades && submission.grades.length > 0 ? (
                <div className="mb-6 p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Grade: {submission.grades[0].grade}/100</h4>
                  {submission.grades[0].feedback && (
                    <p className="text-sm">Feedback: {submission.grades[0].feedback}</p>
                  )}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Your Answer
                  </label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your submission here..."
                    rows={10}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : submission ? "Update Submission" : "Submit Assignment"}
                </Button>
              </form>

              {submission && (
                <p className="text-sm text-muted-foreground mt-4">
                  Submitted: {new Date(submission.submitted_at).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {role === "teacher" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Student Submissions</h3>
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No submissions yet
                </CardContent>
              </Card>
            ) : (
              submissions.map((sub) => (
                <SubmissionCard
                  key={sub.id}
                  submission={sub}
                  onGrade={handleGradeSubmission}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SubmissionCard = ({ submission, onGrade }: any) => {
  const [grade, setGrade] = useState(submission.grades?.[0]?.grade || "");
  const [feedback, setFeedback] = useState(submission.grades?.[0]?.feedback || "");
  const [isGrading, setIsGrading] = useState(false);

  const handleSubmitGrade = async () => {
    setIsGrading(true);
    await onGrade(submission.id, Number(grade), feedback);
    setIsGrading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submission.profiles?.full_name || "Unknown Student"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Submitted: {new Date(submission.submitted_at).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Submission:</h4>
          <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded">
            {submission.content}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`grade-${submission.id}`} className="block text-sm font-medium mb-2">
              Grade (0-100)
            </label>
            <Input
              id={`grade-${submission.id}`}
              type="number"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Enter grade"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`feedback-${submission.id}`} className="block text-sm font-medium mb-2">
            Feedback
          </label>
          <Textarea
            id={`feedback-${submission.id}`}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide feedback to the student..."
            rows={3}
          />
        </div>

        <Button onClick={handleSubmitGrade} disabled={isGrading || !grade}>
          {isGrading ? "Submitting..." : submission.grades?.length > 0 ? "Update Grade" : "Submit Grade"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssignmentDetail;

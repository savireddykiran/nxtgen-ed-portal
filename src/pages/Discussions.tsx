import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNav } from "@/components/TopNav";

interface DiscussionPost {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  course_id: string;
  parent_id: string | null;
  profiles: {
    full_name: string;
  };
  courses: {
    title: string;
  };
}

const Discussions = () => {
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchCourses();
    fetchPosts();
  }, []);

  const fetchUserData = async () => {
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", session.user.id)
      .single();

    setRole(roleData?.role || "student");
    setUserName(profile?.full_name || "User");
  };

  const fetchCourses = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleData?.role === "teacher") {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("teacher_id", session.user.id);
      setCourses(data || []);
    } else {
      const { data } = await supabase
        .from("enrollments")
        .select("courses(*)")
        .eq("student_id", session.user.id);
      setCourses(data?.map(e => e.courses) || []);
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("discussion_posts")
      .select(`
        *,
        courses(title)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch discussions");
      setLoading(false);
      return;
    }

    // Fetch profiles separately
    const postsWithProfiles = await Promise.all(
      (data || []).map(async (post) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", post.user_id)
          .single();
        
        return {
          ...post,
          profiles: profile || { full_name: "Unknown User" }
        };
      })
    );

    setPosts(postsWithProfiles as DiscussionPost[]);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!newPost.trim() || !selectedCourse) {
      toast.error("Please select a course and enter a message");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("discussion_posts").insert({
      content: newPost,
      user_id: session.user.id,
      course_id: selectedCourse,
    });

    if (error) {
      toast.error("Failed to post discussion");
    } else {
      toast.success("Discussion posted!");
      setNewPost("");
      setSelectedCourse("");
      fetchPosts();
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
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h1 className="text-3xl font-bold">Discussions & Forum</h1>
                </div>

                <Card className="p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Start a Discussion</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Course</label>
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="">Choose a course...</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Textarea
                      placeholder="Share your thoughts, ask questions..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      rows={4}
                    />
                    <Button onClick={handleSubmit} className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Post Discussion
                    </Button>
                  </div>
                </Card>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Recent Discussions</h2>
                  {posts.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground">
                      No discussions yet. Start one above!
                    </Card>
                  ) : (
                    posts.map((post) => (
                      <Card key={post.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold">{post.profiles.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {post.courses.title} • {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Discussions;

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

CREATE POLICY "Teachers can create courses"
  ON public.courses FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teachers can update their own courses"
  ON public.courses FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own courses"
  ON public.courses FOR DELETE
  USING (auth.uid() = teacher_id);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, student_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view enrollments for their courses"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = enrollments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can enroll in courses"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id AND public.has_role(auth.uid(), 'student'));

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view assignments for enrolled courses"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = assignments.course_id
      AND enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view assignments for their courses"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = assignments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create assignments for their courses"
  ON public.assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update assignments for their courses"
  ON public.assignments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = assignments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete assignments for their courses"
  ON public.assignments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = assignments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view submissions for their course assignments"
  ON public.submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.courses c ON c.id = a.course_id
      WHERE a.id = submissions.assignment_id
      AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can create submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own submissions"
  ON public.submissions FOR UPDATE
  USING (auth.uid() = student_id);

-- Create grades table
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL UNIQUE,
  grade NUMERIC(5,2),
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  graded_by UUID REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own grades"
  ON public.grades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions
      WHERE submissions.id = grades.submission_id
      AND submissions.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view grades for their courses"
  ON public.grades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.assignments a ON a.id = s.assignment_id
      JOIN public.courses c ON c.id = a.course_id
      WHERE s.id = grades.submission_id
      AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create grades"
  ON public.grades FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.assignments a ON a.id = s.assignment_id
      JOIN public.courses c ON c.id = a.course_id
      WHERE s.id = submission_id
      AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update grades"
  ON public.grades FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.assignments a ON a.id = s.assignment_id
      JOIN public.courses c ON c.id = a.course_id
      WHERE s.id = grades.submission_id
      AND c.teacher_id = auth.uid()
    )
  );

-- Create course_materials table
CREATE TABLE public.course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view materials for enrolled courses"
  ON public.course_materials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = course_materials.course_id
      AND enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view materials for their courses"
  ON public.course_materials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_materials.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can upload materials for their courses"
  ON public.course_materials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete materials from their courses"
  ON public.course_materials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_materials.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Create discussion_posts table
CREATE TABLE public.discussion_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.discussion_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.discussion_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view discussion posts"
  ON public.discussion_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = discussion_posts.course_id
      AND enrollments.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = discussion_posts.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Enrolled users can create discussion posts"
  ON public.discussion_posts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND (
      EXISTS (
        SELECT 1 FROM public.enrollments
        WHERE enrollments.course_id = course_id
        AND enrollments.student_id = auth.uid()
      )
      OR
      EXISTS (
        SELECT 1 FROM public.courses
        WHERE courses.id = course_id
        AND courses.teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their own posts"
  ON public.discussion_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.discussion_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('assignment-submissions', 'assignment-submissions', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('course-materials', 'course-materials', true);

-- Storage policies for assignment submissions
CREATE POLICY "Students can upload their own submissions"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assignment-submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can view their own submissions"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'assignment-submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Teachers can view submissions for their courses"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'assignment-submissions' AND
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.assignments a ON a.id = s.assignment_id
      JOIN public.courses c ON c.id = a.course_id
      WHERE c.teacher_id = auth.uid()
      AND s.file_url LIKE '%' || name || '%'
    )
  );

-- Storage policies for course materials
CREATE POLICY "Course materials are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-materials');

CREATE POLICY "Teachers can upload course materials"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-materials' AND
    public.has_role(auth.uid(), 'teacher')
  );

CREATE POLICY "Teachers can update course materials"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-materials' AND
    public.has_role(auth.uid(), 'teacher')
  );

CREATE POLICY "Teachers can delete course materials"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-materials' AND
    public.has_role(auth.uid(), 'teacher')
  );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User')
  );
  RETURN new;
END;
$$;

-- Trigger to auto-create profile on user creation
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- Create indexes for better performance
CREATE INDEX idx_courses_teacher_id ON public.courses(teacher_id);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_assignments_course_id ON public.assignments(course_id);
CREATE INDEX idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX idx_grades_submission_id ON public.grades(submission_id);
CREATE INDEX idx_course_materials_course_id ON public.course_materials(course_id);
CREATE INDEX idx_discussion_posts_course_id ON public.discussion_posts(course_id);
CREATE INDEX idx_discussion_posts_parent_id ON public.discussion_posts(parent_id);
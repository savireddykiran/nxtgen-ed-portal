# Nxtgen LMS - Next Generation Learning Management System

## 🎓 Overview

Nxtgen LMS is a comprehensive, full-featured Learning Management System designed to revolutionize the educational experience for both students and teachers. Built with modern web technologies and Lovable Cloud (Supabase), it provides an intuitive platform for course management, assignments, grading, and interactive discussions.

**Live URL**: [Visit Nxtgen LMS](https://lovable.dev/projects/8d897a6e-73bd-45cd-bd98-52edf50381a5)

---

## ✨ Core Features

### 🧑‍🏫 For Teachers
- **Dashboard Overview**: View statistics for courses, assignments, and enrolled students
- **Course Management**: Create, edit, delete, and manage courses
- **Assignment Management**: Create assignments, view submissions, and grade students
- **Student Management**: View enrolled students per course
- **Material Upload**: Upload course materials (PDF, PPT, etc.)
- **Discussion Forum**: Start and participate in course discussions
- **Grade Management**: Grade assignments and track student performance

### 🧑‍🎓 For Students
- **Dashboard Overview**: View enrolled courses, submitted assignments, and average grades
- **Course Enrollment**: Browse and enroll in available courses
- **Assignment Submission**: Submit assignments with file uploads
- **Grade Tracking**: View grades and performance metrics across courses
- **Course Materials**: Access and download uploaded course materials
- **Discussion Forum**: Participate in course discussions and Q&A

### 🏠 Common Features
- **Role-Based Sidebar Navigation**: Intuitive collapsible navigation based on user role
- **Top Navigation Bar**: Quick access to discussions with user greeting
- **Real-time Updates**: Instant updates across the platform
- **Secure Authentication**: Email/password authentication with automatic profile creation
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile
- **Discussion Forum**: Course-based discussions with threaded replies

### 🎨 Design Features
- **Modern Dark Theme**: Professional dark interface with vibrant accents
- **Semantic Color System**: HSL-based design tokens for consistency
- **Smooth Animations**: Fade-in, scale, and hover effects throughout
- **Glowing Effects**: Dynamic visual feedback on interactive elements
- **Fully Responsive**: Mobile-first design that scales beautifully

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite - Lightning-fast build and HMR
- **Styling**: Tailwind CSS with semantic design tokens
- **UI Components**: Shadcn/ui - Accessible and customizable
- **Icons**: Lucide React - Beautiful icon system
- **Routing**: React Router DOM 6.x
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query for server state
- **Toasts**: Sonner for beautiful notifications
- **Date Utilities**: date-fns
- **Charts**: Recharts for data visualization

### Backend (Lovable Cloud - Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **File Storage**: Supabase Storage for assignments and materials
- **Real-time**: Supabase Realtime for live updates
- **Edge Functions**: Serverless functions (ready for AI features)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript 5.x

---

## 📁 Project Structure

```
/Nxtgen-LMS
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn UI components (sidebar, cards, buttons, etc.)
│   │   ├── AppSidebar.tsx  # Role-based sidebar navigation
│   │   ├── TopNav.tsx      # Top navigation bar with greeting
│   │   ├── Navbar.tsx      # Landing page navbar
│   │   ├── Hero.tsx        # Landing hero section
│   │   ├── About.tsx       # About section
│   │   ├── HowItWorks.tsx  # How it works section
│   │   ├── Features.tsx    # Features showcase
│   │   ├── Team.tsx        # Team section
│   │   ├── Contact.tsx     # Contact form
│   │   └── Footer.tsx      # Footer component
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Landing page
│   │   ├── Auth.tsx        # Login/Register page
│   │   ├── Dashboard.tsx   # Role-based dashboard with stats
│   │   ├── Courses.tsx     # Browse and manage courses
│   │   ├── MyCourses.tsx   # Student's enrolled courses
│   │   ├── CreateCourse.tsx # Teacher course creation
│   │   ├── CourseDetail.tsx # Course details with tabs
│   │   ├── CreateAssignment.tsx # Assignment creation
│   │   ├── AssignmentDetail.tsx # Assignment details and submission
│   │   ├── Discussions.tsx  # Discussion forum
│   │   └── NotFound.tsx    # 404 page
│   ├── integrations/       # External integrations
│   │   └── supabase/       # Supabase client & auto-generated types
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── assets/             # Images and static files
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles & design system
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database migration files
│   └── config.toml         # Supabase project configuration
├── public/                 # Public assets
├── index.html              # HTML template
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies
└── README.md               # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js**: v18.x or higher ([Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm**: v9.x or higher (comes with Node.js)

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd Nxtgen-LMS
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
The `.env` file is automatically configured with Lovable Cloud. No manual setup required!

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

---

## 🎯 Usage Guide

### Getting Started

1. **Sign Up**:
   - Click "Get Started" on the landing page
   - Choose your role (Student or Teacher)
   - Enter your email and password
   - Profile is created automatically

2. **Login**:
   - Use your email and password
   - Auto-redirected to role-based dashboard

### For Students

**Dashboard**:
- View enrolled courses count
- See submitted assignments
- Track average grade across courses

**Courses**:
- Browse available courses
- Enroll in courses
- Access course materials
- View assignments

**Assignments**:
- Submit assignments with file uploads
- View teacher feedback
- Check grades

**Discussions**:
- Participate in course discussions
- Ask questions and share insights

### For Teachers

**Dashboard**:
- View total courses created
- See total assignments
- Track enrolled students count

**Course Management**:
- Create new courses with title, description, duration
- Upload course materials (PDF, PPT, etc.)
- View enrolled students
- Manage course content

**Assignments**:
- Create assignments for specific courses
- View student submissions
- Grade submissions with feedback
- Track submission status

**Discussions**:
- Start discussion threads
- Reply to student questions
- Moderate course forums

### Navigation

- **Sidebar**: Collapsible navigation menu (role-based)
- **Top Bar**: User greeting and quick discussion access
- **Responsive**: Works on all devices

---

## 🗄️ Database Schema

The application uses PostgreSQL with the following tables:

- **profiles** - User profile information (full_name, created_at)
- **user_roles** - User role assignment (student/teacher) with enum type
- **courses** - Course information (title, description, duration, teacher_id)
- **enrollments** - Student course enrollments (student_id, course_id)
- **assignments** - Course assignments (title, description, due_date, course_id)
- **submissions** - Student assignment submissions (student_id, assignment_id, file_url, content)
- **grades** - Assignment grades (submission_id, grade, feedback, graded_by)
- **course_materials** - Uploaded materials (course_id, title, file_url, file_type)
- **discussion_posts** - Forum discussions (user_id, course_id, content, parent_id)

**Storage Buckets**:
- `assignment-submissions` (private) - Student assignment files
- `course-materials` (public) - Teacher uploaded materials

All tables have comprehensive Row Level Security (RLS) policies to ensure data security and proper access control.

## 🔄 Changing the Database

### Using Your Own Supabase Project

If you want to use your own Supabase project instead of Lovable Cloud:

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your project URL and anon key

2. **Update Environment Variables**:
   ```bash
   # Update .env file
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   ```

3. **Run Database Migrations**:
   - Copy all SQL from `supabase/migrations/` folder
   - Run them in order in your Supabase SQL editor
   - This creates all tables, RLS policies, functions, and triggers

4. **Set Up Storage Buckets**:
   ```sql
   -- Create buckets
   INSERT INTO storage.buckets (id, name, public)
   VALUES 
     ('assignment-submissions', 'assignment-submissions', false),
     ('course-materials', 'course-materials', true);
   ```

5. **Apply Storage RLS Policies**:
   - Copy storage policies from migration files
   - Apply in Supabase SQL editor

6. **Configure Authentication**:
   - Enable email authentication in Supabase dashboard
   - Configure email templates (optional)
   - Set up redirect URLs

### Using a Different Backend (Firebase, MongoDB, etc.)

To use a completely different backend:

1. **Replace Database Client**:
   - Remove `src/integrations/supabase/`
   - Create your own database client/SDK
   - Update all imports across the app

2. **Implement Database Schema**:
   - Create equivalent tables/collections
   - Implement security rules (equivalent to RLS)
   - Set up indexes for performance

3. **Replace Authentication**:
   - Update `src/pages/Auth.tsx`
   - Replace all `supabase.auth` calls
   - Implement session management

4. **Replace File Storage**:
   - Update file upload in:
     - `src/pages/CreateCourse.tsx`
     - `src/pages/AssignmentDetail.tsx`
   - Implement your storage provider

5. **Replace Real-time (Optional)**:
   - Remove Supabase real-time subscriptions
   - Implement WebSockets, polling, or your provider's solution

6. **Update All Queries**:
   - Replace all `supabase.from()` calls
   - Implement equivalent query methods
   - Handle error responses differently

## 🔮 Future Enhancements

### Planned Features
- **Attendance System**: Mark and track student attendance
- **AI Guidance**: Personalized AI assistant for students and teachers
- **Notifications**: Real-time push notifications for updates
- **Advanced Analytics**: Performance charts and insights
- **Calendar Integration**: Course schedule and deadline management
- **Quiz System**: Create and take quizzes with auto-grading
- **Video Integration**: Embed video lectures
- **Email Notifications**: Important event notifications
- **Mobile App**: Native iOS and Android apps

---

## 🎨 Design System

### Color Palette (HSL)
```css
--primary: 217 91% 60%      /* Blue */
--secondary: 142 76% 36%    /* Green */
--accent: 25 95% 53%        /* Orange */
--background: 222 47% 11%   /* Dark background */
--foreground: 210 40% 98%   /* Light text */
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800

### Effects
- **Glow Effects**: Box shadows with color opacity
- **Gradients**: Subtle gradients on cards and backgrounds
- **Animations**: Fade-in, scale-in, and custom keyframe animations

---

## 🤝 Contributing

This project is maintained by the Nxtgen LMS team. For contributions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 Development Team

- **Alex Thompson** - Full Stack Developer
  - GitHub: [github.com](https://github.com)
  - LinkedIn: [linkedin.com](https://linkedin.com)
  - Email: alex@nxtgenlms.com

- **Sarah Chen** - UI/UX Designer
  - GitHub: [github.com](https://github.com)
  - LinkedIn: [linkedin.com](https://linkedin.com)
  - Email: sarah@nxtgenlms.com

- **Michael Rodriguez** - Backend Engineer
  - GitHub: [github.com](https://github.com)
  - LinkedIn: [linkedin.com](https://linkedin.com)
  - Email: michael@nxtgenlms.com

---

## 📄 License

This project is proprietary software developed by the Nxtgen LMS team.

---

## 🚢 Deployment

### Deploy with Lovable (Recommended)

The easiest way to deploy:
1. Click the "Publish" button in Lovable editor
2. Your app is deployed automatically with backend included
3. Get a production URL instantly

### Deploy Manually

Build for production:
```bash
npm run build
```

Deploy the `dist/` folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Push `dist/` to gh-pages branch
- **Any static host**: Upload `dist/` contents

**Important**: Set environment variables in your hosting provider:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## 🐛 Troubleshooting

### Common Issues

**Build Errors**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist .vite`

**Authentication Issues**:
- Check Supabase project is active
- Verify environment variables
- Check browser console for errors

**File Upload Issues**:
- Verify storage buckets exist
- Check RLS policies on storage
- Ensure file size is within limits

**Database Issues**:
- Verify migrations ran successfully
- Check RLS policies are correct
- Ensure user has proper role assigned

---

## 📞 Support

For questions, issues, or feature requests:
- **Email**: contact@nxtgenlms.com
- **Phone**: +1 (555) 123-4567
- **Location**: San Francisco, CA 94102

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [Shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)
- Powered by [Supabase](https://supabase.com)

---

**Made with ❤️ by the Nxtgen LMS Team**

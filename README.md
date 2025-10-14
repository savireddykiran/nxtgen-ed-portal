# Nxtgen LMS - Next Generation Learning Management System

## 🎓 Overview

Nxtgen LMS is a comprehensive Learning Management System designed to revolutionize the educational experience for both students and teachers. Built with modern web technologies, it provides an intuitive platform for managing learning, attendance, and communication in a structured and interactive way.

**Live URL**: [Visit Nxtgen LMS](https://lovable.dev/projects/8d897a6e-73bd-45cd-bd98-52edf50381a5)

---

## ✨ Features (Phase 1)

### 🏠 Landing Page
- **Hero Section**: Eye-catching introduction with call-to-action buttons
- **About Section**: Platform purpose and key benefits
- **How It Works**: Step-by-step user journey explanation
- **Features Showcase**: Comprehensive feature cards with hover effects
- **Team Section**: Meet the development team
- **Contact Form**: Easy communication channel

### 🔐 Authentication System
- Email-based registration and login
- Role-based access (Student/Teacher)
- Secure password handling
- Auto-confirm email for faster testing
- Protected dashboard routes

### 🎨 Design Features
- **Full Dark Mode Theme**: Professional dark interface
- **Vibrant Color Scheme**: 
  - Blue (#3B82F6) - Primary actions
  - Green (#10B981) - Success states
  - Orange (#F97316) - Accent elements
- **Smooth Animations**: Fade-in, scale, and hover effects
- **Glowing Card Effects**: Dynamic visual feedback
- **Fully Responsive**: Mobile, tablet, and desktop optimized

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router DOM 6.x
- **Forms**: React Hook Form + Zod validation
- **Animations**: Custom Tailwind animations
- **Toasts**: Sonner

### Backend (Lovable Cloud)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (ready for Phase 2)

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
│   │   ├── ui/             # Shadcn UI components
│   │   ├── Navbar.tsx      # Navigation bar
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
│   │   ├── Dashboard.tsx   # User dashboard
│   │   └── NotFound.tsx    # 404 page
│   ├── integrations/       # External integrations
│   │   └── supabase/       # Supabase client & types
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── assets/             # Images and static files
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles & design system
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

### For Students
1. Click "Get Started" on the landing page
2. Select "Sign Up" and choose "Student" role
3. Enter your email and password
4. Access your student dashboard after login

### For Teachers
1. Click "Get Started" on the landing page
2. Select "Sign Up" and choose "Teacher" role
3. Enter your email and password
4. Access your teacher dashboard after login

### Navigation
- Use the navbar to scroll to different sections
- All sections have smooth scroll behavior
- Mobile-friendly hamburger menu for smaller screens

---

## 🔮 Future Plans (Phase 2)

### Role-Based Dashboards
- **Student Dashboard**:
  - View enrolled courses
  - Submit assignments
  - Track attendance
  - Check grades and progress
  
- **Teacher Dashboard**:
  - Create and manage courses
  - Grade assignments
  - Mark attendance
  - Communicate with students

### Additional Features
- Real-time notifications using Supabase Realtime
- File upload and management (assignments, materials)
- Email notifications for important events
- Video conferencing integration
- Advanced analytics and reporting
- Calendar integration
- Discussion forums
- Quiz and assessment tools

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

## 🐛 Known Issues

- Email verification is auto-confirmed in development mode for faster testing
- Dashboard features are placeholders pending Phase 2 implementation

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

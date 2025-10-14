import { Calendar, FileText, Video, Bell, BarChart3, Cloud } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Attendance Management",
      description: "Automated attendance tracking with real-time updates and detailed reports",
    },
    {
      icon: FileText,
      title: "Assignment Submission",
      description: "Seamless file uploads and submission tracking for all assignments",
    },
    {
      icon: Video,
      title: "Virtual Classrooms",
      description: "Integrated video conferencing for live classes and discussions",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Real-time alerts for assignments, deadlines, and important updates",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Comprehensive dashboards showing student performance and growth",
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "Secure cloud storage for all your learning materials and resources",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Powerful <span className="text-primary">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need for a complete learning management experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative gradient-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

import { BookOpen, Users, Target } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 gradient-primary opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            About <span className="text-primary">Nxtgen LMS</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Nxtgen LMS is a comprehensive Learning Management System designed to bridge the gap between
            students and teachers through innovative technology and intuitive design.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="gradient-card p-8 rounded-2xl border border-border hover:scale-105 transition-transform duration-300 animate-fade-in">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Interactive Learning</h3>
            <p className="text-muted-foreground">
              Engage with dynamic content, interactive assignments, and real-time collaboration tools
              that make learning exciting and effective.
            </p>
          </div>

          <div className="gradient-card p-8 rounded-2xl border border-border hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
              <Users className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Connected Community</h3>
            <p className="text-muted-foreground">
              Foster meaningful connections between students and teachers with seamless communication
              channels and collaborative workspaces.
            </p>
          </div>

          <div className="gradient-card p-8 rounded-2xl border border-border hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
              <Target className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-4">Goal-Oriented</h3>
            <p className="text-muted-foreground">
              Track progress, set milestones, and achieve learning objectives with our comprehensive
              analytics and performance tracking tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

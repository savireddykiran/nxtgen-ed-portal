import { Github, Linkedin, Mail } from "lucide-react";

const Team = () => {
  const team = [
    {
      name: "Alex Thompson",
      role: "Full Stack Developer",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "alex@nxtgenlms.com",
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "sarah@nxtgenlms.com",
    },
    {
      name: "Michael Rodriguez",
      role: "Backend Engineer",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "michael@nxtgenlms.com",
    },
  ];

  return (
    <section id="team" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Meet the <span className="text-primary">Team</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            The talented developers behind Nxtgen LMS
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="gradient-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary mx-auto mb-6 flex items-center justify-center text-3xl font-bold">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-primary mb-6">{member.role}</p>
                
                <div className="flex justify-center gap-4">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <Github className="h-5 w-5 text-primary" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-primary" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;

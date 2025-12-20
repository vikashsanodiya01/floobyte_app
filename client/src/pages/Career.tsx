import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  GraduationCap,
  Building2,
  ChevronRight,
  Users,
  Rocket,
  Heart,
  Coffee
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Career {
  id: number;
  title: string;
  type: string;
  department: string | null;
  location: string | null;
  experience: string | null;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
  salary: string | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function Career() {
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [applyOpen, setApplyOpen] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [candidateResumeUrl, setCandidateResumeUrl] = useState("");
  const [candidateCoverLetter, setCandidateCoverLetter] = useState("");

  const { data: careers = [], isLoading } = useQuery<Career[]>({
    queryKey: ["/api/careers"],
    queryFn: async () => {
      const res = await fetch("/api/careers");
      if (!res.ok) throw new Error("Failed to fetch careers");
      return res.json();
    },
  });

  const openCareers = careers.filter(c => c.status === "Open");
  
  const filteredCareers = filter === "all" 
    ? openCareers 
    : openCareers.filter(c => c.type.toLowerCase() === filter.toLowerCase());

  const vacancies = openCareers.filter(c => c.type === "Vacancy" || c.type === "Full-time" || c.type === "Part-time" || c.type === "Contract");
  const internships = openCareers.filter(c => c.type === "Internship");

  return (
    <>
    <Layout>
      <div className="pt-10 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Join Our <span className="text-primary">Team</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
              Build your career with Floobyte. We're looking for talented individuals who are passionate about technology and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="bg-card border-white/5 p-6 text-center">
              <Users className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </Card>
            <Card className="bg-card border-white/5 p-6 text-center">
              <Rocket className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">100+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </Card>
            <Card className="bg-card border-white/5 p-6 text-center">
              <Heart className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">Great</div>
              <div className="text-sm text-muted-foreground">Work Culture</div>
            </Card>
            <Card className="bg-card border-white/5 p-6 text-center">
              <Coffee className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">Flexible</div>
              <div className="text-sm text-muted-foreground">Work Environment</div>
            </Card>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-primary text-black" : "border-white/10 text-white hover:bg-white/10"}
              >
                All Positions ({openCareers.length})
              </Button>
              <Button 
                variant={filter === "vacancy" ? "default" : "outline"}
                onClick={() => setFilter("vacancy")}
                className={filter === "vacancy" ? "bg-primary text-black" : "border-white/10 text-white hover:bg-white/10"}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Vacancies ({vacancies.length})
              </Button>
              <Button 
                variant={filter === "internship" ? "default" : "outline"}
                onClick={() => setFilter("internship")}
                className={filter === "internship" ? "bg-primary text-black" : "border-white/10 text-white hover:bg-white/10"}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Internships ({internships.length})
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading opportunities...</p>
            </div>
          ) : filteredCareers.length === 0 ? (
            <Card className="bg-card border-white/5 p-12 text-center">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Open Positions</h3>
              <p className="text-muted-foreground mb-6">
                We don't have any open positions at the moment, but we're always looking for talented individuals.
              </p>
              <Button className="bg-primary text-black font-bold hover:bg-primary/90" onClick={() => { setSelectedCareer(null); setApplyOpen(true); }}>
                Send Your Resume
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCareers.map((career) => (
                <Card 
                  key={career.id} 
                  className="bg-card border-white/5 p-6 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => setSelectedCareer(career)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{career.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                          {career.type}
                        </Badge>
                        {career.department && (
                          <Badge variant="outline" className="border-white/20 text-muted-foreground">
                            {career.department}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {career.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{career.location}</span>
                      </div>
                    )}
                    {career.experience && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{career.experience}</span>
                      </div>
                    )}
                    {career.salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{career.salary}</span>
                      </div>
                    )}
                  </div>

                  {career.description && (
                    <div className="mt-4">
                      <div className="text-xs font-semibold text-white mb-1">Job Description</div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {career.description}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {selectedCareer && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCareer(null)}>
              <Card 
                className="bg-card border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedCareer.title}</h2>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                          {selectedCareer.type}
                        </Badge>
                        {selectedCareer.department && (
                          <Badge variant="outline" className="border-white/20 text-muted-foreground">
                            <Building2 className="w-3 h-3 mr-1" />
                            {selectedCareer.department}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedCareer(null)}
                      className="text-muted-foreground hover:text-white"
                    >
                      &times;
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    {selectedCareer.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedCareer.location}</span>
                      </div>
                    )}
                    {selectedCareer.experience && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedCareer.experience}</span>
                      </div>
                    )}
                    {selectedCareer.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{selectedCareer.salary}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {selectedCareer.description && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Job Description</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{selectedCareer.description}</p>
                    </div>
                  )}

                  {selectedCareer.responsibilities && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Responsibilities</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{selectedCareer.responsibilities}</p>
                    </div>
                  )}

                  {selectedCareer.requirements && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Requirements</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{selectedCareer.requirements}</p>
                    </div>
                  )}

                  {selectedCareer.benefits && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Benefits</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{selectedCareer.benefits}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <Button className="w-full bg-primary text-black font-bold hover:bg-primary/90" onClick={() => setApplyOpen(true)}>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="mt-20">
            <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
              Why Work With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-card border-white/5 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Growth Opportunities</h3>
                <p className="text-muted-foreground">
                  We invest in our team's professional development with training programs, mentorship, and clear career paths.
                </p>
              </Card>
              <Card className="bg-card border-white/5 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Work-Life Balance</h3>
                <p className="text-muted-foreground">
                  Flexible working hours, remote work options, and generous leave policies to help you maintain a healthy balance.
                </p>
              </Card>
              <Card className="bg-card border-white/5 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Innovative Projects</h3>
                <p className="text-muted-foreground">
                  Work on cutting-edge technologies and challenging projects with clients from around the world.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>

    {applyOpen && (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setApplyOpen(false)}>
        <Card className="bg-card border-white/10 max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">Apply for {selectedCareer ? selectedCareer.title : "General Interest"}</h3>
          </div>
          <div className="p-6 space-y-4">
            <Input placeholder="Full Name" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="bg-background/50 border-white/10" />
            <Input placeholder="Email" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} className="bg-background/50 border-white/10" />
            <Input placeholder="Phone" value={candidatePhone} onChange={(e) => setCandidatePhone(e.target.value)} className="bg-background/50 border-white/10" />
            <Input placeholder="Resume URL (Drive/Link)" value={candidateResumeUrl} onChange={(e) => setCandidateResumeUrl(e.target.value)} className="bg-background/50 border-white/10" />
            <Textarea placeholder="Cover Letter" value={candidateCoverLetter} onChange={(e) => setCandidateCoverLetter(e.target.value)} className="bg-background/50 border-white/10 min-h-[120px]" />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setApplyOpen(false)}>Cancel</Button>
              <Button className="bg-primary text-black font-bold hover:bg-primary/90" onClick={async () => {
                const payload = {
                  name: candidateName,
                  email: candidateEmail || undefined,
                  phone: candidatePhone || undefined,
                  resumeUrl: candidateResumeUrl || undefined,
                  coverLetter: candidateCoverLetter || undefined,
                  positionId: selectedCareer?.id || undefined,
                  interestArea: selectedCareer ? undefined : "General",
                  status: "New",
                };
                const res = await fetch("/api/applications", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                if (res.ok) {
                  setApplyOpen(false);
                  setCandidateName(""); setCandidateEmail(""); setCandidatePhone(""); setCandidateResumeUrl(""); setCandidateCoverLetter("");
                }
              }}>Submit Application</Button>
            </div>
          </div>
        </Card>
      </div>
    )}
    </>
  );
}

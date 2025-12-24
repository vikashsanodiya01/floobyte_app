import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  Search,
  Briefcase,
  ShieldCheck,
  Lock,
  History,
  Smartphone,
  Loader2,
  GraduationCap,
  Users,
  ChevronUp,
  ChevronDown,
  ClipboardList,
  Wrench
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocation } from "wouter";

interface Post {
  id: number;
  title: string;
  content: string | null;
  status: string | null;
  imageUrl: string | null;
  slug: string | null;
  excerpt: string | null;
  author: string | null;
  category: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface Project {
  id: number;
  title: string;
  client: string | null;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  videoUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface Message {
  id: number;
  fromName: string;
  email: string | null;
  subject: string | null;
  message: string | null;
  isRead: boolean | null;
  createdAt: string | null;
}

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

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalProjects: number;
  totalServices: number;
  totalMessages: number;
  unreadMessages: number;
  totalCareers: number;
  openCareers: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostAuthor, setNewPostAuthor] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const [newPostExcerpt, setNewPostExcerpt] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostMetaTitle, setNewPostMetaTitle] = useState("");
  const [newPostMetaDescription, setNewPostMetaDescription] = useState("");
  const [newPostMetaKeywords, setNewPostMetaKeywords] = useState("");
  const [newPostImageUrl, setNewPostImageUrl] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("");
  const [newProjectImageUrl, setNewProjectImageUrl] = useState("");
  const [projectLinkUrl, setProjectLinkUrl] = useState("");
  const [projectVideoUrl, setProjectVideoUrl] = useState("");
  const [newCareerTitle, setNewCareerTitle] = useState("");
  const [newCareerType, setNewCareerType] = useState("Vacancy");
  const [newCareerDepartment, setNewCareerDepartment] = useState("");
  const [newCareerLocation, setNewCareerLocation] = useState("");
  const [newCareerExperience, setNewCareerExperience] = useState("");
  const queryClient = useQueryClient();

  const { data: authStatus, isLoading: authLoading } = useQuery<{ isAuthenticated: boolean; user?: string }>({
    queryKey: ["/api/auth/status"],
    queryFn: async () => {
      const res = await fetch("/api/auth/status");
      if (!res.ok) throw new Error("Failed to check auth status");
      return res.json();
    },
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    enabled: !!authStatus?.isAuthenticated,
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    enabled: !!authStatus?.isAuthenticated,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!authStatus?.isAuthenticated,
  });

  const { data: careers = [], isLoading: careersLoading } = useQuery<Career[]>({
    queryKey: ["/api/careers"],
    queryFn: async () => {
      const res = await fetch("/api/careers");
      if (!res.ok) throw new Error("Failed to fetch careers");
      return res.json();
    },
    enabled: !!authStatus?.isAuthenticated,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!authStatus?.isAuthenticated,
  });

  type Review = { id: number; author: string; rating: number; text: string | null; source: string | null; createdAt: string | null };
  type Badge = { id: number; label: string; imageUrl: string; linkUrl: string | null; enabled: boolean | null; orderIndex: number | null };

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
    enabled: !!authStatus?.isAuthenticated || activeTab === "reviews",
  });

  const { data: badges = [], isLoading: badgesLoading } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges");
      if (!res.ok) throw new Error("Failed to fetch badges");
      return res.json();
    },
    enabled: !!authStatus?.isAuthenticated || activeTab === "reviews",
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: { author: string; rating: number; text?: string; source?: string }) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      resetReviewForm();
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
  });

  const createBadgeMutation = useMutation({
    mutationFn: async (data: { label: string; imageUrl: string; linkUrl?: string; enabled?: boolean; orderIndex?: number }) => {
      const res = await fetch("/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create badge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
      setNewBadgeLabel("");
      setNewBadgeImageUrl("");
      setNewBadgeLinkUrl("");
    },
  });

  const updateBadgeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Badge> }) => {
      const res = await fetch(`/api/badges/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update badge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
    },
  });

  const deleteBadgeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/badges/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete badge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
    },
  });

  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newBadgeLabel, setNewBadgeLabel] = useState("");
  const [newBadgeImageUrl, setNewBadgeImageUrl] = useState("");
  const [newBadgeLinkUrl, setNewBadgeLinkUrl] = useState("");
  
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editingBadgeId, setEditingBadgeId] = useState<number | null>(null);
  const [editingApplicationId, setEditingApplicationId] = useState<number | null>(null);

  const [newApplicationName, setNewApplicationName] = useState("");
  const [newApplicationEmail, setNewApplicationEmail] = useState("");
  const [newApplicationPhone, setNewApplicationPhone] = useState("");
  const [newApplicationStatus, setNewApplicationStatus] = useState("New");

  const resetReviewForm = () => {
    setEditingReviewId(null);
    setNewReviewAuthor("");
    setNewReviewRating(5);
    setNewReviewText("");
  };

  const resetBadgeForm = () => {
    setEditingBadgeId(null);
    setNewBadgeLabel("");
    setNewBadgeImageUrl("");
    setNewBadgeLinkUrl("");
  };

  const resetApplicationForm = () => {
    setEditingApplicationId(null);
    setNewApplicationName("");
    setNewApplicationEmail("");
    setNewApplicationPhone("");
    setNewApplicationStatus("New");
  };

  const [syncSource, setSyncSource] = useState<"google" | "trustpilot">("google");
  const [googlePlaceId, setGooglePlaceId] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [trustpilotBusinessUnitId, setTrustpilotBusinessUnitId] = useState("");
  const [trustpilotAccessToken, setTrustpilotAccessToken] = useState("");

  const syncReviewsMutation = useMutation({
    mutationFn: async () => {
      const payload = syncSource === "google"
        ? { source: "google", placeId: googlePlaceId, apiKey: googleApiKey }
        : { source: "trustpilot", businessUnitId: trustpilotBusinessUnitId, accessToken: trustpilotAccessToken };
      const res = await fetch("/api/reviews/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to sync reviews");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/login");
    },
  });

  type NewPostPayload = {
    title: string;
    content?: string;
    status?: string;
    slug?: string;
    excerpt?: string;
    author?: string;
    category?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    publishedAt?: string;
  };

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const createPostMutation = useMutation({
    mutationFn: async (data: NewPostPayload) => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      resetPostForm();
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: NewPostPayload }) => {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      resetPostForm();
    },
  });

  const resetPostForm = () => {
    setNewPostTitle("");
    setNewPostAuthor("");
    setNewPostCategory("");
    setNewPostExcerpt("");
    setNewPostContent("");
    setNewPostMetaTitle("");
    setNewPostMetaDescription("");
    setNewPostMetaKeywords("");
    setNewPostImageUrl("");
    setEditingPostId(null);
  };

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  type ProjectPayload = {
    title: string;
    client?: string;
    category?: string;
    imageUrl?: string;
    linkUrl?: string;
    videoUrl?: string;
  };

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectPayload) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      resetProjectForm();
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProjectPayload }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      resetProjectForm();
    },
  });

  const resetProjectForm = () => {
    setNewProjectTitle("");
    setNewProjectClient("");
    setNewProjectCategory("");
    setNewProjectImageUrl("");
    setProjectLinkUrl("");
    setProjectVideoUrl("");
    setEditingProjectId(null);
  };

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  const createCareerMutation = useMutation({
    mutationFn: async (data: { title: string; type: string; department?: string; location?: string; experience?: string }) => {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create career");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/careers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setNewCareerTitle("");
      setNewCareerType("Vacancy");
      setNewCareerDepartment("");
      setNewCareerLocation("");
      setNewCareerExperience("");
    },
  });

  const deleteCareerMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete career");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/careers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  type Service = {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    icon: string | null;
    imageUrl: string | null;
    status: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };

  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceImageUrl, setNewServiceImageUrl] = useState("");
  const [newServiceVideoUrl, setNewServiceVideoUrl] = useState("");

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
    enabled: !!authStatus?.isAuthenticated || activeTab === "services",
  });

  type Application = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    resumeUrl: string | null;
    coverLetter: string | null;
    positionId: number | null;
    interestArea: string | null;
    status: string | null;
    createdAt: string | null;
  };

  const { data: applications = [], isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
    enabled: !!authStatus?.isAuthenticated || activeTab === "applications",
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete application");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: { title: string; category?: string; description?: string; imageUrl?: string }) => {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      resetServiceForm();
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
  });

  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editingCareerId, setEditingCareerId] = useState<number | null>(null);

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; category?: string; description?: string; imageUrl?: string } }) => {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      resetServiceForm();
    },
  });

  const updateCareerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; type: string; department?: string; location?: string; experience?: string } }) => {
      const res = await fetch(`/api/careers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update career");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/careers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      resetCareerForm();
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { author: string; rating: number; text?: string; source?: string } }) => {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      resetReviewForm();
    },
  });

  const resetServiceForm = () => {
    setNewServiceTitle("");
    setNewServiceCategory("");
    setNewServiceDescription("");
    setNewServiceImageUrl("");
    setEditingServiceId(null);
  };

  const resetCareerForm = () => {
    setNewCareerTitle("");
    setNewCareerType("Vacancy");
    setNewCareerDepartment("");
    setNewCareerLocation("");
    setNewCareerExperience("");
    setEditingCareerId(null);
  };

  useEffect(() => {
    if (!authLoading && !authStatus?.isAuthenticated) {
      setLocation("/login");
    }
  }, [authStatus, authLoading, setLocation]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "yyyy-MM-dd");
    } catch {
      return "N/A";
    }
  };

  const getRelativeDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      return `${diffDays} days ago`;
    } catch {
      return "N/A";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authStatus?.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-white/5 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <span className="font-display font-bold text-2xl tracking-tight text-white">
            Floobyte<span className="text-primary">.</span>
            <span className="text-xs text-muted-foreground block mt-1 font-sans font-normal">Admin Panel</span>
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant={activeTab === "dashboard" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant={activeTab === "posts" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("posts")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Blog Posts
          </Button>
          <Button 
            variant={activeTab === "portfolio" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("portfolio")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Portfolio
          </Button>
          <Button 
            variant={activeTab === "services" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("services")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Services
          </Button>
          <Button 
            variant={activeTab === "applications" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("applications")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Applications
          </Button>
          <Button 
            variant={activeTab === "messages" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button 
            variant={activeTab === "careers" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("careers")}
          >
            <Users className="mr-2 h-4 w-4" />
            Careers
          </Button>
          <Button 
            variant={activeTab === "reviews" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("reviews")}
          >
            <Search className="mr-2 h-4 w-4" />
            Reviews & Badges
          </Button>
          <Button 
            variant={activeTab === "leads" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("leads")}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Leads
          </Button>
          <Button 
            variant={activeTab === "tools" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("tools")}
          >
            <Wrench className="mr-2 h-4 w-4" />
            Tools
          </Button>
          <Button 
            variant={activeTab === "security" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("security")}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Security
          </Button>
          <Button 
            variant={activeTab === "settings" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <h1 className="text-3xl font-display font-bold text-white">Dashboard Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border-white/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-white">{stats?.totalPosts || 0}</div>
                        <p className="text-xs text-primary mt-1">{stats?.publishedPosts || 0} published, {stats?.draftPosts || 0} drafts</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-white">{stats?.totalProjects || 0}</div>
                        <p className="text-xs text-primary mt-1">Portfolio items</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">New Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-white">{stats?.totalMessages || 0}</div>
                        <p className="text-xs text-primary mt-1">{stats?.unreadMessages || 0} unread</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-card border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {messagesLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : messages.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No messages yet</p>
                    ) : (
                      <div className="space-y-4">
                        {messages.slice(0, 5).map(msg => (
                          <div key={msg.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                            <div>
                              <div className="font-medium text-white">{msg.fromName}</div>
                              <div className="text-sm text-muted-foreground">{msg.subject || "No subject"}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">{getRelativeDate(msg.createdAt)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        className="w-full justify-start bg-primary/10 text-primary hover:bg-primary hover:text-black"
                        onClick={() => setActiveTab("posts")}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Create New Blog Post
                      </Button>
                      <Button 
                        className="w-full justify-start bg-white/5 text-white hover:bg-white/10"
                        onClick={() => setActiveTab("portfolio")}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Update Portfolio
                      </Button>
                      <Button 
                        className="w-full justify-start bg-white/5 text-white hover:bg-white/10"
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" /> Edit Site Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-white">Blog Posts</h1>
              </div>

              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">{editingPostId ? "Edit Post" : "Create New Post"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Post title..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Author..."
                      value={newPostAuthor}
                      onChange={(e) => setNewPostAuthor(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Category..."
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Excerpt..."
                      value={newPostExcerpt}
                      onChange={(e) => setNewPostExcerpt(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <textarea
                      placeholder="Content..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="bg-background/50 border-white/10 rounded-md p-2 text-white min-h-32"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      placeholder="Meta title..."
                      value={newPostMetaTitle}
                      onChange={(e) => setNewPostMetaTitle(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Meta description..."
                      value={newPostMetaDescription}
                      onChange={(e) => setNewPostMetaDescription(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Meta keywords (comma separated)..."
                      value={newPostMetaKeywords}
                      onChange={(e) => setNewPostMetaKeywords(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Image URL (optional)"
                      value={newPostImageUrl}
                      onChange={(e) => setNewPostImageUrl(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      className="bg-primary text-black font-bold hover:bg-primary/90"
                      onClick={() => {
                        const status = "Draft"; // You might want to allow status editing too
                        const payload = {
                          title: newPostTitle,
                          author: newPostAuthor || undefined,
                          category: newPostCategory || undefined,
                          excerpt: newPostExcerpt || undefined,
                          content: newPostContent || undefined,
                          imageUrl: newPostImageUrl || undefined,
                          metaTitle: newPostMetaTitle || undefined,
                          metaDescription: newPostMetaDescription || undefined,
                          metaKeywords: newPostMetaKeywords || undefined,
                          status,
                          slug: newPostTitle
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .trim()
                            .replace(/\s+/g, "-") || undefined,
                          publishedAt: undefined,
                        };
                        
                        if (editingPostId) {
                          updatePostMutation.mutate({ id: editingPostId, data: payload });
                        } else {
                          createPostMutation.mutate(payload);
                        }
                      }}
                      disabled={!newPostTitle.trim() || createPostMutation.isPending || updatePostMutation.isPending}
                    >
                      {(createPostMutation.isPending || updatePostMutation.isPending) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        editingPostId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />
                      )}
                      <span className="ml-2">{editingPostId ? "Update Post" : "Create Post"}</span>
                    </Button>
                    
                    {editingPostId && (
                      <Button
                        variant="outline"
                        onClick={resetPostForm}
                        disabled={updatePostMutation.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-white/5">
                <CardContent className="p-0">
                  {postsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : posts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No posts yet. Create your first post above!</p>
                  ) : (
                    <div className="rounded-md border border-white/5">
                      <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 font-medium text-white text-sm">
                        <div className="col-span-6">Title</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      {posts.map((post) => (
                        <div key={post.id} className="grid grid-cols-12 gap-4 p-4 border-t border-white/5 items-center text-sm">
                          <div className="col-span-6 font-medium text-white">{post.title}</div>
                          <div className="col-span-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              post.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {post.status || "Draft"}
                            </span>
                          </div>
                          <div className="col-span-2 text-muted-foreground">{formatDate(post.createdAt)}</div>
                          <div className="col-span-2 flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingPostId(post.id);
                                setNewPostTitle(post.title);
                                setNewPostAuthor(post.author || "");
                                setNewPostCategory(post.category || "");
                                setNewPostExcerpt(post.excerpt || "");
                                setNewPostContent(post.content || "");
                                setNewPostMetaTitle(post.metaTitle || "");
                                setNewPostMetaDescription(post.metaDescription || "");
                                setNewPostMetaKeywords(post.metaKeywords || "");
                                setNewPostImageUrl(post.imageUrl || "");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deletePostMutation.mutate(post.id)}
                              disabled={deletePostMutation.isPending}
                            >
                              {deletePostMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "leads" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-white">Leads (Quote Submissions)</h1>
              </div>

              <LeadsManager />
            </div>
          )}

        {activeTab === "portfolio" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-white">Portfolio Projects</h1>
              </div>

              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">{editingProjectId ? "Edit Project" : "Add New Project"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      placeholder="Project title..."
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Client name..."
                      value={newProjectClient}
                      onChange={(e) => setNewProjectClient(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Category..."
                      value={newProjectCategory}
                      onChange={(e) => setNewProjectCategory(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Image URL (optional)"
                      value={newProjectImageUrl}
                      onChange={(e) => setNewProjectImageUrl(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="External Link (optional)"
                      onChange={(e) => setNewProjectClient((prev) => prev)}
                      className="hidden"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Project external link URL"
                      value={projectLinkUrl}
                      onChange={(e) => setProjectLinkUrl(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Project video (YouTube embed URL)"
                      value={projectVideoUrl}
                      onChange={(e) => setProjectVideoUrl(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      className="bg-primary text-black font-bold hover:bg-primary/90"
                      onClick={() => {
                        const payload = { 
                          title: newProjectTitle, 
                          client: newProjectClient || undefined,
                          category: newProjectCategory || undefined,
                          imageUrl: newProjectImageUrl || undefined,
                          linkUrl: projectLinkUrl || undefined,
                          videoUrl: projectVideoUrl || undefined,
                        };
                        
                        if (editingProjectId) {
                          updateProjectMutation.mutate({ id: editingProjectId, data: payload });
                        } else {
                          createProjectMutation.mutate(payload);
                        }
                      }}
                      disabled={!newProjectTitle.trim() || createProjectMutation.isPending || updateProjectMutation.isPending}
                    >
                      {(createProjectMutation.isPending || updateProjectMutation.isPending) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        editingProjectId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />
                      )}
                      <span className="ml-2">{editingProjectId ? "Update Project" : "Add Project"}</span>
                    </Button>

                    {editingProjectId && (
                      <Button
                        variant="outline"
                        onClick={resetProjectForm}
                        disabled={updateProjectMutation.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-white/5">
                <CardContent className="p-0">
                  {projectsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : projects.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No projects yet. Add your first project above!</p>
                  ) : (
                    <div className="rounded-md border border-white/5">
                      <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 font-medium text-white text-sm">
                        <div className="col-span-5">Project Name</div>
                        <div className="col-span-3">Client</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      {projects.map((project) => (
                        <div key={project.id} className="grid grid-cols-12 gap-4 p-4 border-t border-white/5 items-center text-sm">
                          <div className="col-span-5 font-medium text-white">{project.title}</div>
                          <div className="col-span-3 text-muted-foreground">{project.client || "N/A"}</div>
                          <div className="col-span-2">
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                              {project.category || "Uncategorized"}
                            </span>
                          </div>
                          <div className="col-span-2 flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingProjectId(project.id);
                                setNewProjectTitle(project.title);
                                setNewProjectClient(project.client || "");
                                setNewProjectCategory(project.category || "");
                                setNewProjectImageUrl(project.imageUrl || "");
                                setProjectLinkUrl(project.linkUrl || "");
                                setProjectVideoUrl(project.videoUrl || "");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteProjectMutation.mutate(project.id)}
                              disabled={deleteProjectMutation.isPending}
                            >
                              {deleteProjectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-white">Services</h1>
              </div>

              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">{editingServiceId ? "Edit Service" : "Add New Service"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      placeholder="Service title..."
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Category..."
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Short description..."
                      value={newServiceDescription}
                      onChange={(e) => setNewServiceDescription(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Service Image URL (optional)"
                      value={newServiceImageUrl}
                      onChange={(e) => setNewServiceImageUrl(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Service video (YouTube embed URL)"
                      value={newServiceVideoUrl}
                      onChange={(e) => setNewServiceVideoUrl(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      className="bg-primary text-black font-bold hover:bg-primary/90"
                      onClick={() => {
                        const payload = {
                          title: newServiceTitle, 
                          category: newServiceCategory || undefined,
                          description: newServiceDescription || undefined,
                          imageUrl: newServiceImageUrl || undefined,
                          videoUrl: newServiceVideoUrl || undefined,
                        };

                        if (editingServiceId) {
                          updateServiceMutation.mutate({ id: editingServiceId, data: payload });
                        } else {
                          createServiceMutation.mutate(payload as any);
                        }
                      }}
                      disabled={!newServiceTitle.trim() || createServiceMutation.isPending || updateServiceMutation.isPending}
                    >
                      {(createServiceMutation.isPending || updateServiceMutation.isPending) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        editingServiceId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />
                      )}
                      <span className="ml-2">{editingServiceId ? "Update Service" : "Add Service"}</span>
                    </Button>
                    {editingServiceId && (
                      <Button
                        variant="outline"
                        onClick={resetServiceForm}
                        disabled={updateServiceMutation.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-white/5">
                <CardContent className="p-0">
                  {servicesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : services.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No services yet. Add your first service above!</p>
                  ) : (
                    <div className="rounded-md border border-white/5">
                      <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 font-medium text-white text-sm">
                        <div className="col-span-6">Title</div>
                        <div className="col-span-4">Category</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      {services.map((svc) => (
                        <div key={svc.id} className="grid grid-cols-12 gap-4 p-4 border-t border-white/5 items-center text-sm">
                          <div className="col-span-6 font-medium text-white">{svc.title}</div>
                          <div className="col-span-4 text-muted-foreground">{svc.category || "N/A"}</div>
                          <div className="col-span-2 flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingCareerId(career.id);
                                setNewCareerTitle(career.title);
                                setNewCareerType(career.type);
                                setNewCareerDepartment(career.department || "");
                                setNewCareerLocation(career.location || "");
                                setNewCareerExperience(career.experience || "");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteServiceMutation.mutate(svc.id)}
                              disabled={deleteServiceMutation.isPending}
                            >
                              {deleteServiceMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        {activeTab === "applications" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-white">Applications</h1>
              </div>
              <Card className="bg-card border-white/5">
                <CardContent className="p-0">
                  {applicationsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : applications.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No applications yet.</p>
                  ) : (
                    <div className="rounded-md border border-white/5">
                      <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 font-medium text-white text-sm">
                        <div className="col-span-3">Name</div>
                        <div className="col-span-2">Email</div>
                        <div className="col-span-2">Phone</div>
                        <div className="col-span-2">Position</div>
                        <div className="col-span-2">Resume</div>
                        <div className="col-span-1 text-right">Actions</div>
                      </div>
                      {applications.map((a) => (
                        <div key={a.id} className="grid grid-cols-12 gap-4 p-4 border-t border-white/5 items-center text-sm">
                          <div className="col-span-3 font-medium text-white">
                            {a.name}
                            <div className="text-xs text-muted-foreground mt-1">{a.status || "New"}</div>
                          </div>
                          <div className="col-span-3 text-muted-foreground">{a.email || "-"}</div>
                          <div className="col-span-2 text-muted-foreground">{a.phone || "-"}</div>
                          <div className="col-span-2 text-muted-foreground">{a.positionId || a.interestArea || "-"}</div>
                          <div className="col-span-2 text-muted-foreground">
                            {a.resumeUrl ? (
                              <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open</a>
                            ) : (
                              "-"
                            )}
                          </div>
                          <div className="col-span-1 flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingApplicationId(a.id);
                                setNewApplicationName(a.name);
                                setNewApplicationEmail(a.email || "");
                                setNewApplicationPhone(a.phone || "");
                                setNewApplicationStatus(a.status || "New");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteApplicationMutation.mutate(a.id)}
                              disabled={deleteApplicationMutation.isPending}
                            >
                              {deleteApplicationMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              <h1 className="text-3xl font-display font-bold text-white">Site Settings</h1>
              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Legal Pages Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingTextArea settingKey="privacyPolicy" label="Privacy Policy" />
                  <SettingTextArea settingKey="terms" label="Terms & Conditions" />
                  <SettingTextArea settingKey="returnPolicy" label="Return Policy" />
                  <SettingTextArea settingKey="disclaimer" label="Disclaimer" />
                  <SettingTextArea settingKey="paymentPolicy" label="Payment Policy (Razorpay)" />
                </CardContent>
              </Card>

              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Home Section Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <SettingInput settingKey="home.heroTitle" label="Hero Title" />
                  <SettingInput settingKey="home.heroSubtitle" label="Hero Subtitle" />
                  <SettingInput settingKey="home.ctaText" label="CTA Button Text" />
                </CardContent>
              </Card>

              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Our Stats (Dynamic)</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatsEditor />
                </CardContent>
              </Card>

              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ContactInfoEditor />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "tools" && (
            <div className="space-y-8">
              <h1 className="text-3xl font-display font-bold text-white">Tools</h1>
              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Footer Tools Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <SettingInput settingKey="tools.heading" label="Tools Section Heading" />
                  <SettingInput settingKey="tools.url" label="Tools Link URL" />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-8">
              <h1 className="text-3xl font-display font-bold text-white">Messages</h1>
              
              <Card className="bg-card border-white/5">
                <CardContent className="p-0">
                  {messagesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No messages yet.</p>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {messages.map((msg) => (
                        <div key={msg.id} className="p-4 hover:bg-white/5">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">{msg.fromName}</span>
                                {!msg.isRead && (
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary text-black">New</span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">{msg.email}</div>
                              <div className="text-white mt-2">{msg.subject || "No subject"}</div>
                              <div className="text-sm text-muted-foreground mt-1">{msg.message}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{getRelativeDate(msg.createdAt)}</span>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => deleteMessageMutation.mutate(msg.id)}
                                disabled={deleteMessageMutation.isPending}
                              >
                                {deleteMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "careers" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-white">Careers Management</h1>
              </div>

              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Add New Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <Input
                      placeholder="Job title..."
                      value={newCareerTitle}
                      onChange={(e) => setNewCareerTitle(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <select
                      value={newCareerType}
                      onChange={(e) => setNewCareerType(e.target.value)}
                      className="bg-background/50 border border-white/10 rounded-md px-3 py-2 text-white"
                    >
                      <option value="Vacancy">Vacancy</option>
                      <option value="Internship">Internship</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                    <Input
                      placeholder="Department..."
                      value={newCareerDepartment}
                      onChange={(e) => setNewCareerDepartment(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Location..."
                      value={newCareerLocation}
                      onChange={(e) => setNewCareerLocation(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Input
                      placeholder="Experience required..."
                      value={newCareerExperience}
                      onChange={(e) => setNewCareerExperience(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <Button 
                    className="bg-primary text-black font-bold hover:bg-primary/90"
                    onClick={() => createCareerMutation.mutate({ 
                      title: newCareerTitle, 
                      type: newCareerType,
                      department: newCareerDepartment,
                      location: newCareerLocation,
                      experience: newCareerExperience
                    })}
                    disabled={!newCareerTitle.trim() || createCareerMutation.isPending}
                  >
                    {createCareerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    <span className="ml-2">Add Position</span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-white/5">
                <CardContent className="p-0">
                  {careersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : careers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No career positions yet. Add your first position above!</p>
                  ) : (
                    <div className="rounded-md border border-white/5">
                      <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 font-medium text-white text-sm">
                        <div className="col-span-3">Position</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Department</div>
                        <div className="col-span-2">Location</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      {careers.map((career) => (
                        <div key={career.id} className="grid grid-cols-12 gap-4 p-4 border-t border-white/5 items-center text-sm">
                          <div className="col-span-3 font-medium text-white">{career.title}</div>
                          <div className="col-span-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              career.type === 'Internship' ? 'bg-blue-500/20 text-blue-400' : 'bg-primary/20 text-primary'
                            }`}>
                              {career.type}
                            </span>
                          </div>
                          <div className="col-span-2 text-muted-foreground">{career.department || "N/A"}</div>
                          <div className="col-span-2 text-muted-foreground">{career.location || "N/A"}</div>
                          <div className="col-span-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              career.status === 'Open' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {career.status || "Open"}
                            </span>
                          </div>
                          <div className="col-span-2 flex justify-end gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteCareerMutation.mutate(career.id)}
                              disabled={deleteCareerMutation.isPending}
                            >
                              {deleteCareerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <h1 className="text-3xl font-display font-bold text-white">Security Settings</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-card border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium text-white">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                      </div>
                      <SwitchComponent checked={true} />
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <h4 className="text-sm font-medium text-white mb-3">Change Password</h4>
                      <div className="space-y-3">
                        <Input type="password" placeholder="Current Password" className="bg-background/50 border-white/10" />
                        <Input type="password" placeholder="New Password" className="bg-background/50 border-white/10" />
                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">Update Password</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <History className="h-5 w-5 text-primary" />
                      Recent Login Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { device: "Chrome on Windows", location: "Indore, India", time: "Just now", status: "Active" },
                        { device: "Safari on iPhone", location: "Indore, India", time: "2 hours ago", status: "Logged out" },
                        { device: "Firefox on Mac", location: "Mumbai, India", time: "Yesterday", status: "Logged out" },
                      ].map((login, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-full">
                              <Smartphone className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium text-white">{login.device}</div>
                              <div className="text-xs text-muted-foreground">{login.location} • {login.time}</div>
                            </div>
                          </div>
                          {login.status === "Active" && (
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                              Active
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <Button variant="destructive" className="w-full bg-destructive/20 text-destructive hover:bg-destructive/30 border-none">
                        Log Out All Other Devices
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              <h1 className="text-3xl font-display font-bold text-white">Reviews & Badges</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-card border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white/5 rounded border border-white/10 space-y-3">
                      <div className="font-bold text-white">Sync External Reviews</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label className="text-white">Source</Label>
                          <select
                            value={syncSource}
                            onChange={(e) => setSyncSource(e.target.value as any)}
                            className="bg-background/50 border-white/10 rounded-md p-2 text-white"
                          >
                            <option value="google">Google Reviews</option>
                            <option value="trustpilot">Trustpilot</option>
                          </select>
                        </div>
                        {syncSource === "google" ? (
                          <>
                            <Input
                              placeholder="Google Place ID"
                              value={googlePlaceId}
                              onChange={(e) => setGooglePlaceId(e.target.value)}
                              className="bg-background/50 border-white/10"
                            />
                            <Input
                              placeholder="Google API Key"
                              value={googleApiKey}
                              onChange={(e) => setGoogleApiKey(e.target.value)}
                              className="bg-background/50 border-white/10"
                            />
                          </>
                        ) : (
                          <>
                            <Input
                              placeholder="Trustpilot Business Unit ID"
                              value={trustpilotBusinessUnitId}
                              onChange={(e) => setTrustpilotBusinessUnitId(e.target.value)}
                              className="bg-background/50 border-white/10"
                            />
                            <Input
                              placeholder="Trustpilot Access Token"
                              value={trustpilotAccessToken}
                              onChange={(e) => setTrustpilotAccessToken(e.target.value)}
                              className="bg-background/50 border-white/10"
                            />
                          </>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="border-white/10 text-white"
                          onClick={() => syncReviewsMutation.mutate()}
                          disabled={syncReviewsMutation.isPending}
                        >
                          {syncReviewsMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                          <span className="ml-2">Sync Now</span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/10">
                      <div>
                        <div className="font-bold text-white">Average Rating</div>
                        <div className="text-2xl font-bold text-primary">
                          {reviews.length ? (Math.round((reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length) * 10) / 10).toFixed(1) : "0.0"} ★
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Reviewer name"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        className="bg-background/50 border-white/10"
                      />
                      <Input
                        placeholder="Rating (1-5)"
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="bg-background/50 border-white/10"
                        type="number"
                        min={1}
                        max={5}
                      />
                    </div>
                    <textarea
                      placeholder="Review text..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="bg-background/50 border-white/10 rounded-md p-2 text-white min-h-24"
                    />
                    <div className="flex gap-3">
                      <Button
                        className="bg-primary text-black font-bold"
                        onClick={() => {
                          if (editingReviewId) {
                            updateReviewMutation.mutate({
                              id: editingReviewId,
                              data: { author: newReviewAuthor, rating: newReviewRating, text: newReviewText || undefined }
                            });
                          } else {
                            createReviewMutation.mutate({ author: newReviewAuthor, rating: newReviewRating, text: newReviewText || undefined });
                          }
                        }}
                        disabled={!newReviewAuthor.trim() || newReviewRating < 1 || newReviewRating > 5 || createReviewMutation.isPending || updateReviewMutation.isPending}
                      >
                        {(createReviewMutation.isPending || updateReviewMutation.isPending) ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingReviewId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />)}
                        <span className="ml-2">{editingReviewId ? "Update Review" : "Add Review"}</span>
                      </Button>
                      {editingReviewId && (
                        <Button variant="outline" onClick={resetReviewForm} disabled={updateReviewMutation.isPending}>
                          Cancel
                        </Button>
                      )}
                    </div>

                    {reviewsLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : reviews.length === 0 ? (
                      <p className="text-muted-foreground">No reviews yet.</p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {reviews.map((r) => (
                          <div key={r.id} className="py-3 flex items-start justify-between">
                            <div>
                              <div className="text-white font-medium">{r.author} • <span className="text-primary font-bold">{r.rating}★</span> <span className="text-xs text-muted-foreground">({r.source || "Internal"})</span></div>
                              <div className="text-sm text-muted-foreground mt-1">{r.text}</div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteReviewMutation.mutate(r.id)}>
                              {deleteReviewMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Certifications & Badges</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Badge label"
                        value={newBadgeLabel}
                        onChange={(e) => setNewBadgeLabel(e.target.value)}
                        className="bg-background/50 border-white/10"
                      />
                      <Input
                        placeholder="Badge image URL"
                        value={newBadgeImageUrl}
                        onChange={(e) => setNewBadgeImageUrl(e.target.value)}
                        className="bg-background/50 border-white/10"
                      />
                    </div>
                    <Input
                      placeholder="Badge link URL (optional)"
                      value={newBadgeLinkUrl}
                      onChange={(e) => setNewBadgeLinkUrl(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                    <Button
                      className="bg-primary text-black font-bold"
                      onClick={() => createBadgeMutation.mutate({ label: newBadgeLabel, imageUrl: newBadgeImageUrl, linkUrl: newBadgeLinkUrl || undefined })}
                      disabled={!newBadgeLabel.trim() || !newBadgeImageUrl.trim() || createBadgeMutation.isPending}
                    >
                      {createBadgeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      <span className="ml-2">Add Badge</span>
                    </Button>

                    {badgesLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : badges.length === 0 ? (
                      <p className="text-muted-foreground">No badges yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {badges.map((b) => (
                          <div key={b.id} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                            <div className="flex items-center gap-3">
                              <img src={b.imageUrl} alt={b.label} className="h-8 w-8 object-contain rounded" />
                              <span className="text-white font-medium">{b.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                                setEditingBadgeId(b.id);
                                setNewBadgeLabel(b.label);
                                setNewBadgeImageUrl(b.imageUrl);
                                setNewBadgeLinkUrl(b.linkUrl || "");
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateBadgeMutation.mutate({ id: b.id, data: { orderIndex: (b.orderIndex ?? 0) - 1 } })}>
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateBadgeMutation.mutate({ id: b.id, data: { orderIndex: (b.orderIndex ?? badges.length) + 1 } })}>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <button onClick={() => updateBadgeMutation.mutate({ id: b.id, data: { enabled: !(b.enabled ?? true) } })}>
                                <SwitchComponent checked={!!b.enabled} />
                              </button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteBadgeMutation.mutate(b.id)}>
                                {deleteBadgeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
              
              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Site Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Site Name</Label>
                    <Input defaultValue="Floobyte" className="bg-background/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Contact Email</Label>
                    <Input defaultValue="contact@floobyte.com" className="bg-background/50 border-white/10" />
                  </div>
                  <Button className="bg-primary text-black font-bold hover:bg-primary/90">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

type Lead = {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  services: string | null;
  budget: string | null;
  details: string | null;
  source: string | null;
  status: string | null;
  createdAt: string | null;
};

function LeadsManager() {
  const queryClient = useQueryClient();
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Lead> }) => {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update lead");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete lead");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "yyyy-MM-dd");
    } catch {
      return "N/A";
    }
  };

  return (
    <Card className="bg-card border-white/5">
      <CardHeader>
        <CardTitle className="text-white">All Leads</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : leads.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No leads yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-white/10">
                  <th className="text-left py-2 pr-4">Date</th>
                  <th className="text-left py-2 pr-4">Name</th>
                  <th className="text-left py-2 pr-4">Email</th>
                  <th className="text-left py-2 pr-4">Phone</th>
                  <th className="text-left py-2 pr-4">Services</th>
                  <th className="text-left py-2 pr-4">Budget</th>
                  <th className="text-left py-2 pr-4">Status</th>
                  <th className="text-left py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => {
                  const servicesList = (() => { try { return l.services ? JSON.parse(l.services) : []; } catch { return []; } })();
                  return (
                    <tr key={l.id} className="border-b border-white/5">
                      <td className="py-2 pr-4 text-muted-foreground">{formatDate(l.createdAt)}</td>
                      <td className="py-2 pr-4 text-white">{l.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{l.email}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{l.phone || "-"}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{servicesList.join(", ")}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{l.budget || "-"}</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={l.status === "Interested" ? "secondary" : "outline"}
                            className="text-xs h-7"
                            onClick={() => updateLeadMutation.mutate({ id: l.id, data: { status: "Interested" } })}
                          >Interested</Button>
                          <Button
                            variant={l.status === "New" ? "secondary" : "outline"}
                            className="text-xs h-7"
                            onClick={() => updateLeadMutation.mutate({ id: l.id, data: { status: "New" } })}
                          >New</Button>
                          <Button
                            variant={l.status === "Not Interested" ? "secondary" : "outline"}
                            className="text-xs h-7"
                            onClick={() => updateLeadMutation.mutate({ id: l.id, data: { status: "Not Interested" } })}
                          >Not Interested</Button>
                        </div>
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="text-xs h-7"
                            onClick={() => updateLeadMutation.mutate({ id: l.id, data: { status: "Interested" } })}
                          >Mark Interested</Button>
                          <Button
                            variant="ghost"
                            className="text-xs h-7 text-destructive"
                            onClick={() => deleteLeadMutation.mutate(l.id)}
                          ><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SwitchComponent({ checked }: { checked: boolean }) {
  return (
    <div className={`w-10 h-6 rounded-full relative transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'left-5' : 'left-1'}`} />
    </div>
  );
}

function ContactInfoEditor() {
  const { data } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/contactInfo"],
    queryFn: async () => {
      const res = await fetch("/api/settings/contactInfo");
      if (!res.ok) throw new Error("Failed to fetch contact info");
      return res.json();
    },
  });

  const parsed = (() => { try { return data?.value ? JSON.parse(data.value) : {}; } catch { return {}; } })();
  const [email, setEmail] = useState<string>(parsed.email || "contact@floobyte.com");
  const [phone, setPhone] = useState<string>(parsed.phone || "+91 123 456 7890");
  const [altPhone, setAltPhone] = useState<string>(parsed.altPhone || "+91 987 654 3210");
  const [address, setAddress] = useState<string>(parsed.address || "Indore, Madhya Pradesh, India");

  return (
    <div className="space-y-3">
      <Input placeholder="Primary Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background/50 border-white/10" />
      <Input placeholder="Primary Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-background/50 border-white/10" />
      <Input placeholder="Alternate Phone" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} className="bg-background/50 border-white/10" />
      <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-background/50 border-white/10 rounded-md p-2 text-white min-h-24" />
      <Button
        className="bg-primary text-black font-bold"
        onClick={async () => {
          const value = JSON.stringify({ email, phone, altPhone, address });
          await fetch("/api/settings/contactInfo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value }) });
        }}
      >
        Save Contact Info
      </Button>
    </div>
  );
}

function SettingInput({ settingKey, label }: { settingKey: string; label: string }) {
  const { data } = useQuery<{ key: string; value: string | null}>({
    queryKey: [`/api/settings/${settingKey}`],
    queryFn: async () => {
      const res = await fetch(`/api/settings/${settingKey}`);
      if (!res.ok) throw new Error("Failed to fetch setting");
      return res.json();
    },
  });
  const [value, setValue] = useState<string>(data?.value || "");
  useEffect(() => { setValue(data?.value || ""); }, [data?.value]);
  return (
    <div className="space-y-2">
      <Label className="text-white">{label}</Label>
      <Input
        placeholder={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-background/50 border-white/10"
        onBlur={async () => {
          await fetch(`/api/settings/${settingKey}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
          });
        }}
      />
    </div>
  );
}

function SettingTextArea({ settingKey, label }: { settingKey: string; label: string }) {
  const { data } = useQuery<{ key: string; value: string | null}>({
    queryKey: [`/api/settings/${settingKey}`],
    queryFn: async () => {
      const res = await fetch(`/api/settings/${settingKey}`);
      if (!res.ok) throw new Error("Failed to fetch setting");
      return res.json();
    },
  });
  const [value, setValue] = useState<string>(data?.value || "");
  useEffect(() => { setValue(data?.value || ""); }, [data?.value]);
  return (
    <div className="space-y-2">
      <Label className="text-white">{label}</Label>
      <textarea
        placeholder={`Write ${label.toLowerCase()}...`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-background/50 border-white/10 rounded-md p-2 text-white min-h-32 w-full"
        onBlur={async () => {
          await fetch(`/api/settings/${settingKey}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
          });
        }}
      />
    </div>
  );
}

function StatsEditor() {
  type StatItem = { label: string; value: number };
  const { data } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/home.stats"],
    queryFn: async () => {
      const res = await fetch("/api/settings/home.stats");
      if (!res.ok) throw new Error("Failed to fetch stats setting");
      return res.json();
    },
  });
  const parsed: StatItem[] = (() => { try { return data?.value ? JSON.parse(data.value) : []; } catch { return []; } })();
  const [items, setItems] = useState<StatItem[]>(parsed);
  useEffect(() => { setItems(parsed); }, [data?.value]);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState<string>("");

  const save = async (next: StatItem[]) => {
    await fetch("/api/settings/home.stats", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: JSON.stringify(next) }) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input placeholder="Heading" value={label} onChange={(e) => setLabel(e.target.value)} className="bg-background/50 border-white/10" />
        <Input placeholder="Number" value={value} onChange={(e) => setValue(e.target.value)} className="bg-background/50 border-white/10" />
        <Button
          className="bg-primary text-black font-bold"
          onClick={async () => {
            const num = Number(value);
            if (!label.trim() || !Number.isFinite(num)) return;
            const next = [...items, { label, value: num }];
            setItems(next);
            setLabel(""); setValue("");
            await save(next);
          }}
        >
          Add Stat
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">No stats yet. Add heading and number above.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
              <div className="text-white font-medium">{it.label}</div>
              <div className="flex items-center gap-3">
                <Input
                  value={String(it.value)}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    const next = items.slice();
                    next[idx] = { ...next[idx], value: Number.isFinite(num) ? num : next[idx].value };
                    setItems(next);
                  }}
                  className="w-24 bg-background/50 border-white/10"
                />
                <Button
                  variant="outline"
                  className="border-white/10 text-white"
                  onClick={async () => {
                    await save(items);
                  }}
                >
                  Save
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={async () => {
                    const next = items.filter((_, i) => i !== idx);
                    setItems(next);
                    await save(next);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

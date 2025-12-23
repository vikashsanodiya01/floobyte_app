import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { insertPostSchema, insertProjectSchema, insertMessageSchema, insertCareerSchema, insertServiceSchema, insertApplicationSchema, insertReviewSchema, insertBadgeSchema, insertLeadSchema } from "@shared/schema";
import { verifyAdminCredentials, requireAuth, getAuthStatus, regenerateSession } from "./auth.ts";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      env: process.env.NODE_ENV || "development",
      node: process.version,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      time: new Date().toISOString(),
    });
  });
  app.get("/api/health/db", async (_req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json({ ok: true, reachable: true, sampleCount: posts.length });
    } catch (error: any) {
      console.error("DB health check failed:", error);
      res.status(500).json({ ok: false, error: error?.message ?? String(error) });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const isValid = await verifyAdminCredentials(username, password);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      req.session.isAuthenticated = true;
      req.session.adminUser = username;
      
      try {
        await regenerateSession(req);
      } catch (err) {
        console.error("Session regeneration failed:", err);
      }
      
      res.json({ message: "Login successful", user: username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    const status = getAuthStatus(req);
    res.json(status);
  });

  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.get("/api/posts/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      await storage.incrementPostViews(post.id!);
      const updated = await storage.getPost(post.id!);
      res.json(updated);
    } catch (error) {
      console.error("Error fetching post by slug:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/posts/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementPostViews(id);
      const post = await storage.getPost(id);
      res.json({ views: post?.views ?? 0 });
    } catch (error) {
      console.error("Error incrementing views:", error);
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  app.post("/api/posts", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updatePost(id, req.body);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(400).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.updateProject(id, req.body);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.get("/api/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Error fetching message:", error);
      res.status(500).json({ message: "Failed to fetch message" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Failed to create message" });
    }
  });

  app.put("/api/messages/:id/read", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markMessageRead(id);
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.delete("/api/messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMessage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const posts = await storage.getPosts();
      const projects = await storage.getProjects();
      const messages = await storage.getMessages();
      const careers = await storage.getCareers();
      const services = await storage.getServices();
      
      res.json({
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.status === "Published").length,
        draftPosts: posts.filter(p => p.status === "Draft").length,
        totalProjects: projects.length,
        totalServices: services.length,
        totalMessages: messages.length,
        unreadMessages: messages.filter(m => !m.isRead).length,
        totalCareers: careers.length,
        openCareers: careers.filter(c => c.status === "Open").length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/careers", async (req, res) => {
    try {
      const careers = await storage.getCareers();
      res.json(careers);
    } catch (error) {
      console.error("Error fetching careers:", error);
      res.status(500).json({ message: "Failed to fetch careers" });
    }
  });

  app.get("/api/careers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const career = await storage.getCareer(id);
      if (!career) {
        return res.status(404).json({ message: "Career not found" });
      }
      res.json(career);
    } catch (error) {
      console.error("Error fetching career:", error);
      res.status(500).json({ message: "Failed to fetch career" });
    }
  });

  app.post("/api/careers", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCareerSchema.parse(req.body);
      const career = await storage.createCareer(validatedData);
      res.status(201).json(career);
    } catch (error) {
      console.error("Error creating career:", error);
      res.status(400).json({ message: "Failed to create career" });
    }
  });

  app.put("/api/careers/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const career = await storage.updateCareer(id, req.body);
      if (!career) {
        return res.status(404).json({ message: "Career not found" });
      }
      res.json(career);
    } catch (error) {
      console.error("Error updating career:", error);
      res.status(400).json({ message: "Failed to update career" });
    }
  });

  app.delete("/api/careers/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCareer(id);
      if (!deleted) {
        return res.status(404).json({ message: "Career not found" });
      }
      res.json({ message: "Career deleted successfully" });
    } catch (error) {
      console.error("Error deleting career:", error);
      res.status(500).json({ message: "Failed to delete career" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const validated = insertApplicationSchema.parse(req.body);
      const created = await storage.createApplication(validated);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(400).json({ message: "Failed to submit application" });
    }
  });

  app.get("/api/applications", requireAuth, async (_req, res) => {
    try {
      const list = await storage.getApplications();
      res.json(list);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.delete("/api/applications/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteApplication(id);
      if (!deleted) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json({ message: "Application deleted" });
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const list = await storage.getServices();
      res.json(list);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const svc = await storage.getService(id);
      if (!svc) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(svc);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  app.post("/api/services", requireAuth, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const svc = await storage.createService(validatedData);
      res.status(201).json(svc);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const svc = await storage.updateService(id, req.body);
      if (!svc) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(svc);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteService(id);
      if (!deleted) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Reviews: public GET, admin-managed create/delete
  app.get("/api/reviews", async (_req, res) => {
    try {
      const list = await storage.getReviews();
      res.json(list);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const validated = insertReviewSchema.parse(req.body);
      const created = await storage.createReview(validated);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  app.delete("/api/reviews/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteReview(id);
      if (!deleted) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json({ message: "Review deleted" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  app.post("/api/reviews/sync", requireAuth, async (req, res) => {
    try {
      const source = String(req.body?.source || "").toLowerCase();

      if (!source || !["google", "trustpilot"].includes(source)) {
        return res.status(400).json({ message: "Invalid source. Use 'google' or 'trustpilot'" });
      }

      if (source === "google") {
        const placeId = String(req.body?.placeId || (await storage.getSetting("google.placeId")) || "");
        const apiKey = String(req.body?.apiKey || process.env.GOOGLE_PLACES_API_KEY || (await storage.getSetting("google.apiKey")) || "");
        if (!placeId || !apiKey) {
          return res.status(400).json({ message: "Missing Google placeId or apiKey" });
        }
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews,rating,user_ratings_total&key=${encodeURIComponent(apiKey)}`;
        const resp = await fetch(url);
        if (!resp.ok) {
          return res.status(502).json({ message: "Failed to fetch Google Reviews" });
        }
        const data = await resp.json();
        const reviews = (data?.result?.reviews ?? []).slice(0, 20);
        for (const r of reviews) {
          const author = String(r?.author_name || "Anonymous");
          const rating = Number(r?.rating || 0);
          const text = String(r?.text || "");
          await storage.createReview({ author, rating, text, source: "Google" });
        }
        return res.json({ message: "Synced Google Reviews", count: reviews.length });
      }

      if (source === "trustpilot") {
        const businessUnitId = String(req.body?.businessUnitId || (await storage.getSetting("trustpilot.businessUnitId")) || "");
        const accessToken = String(req.body?.accessToken || process.env.TRUSTPILOT_ACCESS_TOKEN || (await storage.getSetting("trustpilot.accessToken")) || "");
        if (!businessUnitId || !accessToken) {
          return res.status(400).json({ message: "Missing Trustpilot businessUnitId or accessToken" });
        }
        const url = `https://api.trustpilot.com/v1/business-units/${encodeURIComponent(businessUnitId)}/reviews`;
        const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
        if (!resp.ok) {
          return res.status(502).json({ message: "Failed to fetch Trustpilot Reviews" });
        }
        const data = await resp.json();
        const reviews = (data?.reviews ?? []).slice(0, 50);
        for (const r of reviews) {
          const author = String(r?.consumer?.displayName || r?.title || "Trustpilot User");
          const rating = Number(r?.stars || r?.rating || 0);
          const text = String(r?.text || r?.content || "");
          await storage.createReview({ author, rating, text, source: "Trustpilot" });
        }
        return res.json({ message: "Synced Trustpilot Reviews", count: reviews.length });
      }

      return res.status(400).json({ message: "Unsupported source" });
    } catch (error) {
      console.error("Error syncing reviews:", error);
      res.status(500).json({ message: "Failed to sync reviews" });
    }
  });

  // Badges: public GET, admin CRUD
  app.get("/api/badges", async (req, res) => {
    try {
      const list = await storage.getBadges();
      res.json(list);
    } catch (error: any) {
      console.error("Error fetching badges:", error);
      if (error?.code === "ER_NO_SUCH_TABLE") {
        return res.json([]);
      }
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // Leads (LMS)
  app.get("/api/leads", requireAuth, async (req, res) => {
    try {
      const list = await storage.getLeads();
      res.json(list);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const lead = await storage.getLead(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  });

  app.post("/api/leads", async (req, res) => {
    let normalized: any;
    try {
      const raw = req.body ?? {};
      normalized = {
        name: String(raw.name ?? "").trim(),
        email: String(raw.email ?? "").trim(),
        company: raw.company ? String(raw.company) : undefined,
        phone: raw.phone ? String(raw.phone) : undefined,
        services: Array.isArray(raw.services) ? JSON.stringify(raw.services) : (typeof raw.services === "string" ? raw.services : undefined),
        budget: raw.budget ? String(raw.budget) : undefined,
        details: raw.details ? String(raw.details) : undefined,
        source: raw.source ? String(raw.source) : "Quote",
        status: raw.status ? String(raw.status) : "New",
      };
      if (!normalized.name || !normalized.email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      const cleaned = Object.fromEntries(Object.entries(normalized).filter(([_, v]) => v !== undefined));
      const insert = insertLeadSchema.parse(cleaned);
      const created = await storage.createLead(insert);
      res.json(created);
    } catch (error) {
      try {
        console.error("Lead payload parse error", { body: req.body, normalized });
      } catch {}
      console.error("Error creating lead:", error);
      const message = (error as any)?.message || "Invalid lead payload";
      res.status(400).json({ message });
    }
  });

  app.put("/api/leads/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const updated = await storage.updateLead(id, req.body);
    if (!updated) return res.status(404).json({ message: "Lead not found" });
    res.json(updated);
  });

  app.delete("/api/leads/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const ok = await storage.deleteLead(id);
    res.json({ success: ok });
  });

  app.post("/api/badges", requireAuth, async (req, res) => {
    try {
      const validated = insertBadgeSchema.parse(req.body);
      const created = await storage.createBadge(validated);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating badge:", error);
      res.status(400).json({ message: "Failed to create badge" });
    }
  });

  app.put("/api/badges/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateBadge(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Badge not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating badge:", error);
      res.status(400).json({ message: "Failed to update badge" });
    }
  });

  app.delete("/api/badges/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBadge(id);
      if (!deleted) {
        return res.status(404).json({ message: "Badge not found" });
      }
      res.json({ message: "Badge deleted" });
    } catch (error) {
      console.error("Error deleting badge:", error);
      res.status(500).json({ message: "Failed to delete badge" });
    }
  });

  // Settings: simple key-value storage for legal pages and home content
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const value = await storage.getSetting(key);
      res.json({ key, value: value ?? null });
    } catch (error) {
      console.error("Error fetching setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  app.put("/api/settings/:key", requireAuth, async (req, res) => {
    try {
      const key = req.params.key;
      const value = String(req.body?.value ?? "");
      await storage.setSetting(key, value);
      res.json({ key, value });
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  return httpServer;
}

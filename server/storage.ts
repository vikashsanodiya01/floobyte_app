import { db } from "./db.ts";
import { eq, desc } from "drizzle-orm";
import { 
  users, posts, projects, messages, settings, careers, services, applications, reviews, badges, leads,
  type User, type InsertUser,
  type Post, type InsertPost,
  type Project, type InsertProject,
  type Message, type InsertMessage,
  type Career, type InsertCareer,
  type Service, type InsertService,
  type Application, type InsertApplication,
  type Review, type InsertReview,
  type Badge, type InsertBadge,
  type Lead, type InsertLead
} from "../shared/schema.ts";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  incrementPostViews(id: number): Promise<void>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageRead(id: number): Promise<boolean>;
  deleteMessage(id: number): Promise<boolean>;
  
  getCareers(): Promise<Career[]>;
  getCareer(id: number): Promise<Career | undefined>;
  createCareer(career: InsertCareer): Promise<Career>;
  updateCareer(id: number, career: Partial<InsertCareer>): Promise<Career | undefined>;
  deleteCareer(id: number): Promise<boolean>;

  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  getSetting(key: string): Promise<string | undefined>;
  setSetting(key: string, value: string): Promise<void>;

  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  deleteApplication(id: number): Promise<boolean>;

  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: number): Promise<boolean>;

  getBadges(): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  updateBadge(id: number, badge: Partial<InsertBadge>): Promise<Badge | undefined>;
  deleteBadge(id: number): Promise<boolean>;

  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private async ensureBadgesTable() {
    try {
      await db.select().from(badges).limit(1);
    } catch (error: any) {
      if (error?.code === "ER_NO_SUCH_TABLE") {
        await (db as any).execute(
          `CREATE TABLE IF NOT EXISTS badges (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            label VARCHAR(255) NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            link_url VARCHAR(500) NULL,
            enabled BOOLEAN DEFAULT TRUE,
            order_index INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
        );
      } else {
        throw error;
      }
    }
  }

  private async ensureLeadsTable() {
    try {
      await db.select().from(leads).limit(1);
    } catch (error: any) {
      if (error?.code === "ER_NO_SUCH_TABLE") {
        await (db as any).execute(
          `CREATE TABLE IF NOT EXISTS leads (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            company VARCHAR(255) NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NULL,
            services TEXT NULL,
            budget VARCHAR(100) NULL,
            details TEXT NULL,
            source VARCHAR(50) DEFAULT 'Quote',
            status VARCHAR(50) DEFAULT 'New',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
        );
      } else {
        throw error;
      }
    }
    try {
      await (db as any).execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS company VARCHAR(255) NULL`);
      await (db as any).execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone VARCHAR(50) NULL`);
      await (db as any).execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS services TEXT NULL`);
      await (db as any).execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget VARCHAR(100) NULL`);
      await (db as any).execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS details TEXT NULL`);
      await (db as any).execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'Quote'`);
      await (db as any).execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'New'`);
      await (db as any).execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
      await (db as any).execute(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    } catch {}
  }
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user);
    const insertId = result[0].insertId;
    const newUser = await this.getUser(insertId);
    return newUser!;
  }

  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(posts.createdAt);
  }

  async getPost(id: number): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0];
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.slug, slug));
    return result[0];
  }

  async createPost(post: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(post);
    const insertId = result[0].insertId;
    const newPost = await this.getPost(insertId);
    return newPost!;
  }

  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    await db.update(posts).set(post).where(eq(posts.id, id));
    return await this.getPost(id);
  }

  async incrementPostViews(id: number): Promise<void> {
    const existing = await this.getPost(id);
    const views = (existing?.views ?? 0) + 1;
    await db.update(posts).set({ views }).where(eq(posts.id, id));
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result[0].affectedRows > 0;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.createdAt);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project);
    const insertId = result[0].insertId;
    const newProject = await this.getProject(insertId);
    return newProject!;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    await db.update(projects).set(project).where(eq(projects.id, id));
    return await this.getProject(id);
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result[0].affectedRows > 0;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(messages.createdAt);
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    return result[0];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message);
    const insertId = result[0].insertId;
    const newMessage = await this.getMessage(insertId);
    return newMessage!;
  }

  async markMessageRead(id: number): Promise<boolean> {
    const result = await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
    return result[0].affectedRows > 0;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id));
    return result[0].affectedRows > 0;
  }

  async getCareers(): Promise<Career[]> {
    return await db.select().from(careers).orderBy(careers.createdAt);
  }

  async getCareer(id: number): Promise<Career | undefined> {
    const result = await db.select().from(careers).where(eq(careers.id, id));
    return result[0];
  }

  async createCareer(career: InsertCareer): Promise<Career> {
    const result = await db.insert(careers).values(career);
    const insertId = result[0].insertId;
    const newCareer = await this.getCareer(insertId);
    return newCareer!;
  }

  async updateCareer(id: number, career: Partial<InsertCareer>): Promise<Career | undefined> {
    await db.update(careers).set(career).where(eq(careers.id, id));
    return await this.getCareer(id);
  }

  async deleteCareer(id: number): Promise<boolean> {
    const result = await db.delete(careers).where(eq(careers.id, id));
    return result[0].affectedRows > 0;
  }

  

  async getLeads(): Promise<Lead[]> {
    await this.ensureLeadsTable();
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: number): Promise<Lead | undefined> {
    await this.ensureLeadsTable();
    const rows = await db.select().from(leads).where(eq(leads.id, id));
    return rows[0];
  }

  async createLead(leadData: InsertLead): Promise<Lead> {
    await this.ensureLeadsTable();
    const result = await db.insert(leads).values(leadData);
    const insertId = result[0].insertId;
    const rows = await db.select().from(leads).where(eq(leads.id, insertId));
    return rows[0]!;
  }

  async updateLead(id: number, leadData: Partial<InsertLead>): Promise<Lead | undefined> {
    await this.ensureLeadsTable();
    await db.update(leads).set(leadData).where(eq(leads.id, id));
    const rows = await db.select().from(leads).where(eq(leads.id, id));
    return rows[0];
  }

  async deleteLead(id: number): Promise<boolean> {
    await this.ensureLeadsTable();
    const result = await db.delete(leads).where(eq(leads.id, id));
    return result[0].affectedRows > 0;
  }
 

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.createdAt);
  }

  async getService(id: number): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values(service);
    const insertId = result[0].insertId;
    const newService = await this.getService(insertId);
    return newService!;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    await db.update(services).set(service).where(eq(services.id, id));
    return await this.getService(id);
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result[0].affectedRows > 0;
  }

  async getSetting(key: string): Promise<string | undefined> {
    const rows = await db.select().from(settings).where(eq(settings.key, key));
    return rows[0]?.value ?? undefined;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const existing = await db.select().from(settings).where(eq(settings.key, key));
    if (existing[0]) {
      await db.update(settings).set({ value }).where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }

  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(applications.createdAt);
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const result = await db.select().from(applications).where(eq(applications.id, id));
    return result[0];
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const result = await db.insert(applications).values(application);
    const insertId = result[0].insertId;
    const newApp = await this.getApplication(insertId);
    return newApp!;
  }

  async updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application | undefined> {
    await db.update(applications).set(application).where(eq(applications.id, id));
    return await this.getApplication(id);
  }

  async deleteApplication(id: number): Promise<boolean> {
    const result = await db.delete(applications).where(eq(applications.id, id));
    return result[0].affectedRows > 0;
  }

  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(reviews.createdAt);
  }

  async getReview(id: number): Promise<Review | undefined> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id));
    return result[0];
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review);
    const insertId = result[0].insertId;
    const rows = await db.select().from(reviews).where(eq(reviews.id, insertId));
    return rows[0]!;
  }

  async updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined> {
    await db.update(reviews).set(review).where(eq(reviews.id, id));
    return await this.getReview(id);
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return result[0].affectedRows > 0;
  }

  async getBadges(): Promise<Badge[]> {
    await this.ensureBadgesTable();
    return await db.select().from(badges).orderBy(badges.orderIndex);
  }

  async getBadge(id: number): Promise<Badge | undefined> {
    const result = await db.select().from(badges).where(eq(badges.id, id));
    return result[0];
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    await this.ensureBadgesTable();
    const result = await db.insert(badges).values(badge);
    const insertId = result[0].insertId;
    const rows = await db.select().from(badges).where(eq(badges.id, insertId));
    return rows[0]!;
  }

  async updateBadge(id: number, badge: Partial<InsertBadge>): Promise<Badge | undefined> {
    await this.ensureBadgesTable();
    await db.update(badges).set(badge).where(eq(badges.id, id));
    const rows = await db.select().from(badges).where(eq(badges.id, id));
    return rows[0];
  }

  async deleteBadge(id: number): Promise<boolean> {
    await this.ensureBadgesTable();
    const result = await db.delete(badges).where(eq(badges.id, id));
    return result[0].affectedRows > 0;
  }
}

export const storage = new DatabaseStorage();

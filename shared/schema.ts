import { sql } from "drizzle-orm";
import { mysqlTable, varchar, text, int, timestamp, boolean } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = mysqlTable("posts", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  status: varchar("status", { length: 50 }).default("Draft"),
  imageUrl: varchar("image_url", { length: 500 }),
  slug: varchar("slug", { length: 255 }).unique(),
  excerpt: text("excerpt"),
  author: varchar("author", { length: 255 }),
  category: varchar("category", { length: 100 }),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  views: int("views").default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const projects = mysqlTable("projects", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  client: varchar("client", { length: 255 }),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  linkUrl: varchar("link_url", { length: 500 }),
  videoUrl: varchar("video_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  fromName: varchar("from_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = mysqlTable("settings", {
  id: int("id").primaryKey().autoincrement(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const careers = mysqlTable("careers", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  department: varchar("department", { length: 100 }),
  location: varchar("location", { length: 255 }),
  experience: varchar("experience", { length: 100 }),
  description: text("description"),
  requirements: text("requirements"),
  responsibilities: text("responsibilities"),
  benefits: text("benefits"),
  salary: varchar("salary", { length: 100 }),
  status: varchar("status", { length: 50 }).default("Open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const services = mysqlTable("services", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  icon: varchar("icon", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }),
  videoUrl: varchar("video_url", { length: 500 }),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const applications = mysqlTable("applications", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  resumeUrl: varchar("resume_url", { length: 500 }),
  coverLetter: text("cover_letter"),
  positionId: int("position_id"),
  interestArea: varchar("interest_area", { length: 255 }),
  status: varchar("status", { length: 50 }).default("New"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer reviews/testimonials
export const reviews = mysqlTable("reviews", {
  id: int("id").primaryKey().autoincrement(),
  author: varchar("author", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  text: text("text"),
  source: varchar("source", { length: 100 }).default("Internal"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Certifications & partner badges for footer
export const badges = mysqlTable("badges", {
  id: int("id").primaryKey().autoincrement(),
  label: varchar("label", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  linkUrl: varchar("link_url", { length: 500 }),
  enabled: boolean("enabled").default(true),
  orderIndex: int("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Leads captured from Quote page
export const leads = mysqlTable("leads", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  services: text("services"),
  budget: varchar("budget", { length: 100 }),
  details: text("details"),
  source: varchar("source", { length: 50 }).default("Quote"),
  status: varchar("status", { length: 50 }).default("New"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  title: true,
  content: true,
  status: true,
  imageUrl: true,
  slug: true,
  excerpt: true,
  author: true,
  category: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  views: true,
  publishedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  client: true,
  category: true,
  description: true,
  imageUrl: true,
  linkUrl: true,
  videoUrl: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  fromName: true,
  email: true,
  subject: true,
  message: true,
});

export const insertCareerSchema = createInsertSchema(careers).pick({
  title: true,
  type: true,
  department: true,
  location: true,
  experience: true,
  description: true,
  requirements: true,
  responsibilities: true,
  benefits: true,
  salary: true,
  status: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  title: true,
  description: true,
  category: true,
  icon: true,
  imageUrl: true,
  videoUrl: true,
  status: true,
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  name: true,
  email: true,
  phone: true,
  resumeUrl: true,
  coverLetter: true,
  positionId: true,
  interestArea: true,
  status: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  author: true,
  rating: true,
  text: true,
  source: true,
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  label: true,
  imageUrl: true,
  linkUrl: true,
  enabled: true,
  orderIndex: true,
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  company: true,
  email: true,
  phone: true,
  services: true,
  budget: true,
  details: true,
  source: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertCareer = z.infer<typeof insertCareerSchema>;
export type Career = typeof careers.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

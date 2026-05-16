/**
 * Database types for Supabase.
 *
 * Mirrors the schema defined in supabase/migrations/0001_initial.sql
 * and supabase/migrations/0002_settings.sql. Hand-maintained — regenerate
 * with `supabase gen types typescript` if/when the CLI is set up.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | {[key: string]: Json | undefined}
  | Json[];

// ─── Settings JSON shapes ────────────────────────────────────────
export type BranchPricePackage = {
  key: 'group4' | 'group3' | 'group2' | 'individual' | string;
  campaign: string;
  normal: string;
};

export type BranchPriceInfo = {
  packages: BranchPricePackage[];
  sessionCount?: number;
  sessionsPerWeek?: number;
};

// ─── Table row types ─────────────────────────────────────────────
export type Trainer = {
  id: string;
  slug: string;
  name: string;
  title_tr: string | null;
  title_en: string | null;
  short_bio_tr: string | null;
  short_bio_en: string | null;
  about_tr: string[] | null;
  about_en: string[] | null;
  certifications: string[] | null;
  specialties: string[] | null;
  photo: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Branch = {
  id: string;
  slug: string;
  emoji: string | null;
  name_tr: string;
  name_en: string | null;
  schedule_tr: string | null;
  schedule_en: string | null;
  schedule_long_tr: string | null;
  schedule_long_en: string | null;
  description_tr: string | null;
  description_en: string | null;
  short_description_tr: string | null;
  short_description_en: string | null;
  features_tr: string[] | null;
  features_en: string[] | null;
  instructor_id: string | null;
  price_info: BranchPriceInfo | null;
  women_only: boolean;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  author: string | null;
  date: string;
  image: string | null;
  read_time: number | null;
  title_tr: string;
  title_en: string | null;
  excerpt_tr: string | null;
  excerpt_en: string | null;
  content_tr: string | null;
  content_en: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  key: string;
  src: string | null;
  category: string;
  title_tr: string | null;
  title_en: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
};

export type Faq = {
  id: string;
  key: string;
  category: string;
  question_tr: string;
  question_en: string | null;
  answer_tr: string;
  answer_en: string | null;
  link_href: string | null;
  link_label_tr: string | null;
  link_label_en: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  message: string;
  ip_address: string | null;
  user_agent: string | null;
  status: 'new' | 'read' | 'replied' | 'archived' | string;
  created_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'editor' | string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Setting = {
  key: string;
  value: string | null;
  updated_at: string;
};

// ─── Insert / Update helper types ────────────────────────────────
type Insertable<T, Required extends keyof T = never> = Partial<T> &
  Pick<T, Required>;

export type TrainerInsert = Insertable<Trainer, 'slug' | 'name'>;
export type BranchInsert = Insertable<Branch, 'slug' | 'name_tr'>;
export type BlogPostInsert = Insertable<BlogPost, 'slug' | 'category' | 'title_tr'>;
export type GalleryItemInsert = Insertable<GalleryItem, 'key' | 'category'>;
export type FaqInsert = Insertable<Faq, 'key' | 'category' | 'question_tr' | 'answer_tr'>;
export type ContactMessageInsert = Insertable<ContactMessage, 'name' | 'message'>;
export type AdminUserInsert = Insertable<AdminUser, 'email'>;
export type SettingInsert = Insertable<Setting, 'key'>;

// ─── Supabase Database shape ─────────────────────────────────────
// Each table needs a Relationships array — Postgrest's generated query
// types require it. For branches we describe the trainers FK so the
// `instructor:trainers!instructor_id(*)` join is type-aware.
type BranchToTrainerFk = {
  foreignKeyName: 'branches_instructor_id_fkey';
  columns: ['instructor_id'];
  isOneToOne: false;
  referencedRelation: 'trainers';
  referencedColumns: ['id'];
};

export type Database = {
  public: {
    Tables: {
      trainers: {
        Row: Trainer;
        Insert: TrainerInsert;
        Update: Partial<TrainerInsert>;
        Relationships: [];
      };
      branches: {
        Row: Branch;
        Insert: BranchInsert;
        Update: Partial<BranchInsert>;
        Relationships: [BranchToTrainerFk];
      };
      blog_posts: {
        Row: BlogPost;
        Insert: BlogPostInsert;
        Update: Partial<BlogPostInsert>;
        Relationships: [];
      };
      gallery_items: {
        Row: GalleryItem;
        Insert: GalleryItemInsert;
        Update: Partial<GalleryItemInsert>;
        Relationships: [];
      };
      faqs: {
        Row: Faq;
        Insert: FaqInsert;
        Update: Partial<FaqInsert>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: ContactMessageInsert;
        Update: Partial<ContactMessageInsert>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUser;
        Insert: AdminUserInsert;
        Update: Partial<AdminUserInsert>;
        Relationships: [];
      };
      settings: {
        Row: Setting;
        Insert: SettingInsert;
        Update: Partial<SettingInsert>;
        Relationships: [];
      };
    };
    Views: {[_ in never]: never};
    Functions: {[_ in never]: never};
    Enums: {[_ in never]: never};
  };
};

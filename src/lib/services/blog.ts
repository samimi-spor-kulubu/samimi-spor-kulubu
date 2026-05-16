import 'server-only';

import {createPublicClient} from '@/lib/supabase/public';
import {createAdminClient} from '@/lib/supabase/admin';
import type {BlogPost as DbBlogPost} from '@/types/database';

export type LocalizedBlogListItem = {
  id: string;
  slug: string;
  category: string;
  author: string | null;
  date: string;
  image: string | null;
  readTime: number;
  title: string;
  excerpt: string;
  published: boolean;
};

export type LocalizedBlogPost = LocalizedBlogListItem & {
  content: string;
};

function pick<T>(en: T | null, tr: T | null, locale: string): T | null {
  return (locale === 'en' ? en : tr) ?? null;
}

function localize(row: DbBlogPost, locale: string): LocalizedBlogPost {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    author: row.author,
    date: row.date,
    image: row.image,
    readTime: row.read_time ?? 5,
    title: pick(row.title_en, row.title_tr, locale) ?? row.title_tr,
    excerpt: pick(row.excerpt_en, row.excerpt_tr, locale) ?? '',
    content: pick(row.content_en, row.content_tr, locale) ?? '',
    published: row.published
  };
}

function todayIso(): string {
  // YYYY-MM-DD for the server's local date — matches the `date` column
  // semantics. Posts with date <= todayIso() are eligible to be public.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Public-facing list of blog posts, locale-aware. By default returns
 * posts that are both `published=true` AND have `date <= today`, so
 * scheduled posts stay hidden until their publish date.
 *
 * `content` is stripped from the response to keep list payloads small;
 * use `getBlogPostBySlug` for the detail page.
 */
export async function getAllBlogPosts(
  locale: string,
  includeUnpublished = false
): Promise<LocalizedBlogListItem[]> {
  const supabase = createPublicClient();
  let q = supabase.from('blog_posts').select('*');
  if (!includeUnpublished) {
    q = q.eq('published', true).lte('date', todayIso());
  }
  const {data, error} = await q.order('date', {ascending: false});

  if (error) {
    console.error('[blog.getAllBlogPosts]', error);
    return [];
  }

  return (data ?? []).map((row) => {
    const full = localize(row as DbBlogPost, locale);
    const {content: _content, ...rest} = full;
    void _content;
    return rest;
  });
}

/**
 * Public detail-page fetch. Returns null for drafts and scheduled-in-
 * the-future posts so /blog/[slug] 404s for visitors. Admins can use
 * `getAdminBlogPost` to bypass these filters.
 */
export async function getBlogPostBySlug(
  slug: string,
  locale: string
): Promise<LocalizedBlogPost | null> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .lte('date', todayIso())
    .maybeSingle();

  if (error) {
    console.error('[blog.getBlogPostBySlug]', error);
    return null;
  }
  if (!data) return null;
  return localize(data as DbBlogPost, locale);
}

/** Just the slugs of currently-public posts (for generateStaticParams). */
export async function getAllPublicBlogSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true)
    .lte('date', todayIso());

  if (error) {
    console.error('[blog.getAllPublicBlogSlugs]', error);
    return [];
  }
  return (data ?? []).map((r) => r.slug);
}

// =============================================================
// Admin-facing helpers — use the admin client (RLS bypass) and
// don't apply published/date filters. Importing these from a
// Client Component will fail loudly via 'server-only'.
// =============================================================

export type AdminBlogRow = DbBlogPost & {
  status: 'published' | 'draft' | 'scheduled';
};

function statusFor(row: DbBlogPost): AdminBlogRow['status'] {
  if (!row.published) return 'draft';
  if (row.date > todayIso()) return 'scheduled';
  return 'published';
}

/** All blog posts in the table, with a derived publishing status. */
export async function getAllAdminBlogPosts(): Promise<AdminBlogRow[]> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('blog_posts')
    .select('*')
    .order('date', {ascending: false})
    .order('created_at', {ascending: false});

  if (error) {
    console.error('[blog.getAllAdminBlogPosts]', error);
    return [];
  }
  return (data ?? []).map((row) => ({
    ...(row as DbBlogPost),
    status: statusFor(row as DbBlogPost)
  }));
}

/** Single post by id, no filters — for the admin edit form. */
export async function getAdminBlogPost(
  id: string
): Promise<DbBlogPost | null> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[blog.getAdminBlogPost]', error);
    return null;
  }
  return (data as DbBlogPost | null) ?? null;
}

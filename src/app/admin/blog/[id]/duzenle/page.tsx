import Link from 'next/link';
import {notFound} from 'next/navigation';

import {getAdminBlogPost} from '@/lib/services/blog';

import {updateBlogPost} from '../../actions';
import type {BlogActionState} from '../../constants';
import {BlogForm, type BlogFormValues} from '../../BlogForm';

export const dynamic = 'force-dynamic';

export default async function BlogDuzenlePage({
  params
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const post = await getAdminBlogPost(id);
  if (!post) notFound();

  const initial: BlogFormValues = {
    slug: post.slug,
    category: post.category,
    author: post.author ?? '',
    // `date` column is `date` (YYYY-MM-DD) — Input type=date wants the
    // same shape, so slicing the first 10 chars is enough.
    date: post.date?.slice(0, 10),
    read_time: post.read_time ?? 5,
    title_tr: post.title_tr,
    title_en: post.title_en ?? '',
    excerpt_tr: post.excerpt_tr ?? '',
    excerpt_en: post.excerpt_en ?? '',
    content_tr: post.content_tr ?? '',
    content_en: post.content_en ?? '',
    published: post.published,
    existingImage: post.image
  };

  const boundUpdate = async (state: BlogActionState, fd: FormData) => {
    'use server';
    return updateBlogPost(id, state, fd);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-amber transition-colors hover:text-brand-black"
        >
          ← Geri
        </Link>
      </div>

      <header>
        <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
          YAZIYI DÜZENLE
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Slug: <code className="text-brand-black">{post.slug}</code>
        </p>
      </header>

      <BlogForm
        action={boundUpdate}
        initial={initial}
        submitLabel="Değişiklikleri Kaydet"
        previewSlug={post.slug}
      />
    </div>
  );
}

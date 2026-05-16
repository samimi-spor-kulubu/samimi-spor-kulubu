import Link from 'next/link';

import {createBlogPost} from '../actions';
import {BlogForm} from '../BlogForm';

export default function BlogYeniPage() {
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
          YENİ YAZI
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Yeni bir blog yazısı oluştur. TR + EN başlık zorunlu.
        </p>
      </header>

      <BlogForm action={createBlogPost} submitLabel="Kaydet" />
    </div>
  );
}

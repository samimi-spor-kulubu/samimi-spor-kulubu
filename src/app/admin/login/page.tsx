import type {Metadata} from 'next';

import {LoginForm} from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin Girişi — Samimi Spor Kulübü',
  robots: {index: false, follow: false}
};

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{next?: string}>;
}) {
  const {next} = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-heading text-2xl tracking-wider text-brand-black">
            SAMİMİ <span className="text-brand-amber">SPOR</span> KULÜBÜ
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-brand-gray">
            Yönetim Paneli
          </p>
        </div>

        <div className="rounded-2xl border-2 border-brand-border bg-white p-8 shadow-sm">
          <h1 className="font-heading text-3xl tracking-wider text-brand-black">
            GİRİŞ YAP
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Yönetici hesabınla giriş yap.
          </p>

          <div className="mt-6">
            <LoginForm next={next} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-brand-gray">
          Bu sayfa sadece yetkili yöneticiler içindir.
        </p>
      </div>
    </main>
  );
}

import {NextResponse, type NextRequest} from 'next/server';

import {createClient} from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  // 303 ensures the browser follows the redirect with GET after the POST.
  return NextResponse.redirect(url, {status: 303});
}

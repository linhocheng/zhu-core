import { NextRequest, NextResponse } from 'next/server';

/**
 * 守 /hub（公開無認證的 CRUD 面板）：Basic auth 驗過後種 zhu-hub cookie，
 * 讓 hub 的同源 /api 寫入 fetch 認得（見 lib/write-auth.ts 的 hasHubAccess）。
 * ZHU_HUB_PASSWORD 未設 → 開放（dev fallback）。
 */
export function middleware(req: NextRequest) {
  const password = process.env.ZHU_HUB_PASSWORD ?? '';
  if (!password) return NextResponse.next();

  const auth = req.headers.get('authorization') ?? '';
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const p = decoded.slice(decoded.indexOf(':') + 1);
      if (p === password) {
        const res = NextResponse.next();
        res.cookies.set('zhu-hub', password, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
        return res;
      }
    } catch {
      /* malformed */
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="ZHU Hub"' },
  });
}

export const config = {
  matcher: ['/hub', '/hub/:path*'],
};

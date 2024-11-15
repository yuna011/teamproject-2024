// Next.js のレスポンスオブジェクトをインポート
import { NextResponse } from 'next/server';
// Next.js のリクエストオブジェクトの型をインポート
import type { NextRequest } from 'next/server';

/**
 * middleware 関数
 * ユーザーの認証状態を確認し、認証されていない場合は /auth にリダイレクトする
 */
export function middleware(request: NextRequest) {
    // リクエストのクッキーから認証トークン（auth-token）を取得
    const token = request.cookies.get('auth-token');

    // 認証トークンが存在しない場合（未認証ユーザー）
    if (!token) {
        // 未認証ユーザーの場合、コンソールにリダイレクト情報を出力し、/auth ページにリダイレクト
        console.log('User not authenticated, redirecting to /auth');
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // 認証トークンが存在する場合、リクエストを次の処理へ通過させる
    return NextResponse.next();
}

/**
 * middleware の適用範囲を設定する
 * /auth、静的ファイル、および favicon.ico を除くすべてのパスに適用
 */
export const config = {
    matcher: ['/((?!auth|_next/static|favicon.ico).*)']
};
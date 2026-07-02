// 投稿の種類
export type ThreadsMediaType =
    | "TEXT_POST"
    | "IMAGE"
    | "VIDEO"
    | "CAROUSEL_ALBUM"
    | "AUDIO"
    | "REPOST_FACADE";

// 投稿データのオブジェクト型
export interface ThreadsMediaObject {
    id: string; // 投稿のユニークID
    media_product_type: "THREADS"; // プロダクトタイプ（常に 'THREADS'）
    media_type: ThreadsMediaType; // メディアの種類
    media_url?: string; // 画像や動画のURL（TEXTタイプ以外の場合）
    permalink: string; // Threads上の投稿URL (https://www.threads.net/...)
    owner: { id: string }; // 投稿者のユーザーID
    username: string; // 投稿者のユーザー名
    text?: string; // 投稿の本文
    timestamp: string; // 投稿日時 (ISO 8601フォーマット 例: "2026-06-25T12:00:00+0000")
    profile_picture_url?: string; // 投稿者のプロフィール画像URL

    // カルーセル（複数枚投稿）の場合、子要素のIDリストが含まれる
    children?: {
        data: { id: string }[];
    };
}

export interface ThreadsReplyObject extends ThreadsMediaObject {
    parentPostText: string; // 返信先の投稿本文
}

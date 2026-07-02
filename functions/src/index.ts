import { Hono } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

type Bindings = {
    MY_THREADS_USERNAME: string;
    THREADS_ACCESS_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// 投稿の種類
export type ThreadsMediaType =
    | "TEXT"
    | "IMAGE"
    | "VIDEO"
    | "CAROUSEL"
    | "AUDIO";

// 投稿データのオブジェクト型
export interface ThreadsMediaObject {
    id: string; // 投稿のユニークID
    media_type: ThreadsMediaType; // メディアの種類
    media_url?: string; // 画像や動画のURL（TEXTタイプ以外の場合）
    permalink: string; // Threads上の投稿URL (https://www.threads.net/...)
    username: string; // 投稿者のユーザー名
    text?: string; // 投稿の本文
    timestamp: string; // 投稿日時 (ISO 8601フォーマット 例: "2026-06-25T12:00:00+0000")
    profile_picture_url?: string; // 投稿者のプロフィール画像URL
}

export interface ThreadsReplyObject extends ThreadsMediaObject {
    parentPostText: string; // 返信先の投稿本文
}

const QUERY_FIELDS =
    "id,media_type,media_url,permalink,owner,text,timestamp,username,profile_picture_url,children";

// 自分のThreads投稿一覧を取得するAPI
app.get("/api/my-threads", async (c) => {
    const token = c.env.THREADS_ACCESS_TOKEN;

    if (!token) {
        console.error("アクセストークンが設定されていません。");
        return c.json({ error: "アクセストークンが設定されていません。" }, 500);
    }

    // 取得したいフィールドをカンマ区切りで指定
    const fields = QUERY_FIELDS;
    const url = `https://graph.threads.net/v1.0/me/threads?fields=${fields}&access_token=${token}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Threads API エラー:", errorData);
            return c.json(
                {
                    error: "Threads API エラー",
                    details: errorData,
                },
                response.status as ContentfulStatusCode,
            );
        }

        // Threads API からのレスポンス（data配列の中に投稿が入っている）
        const result = (await response.json()) as {
            data: ThreadsMediaObject[];
        };
        console.log("取得した投稿データ:", result.data);

        return c.json({
            success: true,
            posts: result.data,
        });
    } catch (error) {
        console.error("通信エラー:", error);
        return c.json({ error: "通信に失敗しました。", details: error }, 500);
    }
});

app.get("/api/all-external-replies", async (c) => {
    const token = c.env.THREADS_ACCESS_TOKEN;
    const myUsername = c.env.MY_THREADS_USERNAME;

    if (!token || !myUsername) {
        return c.json(
            { error: "環境変数（TOKENまたはUSERNAME）が設定されていません。" },
            500,
        );
    }

    try {
        // 1. 自分の直近の投稿一覧を取得（上限は必要に応じて limit=10 などで調整してください）
        const mediaUrl = `https://graph.threads.net/v1.0/me/threads?fields=id,text&access_token=${token}&limit=10`;
        const mediaResponse = await fetch(mediaUrl);

        if (!mediaResponse.ok) {
            return c.json(
                { error: "投稿一覧の取得に失敗しました" },
                mediaResponse.status as ContentfulStatusCode,
            );
        }

        const mediaResult = (await mediaResponse.json()) as {
            data: ThreadsMediaObject[];
        };
        const myPosts = mediaResult.data;

        // 2. 各投稿の「会話（返信一覧）」を Promise.all で並列に取得する
        const fields = `${QUERY_FIELDS}`;

        const replyPromises = myPosts.map(async (post) => {
            const convUrl = `https://graph.threads.net/v1.0/${post.id}/conversation?fields=${fields}&access_token=${token}`;
            const convResponse = await fetch(convUrl);

            if (!convResponse.ok) return []; // エラーが起きた投稿は空配列を返してスキップ

            const convResult = (await convResponse.json()) as {
                data: ThreadsMediaObject[];
            };

            // 3. 各会話の中で「元の投稿（自分）」や「自分の返信」を除外し、他人の返信だけにする
            // ※ Threads APIのconversationは元の親投稿や自分の返信も含まれるため、usernameでフィルターします
            const externalReplies = convResult.data.filter(
                (reply) => reply.username !== myUsername,
            );

            // フロントエンドで扱いやすいように、どの投稿に対する返信（parentPostId）かも紐付けておく
            return externalReplies.map((reply) => ({
                ...reply,
                parentPostText: post.text || "", // 親投稿の本文を追加
            }));
        });

        // すべての並列処理が終わるのを待つ
        const nestedReplies = await Promise.all(replyPromises);

        // 二次元配列を一次元の平坦な配列に変換（フラット化）
        const allExternalReplies = nestedReplies.flat();

        // 4. タイムスタンプが新しい順にソートして返す
        allExternalReplies.sort(
            (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
        );

        console.log("取得した返信データ:", allExternalReplies);

        return c.json({
            success: true,
            count: allExternalReplies.length,
            replies: allExternalReplies,
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: "サーバー内部エラーが発生しました。" }, 500);
    }
});

export default app;

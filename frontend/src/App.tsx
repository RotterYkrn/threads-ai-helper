import { useState } from "react";

// === GLOBALS & CONFIG ===
// 実際の本番環境では Cloudflare Workers のAPIエンドポイントを指定します
const API_ENDPOINT = "/api/threads/posts";

// === MOCK THREADS POSTS DATA ===
// 各アカウントの投稿データ（Threads Graph APIから返ってくるレスポンス形式を模しています）
const MOCK_THREADS_POSTS = {
    act_01: [
        {
            id: "post_101",
            username: "rei_romance_agency",
            nickname: "麗 🎀 恋愛相談アドバイザー",
            avatarColor: "from-pink-500 to-rose-500",
            text: "最近「連絡が減った＝冷めた」って悩む子多すぎ問題。男性の連絡頻度は、信頼と安心のバロメーターだよ。不安になって追撃LINEする前に、まずは自分の時間を楽しむこと！これ鉄則。 #恋愛相談 #恋愛迷子",
            media_url: null,
            like_count: 142,
            reply_count: 24,
            repost_count: 12,
            timestamp: "2026-06-24T15:10:00Z",
        },
        {
            id: "post_102",
            username: "rei_romance_agency",
            nickname: "麗 🎀 恋愛相談アドバイザー",
            avatarColor: "from-pink-500 to-rose-500",
            text: "溺愛される子がやってる「可愛いわがまま」のコツ、知りたい人いる？反応多かったら夜にスレッドでまとめます。いいねで教えてねん✨",
            media_url:
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60", // Unsplashのプレースホルダイメージ
            like_count: 389,
            reply_count: 56,
            repost_count: 45,
            timestamp: "2026-06-24T08:30:00Z",
        },
    ],
    act_02: [
        {
            id: "post_201",
            username: "miku_p_girls",
            nickname: "みく 🍼 寂しがり女子",
            avatarColor: "from-purple-500 to-indigo-500",
            text: "今日もお仕事お疲れ様でしたっ。みくはこれからお部屋の片付けするよ〜。誰か通話しながら応援してくれませんか？🥺 DM待ってます…！",
            media_url: null,
            like_count: 95,
            reply_count: 18,
            repost_count: 3,
            timestamp: "2026-06-24T16:05:00Z",
        },
        {
            id: "post_202",
            username: "miku_p_girls",
            nickname: "みく 🍼 寂しがり女子",
            avatarColor: "from-purple-500 to-indigo-500",
            text: "寂しすぎてお腹すいた（？）ので深夜のラーメンテロ。だれか一緒に食べよー？🍜",
            media_url:
                "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
            like_count: 210,
            reply_count: 31,
            repost_count: 8,
            timestamp: "2026-06-23T23:15:00Z",
        },
    ],
    act_03: [
        {
            id: "post_301",
            username: "yuki_secret_night",
            nickname: "ゆき 🥂 裏垢/秘密のオアシス",
            avatarColor: "from-amber-500 to-orange-500",
            text: "金曜の夜ってなんでこんなに人肌恋しくなるんだろ。普段は言えない秘密の話、ここでだけこっそりしよ？大人の相談室、DMでひっそり受付中…🍸",
            media_url: null,
            like_count: 73,
            reply_count: 12,
            repost_count: 2,
            timestamp: "2026-06-24T17:20:00Z",
        },
    ],
};

const ACCOUNTS = [
    {
        id: "act_01",
        username: "rei_romance_agency",
        nickname: "麗 🎀 恋愛相談アドバイザー",
    },
    {
        id: "act_02",
        username: "miku_p_girls",
        nickname: "みく 🍼 寂しがり女子",
    },
    {
        id: "act_03",
        username: "yuki_secret_night",
        nickname: "ゆき 🥂 裏垢/秘密のオアシス",
    },
];

export default function App() {
    const [selectedAccountId, setSelectedAccountId] = useState<
        "act_01" | "act_02" | "act_03"
    >("act_01");
    const [posts, setPosts] = useState(MOCK_THREADS_POSTS["act_01"]);
    const [isFetching, setIsFetching] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    // Threads APIから投稿データを取得する処理をシミュレート
    const handleFetchPosts = () => {
        setIsFetching(true);

        // APIフェッチの擬似遅延（1秒）
        setTimeout(() => {
            const fetchedPosts = MOCK_THREADS_POSTS[selectedAccountId] || [];
            setPosts(fetchedPosts);
            setIsFetching(false);
            showToast(
                `@${ACCOUNTS.find((a) => a.id === selectedAccountId)!.username} の投稿を同期しました`,
            );
        }, 1000);
    };

    // アカウント切り替え時の処理
    const handleAccountChange = (accountId: "act_01" | "act_02" | "act_03") => {
        setSelectedAccountId(accountId);
        // 切り替え直後は一旦リストを空にして、ユーザーに「取得」を促すか、自動ロードさせる
        setPosts(MOCK_THREADS_POSTS[accountId] || []);
        showToast(`アカウントを切り替えました`);
    };

    // 日付フォーマット変換
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    const activeAccount = ACCOUNTS.find((a) => a.id === selectedAccountId)!;

    return (
        <div className="min-h-screen bg-black text-slate-100 font-sans flex flex-col items-center">
            {/* HEADER */}
            <header className="w-full max-w-2xl border-b border-zinc-800 bg-black/80 backdrop-blur sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/* Threads Logo Icon (CSS/SVG) */}
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-black text-lg">
                        @
                    </div>
                    <div>
                        <h1 className="text-md font-bold text-white">
                            Threads Post Viewer
                        </h1>
                        <p className="text-[10px] text-zinc-500">
                            Threads API 投稿同期・表示テスト
                        </p>
                    </div>
                </div>

                {/* Account Selector */}
                <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
                    <span className="text-xs text-zinc-400 font-medium">
                        運用垢:
                    </span>
                    <select
                        value={selectedAccountId}
                        onChange={(e) =>
                            handleAccountChange(
                                e.target.value as
                                    | "act_01"
                                    | "act_02"
                                    | "act_03",
                            )
                        }
                        className="bg-transparent text-xs border-0 text-white focus:ring-0 cursor-pointer font-semibold py-0 pr-8 pl-0"
                    >
                        {ACCOUNTS.map((acc) => (
                            <option
                                key={acc.id}
                                value={acc.id}
                                className="bg-zinc-950 text-white"
                            >
                                @{acc.username}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className="fixed bottom-6 z-50 bg-white text-black px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold animate-fade-in-up flex items-center space-x-1">
                    <span>✨</span>
                    <span>{toast}</span>
                </div>
            )}

            {/* MAIN CONTAINER */}
            <main className="w-full max-w-2xl flex-1 px-4 py-6 flex flex-col">
                {/* Profile Card & Fetch Trigger */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-tr 
                              from-zinc-700 to-zinc-600 flex items-center justify-center font-bold text-lg text-white`}
                        >
                            {activeAccount.nickname[0]}
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">
                                {activeAccount.nickname}
                            </h2>
                            <p className="text-xs text-zinc-400">
                                @{activeAccount.username}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleFetchPosts}
                        disabled={isFetching}
                        className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2.5 rounded-full transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {isFetching ? (
                            <>
                                <svg
                                    className="animate-spin h-3.5 w-3.5 text-black"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>投稿を取得中...</span>
                            </>
                        ) : (
                            <>
                                <span>🔄 APIから最新の投稿を取得</span>
                            </>
                        )}
                    </button>
                </div>

                {/* THREADS POSTS FEED */}
                <div className="flex-1 flex flex-col">
                    <div className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider pl-1">
                        投稿一覧 ({posts.length}件)
                    </div>

                    {posts.length > 0 ? (
                        <div className="space-y-0.5 divide-y divide-zinc-800">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="py-5 flex space-x-3"
                                >
                                    {/* Left Column: Avatar & Connection Line */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-9.5 h-9.5 rounded-full bg-gradient-to-tr ${post.avatarColor} flex items-center justify-center text-xs font-bold text-white shadow-inner`}
                                        >
                                            {post.nickname[0]}
                                        </div>
                                        {/* Threads-like thread connector line */}
                                        <div className="w-0.5 flex-1 bg-zinc-800 my-1"></div>
                                    </div>

                                    {/* Right Column: Post Content & Actions */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center space-x-1.5">
                                                <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                                                    {post.nickname}
                                                </span>
                                                <span className="text-[10px] text-zinc-500">
                                                    @{post.username}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-zinc-500">
                                                {formatDate(post.timestamp)}
                                            </span>
                                        </div>

                                        {/* Post Text */}
                                        <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-text mb-3">
                                            {post.text}
                                        </p>

                                        {/* Post Media (If exists) */}
                                        {post.media_url && (
                                            <div className="mb-3 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 max-h-72 flex items-center justify-center">
                                                <img
                                                    src={post.media_url}
                                                    alt="Threads Post Attachment"
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        )}

                                        {/* Action Bar (Threads Icons Style) */}
                                        <div className="flex items-center space-x-4 text-zinc-400 text-xs py-1">
                                            {/* Like Action */}
                                            <button className="flex items-center space-x-1 hover:text-rose-500 transition">
                                                <svg
                                                    className="w-4.5 h-4.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                    />
                                                </svg>
                                                <span className="text-[10px]">
                                                    {post.like_count}
                                                </span>
                                            </button>

                                            {/* Reply Action */}
                                            <button className="flex items-center space-x-1 hover:text-sky-400 transition">
                                                <svg
                                                    className="w-4.5 h-4.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    />
                                                </svg>
                                                <span className="text-[10px]">
                                                    {post.reply_count}
                                                </span>
                                            </button>

                                            {/* Repost Action */}
                                            <button className="flex items-center space-x-1 hover:text-emerald-400 transition">
                                                <svg
                                                    className="w-4.5 h-4.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89"
                                                    />
                                                </svg>
                                                <span className="text-[10px]">
                                                    {post.repost_count}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-16 border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
                            <span className="text-3xl mb-2">📭</span>
                            <p className="text-xs">
                                このアカウントの投稿はまだ取得されていません。
                            </p>
                        </div>
                    )}
                </div>

                {/* API STRUCTURE EXPLANATION */}
                <div className="mt-8 p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl">
                    <h3 className="text-xs font-bold text-white mb-2 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                        Threads API のフェッチ仕様 (参考)
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Cloudflare Workers 経由で Threads
                        投稿を取得する際は、Graph API の{" "}
                        <code>/me/threads</code> エンドポイントを使用します。
                        <code>
                            fields=id,text,media_product_type,media_url,timestamp,like_count
                        </code>{" "}
                        をクエリに投げることで、上記のような構造化データが JSON
                        で取得できます。
                    </p>
                </div>
            </main>
        </div>
    );
}

import { useEffect, useEffectEvent, useState } from "react";

import Replies from "./components/apps/Replies";
import TimeLine from "./components/apps/TimeLine";
import type { ThreadsMediaObject, ThreadsReplyObject } from "./types";

export default function App() {
    // const [selectedAccountId, setSelectedAccountId] = useState<
    //     "act_01" | "act_02" | "act_03"
    // >("act_01");
    const [activeTab, setActiveTab] = useState<"posts" | "replies">("posts");

    // データ管理
    const [replies, setReplies] = useState<ThreadsReplyObject[]>([]);
    const [posts, setPosts] = useState<ThreadsMediaObject[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    // Threads APIから投稿データを取得する処理をシミュレート
    const handleFetchPosts = async () => {
        setIsFetching(true);

        const fetchPostsPromise = async () => {
            const fetchedPosts = await fetch(`/api/my-threads`);
            return await fetchedPosts.json();
        };
        const fetchRepliesPromise = async () => {
            const fetchedReplies = await fetch(`/api/all-external-replies`);
            return await fetchedReplies.json();
        };

        const [postsData, repliesData] = await Promise.all([
            fetchPostsPromise(),
            fetchRepliesPromise(),
        ]);

        setPosts(postsData.posts);
        setReplies(repliesData.replies);
        setIsFetching(false);
        showToast(`@${postsData.username} の投稿を同期しました`);
    };

    const initialFetchPosts = useEffectEvent(async () => {
        await handleFetchPosts();
    });

    useEffect(() => {
        // 初回ロード時に自動で投稿を取得する場合はここで呼び出す
        const loadData = async () => {
            await initialFetchPosts(); // 👈 await を挟んで非同期にする
        };

        loadData();
    }, []);

    // タブ切り替え
    const handleTabChange = (tab: "posts" | "replies") => {
        setActiveTab(tab);
    };

    // // アカウント切り替え時の処理
    // const handleAccountChange = (accountId: "act_01" | "act_02" | "act_03") => {
    //     setSelectedAccountId(accountId);
    //     // 切り替え直後は一旦リストを空にして、ユーザーに「取得」を促すか、自動ロードさせる
    //     setPosts(MOCK_THREADS_POSTS[accountId] || []);
    //     showToast(`アカウントを切り替えました`);
    // };

    // const activeAccount = ACCOUNTS.find((a) => a.id === selectedAccountId)!;

    return (
        <div
            className="min-h-screen bg-black text-slate-100 font-sans flex
                flex-col items-center"
        >
            {/* HEADER */}
            <header
                className="w-full max-w-2xl border-b border-zinc-800 bg-black/80
                    backdrop-blur sticky top-0 z-10 px-4 py-4 flex items-center
                    justify-between"
            >
                <div className="flex items-center space-x-2">
                    {/* Threads Logo Icon (CSS/SVG) */}
                    <div
                        className="w-8 h-8 rounded-full bg-white flex
                            items-center justify-center text-black font-black
                            text-lg"
                    >
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
                <div
                    className="flex items-center space-x-2 bg-zinc-900 border
                        border-zinc-800 px-3 py-1.5 rounded-full"
                >
                    <span className="text-xs text-zinc-400 font-medium">
                        運用垢:
                    </span>
                    <select
                        value={posts.length > 0 ? posts[0]!.id : ""}
                        // onChange={(e) =>
                        //     handleAccountChange(
                        //         e.target.value as
                        //             | "act_01"
                        //             | "act_02"
                        //             | "act_03",
                        //     )
                        // }
                        className="bg-transparent text-xs border-0 text-white
                            focus:ring-0 cursor-pointer font-semibold py-0 pr-8
                            pl-0"
                    >
                        {/* {ACCOUNTS.map((acc) => (
                            <option
                                key={acc.id}
                                value={acc.id}
                                className="bg-zinc-950 text-white"
                            >
                                @{acc.username}
                            </option>
                        ))} */}
                    </select>
                </div>
            </header>

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div
                    className="fixed bottom-6 z-50 bg-white text-black px-4
                        py-2.5 rounded-full shadow-lg text-xs font-semibold
                        animate-fade-in-up flex items-center space-x-1"
                >
                    <span>✨</span>
                    <span>{toast}</span>
                </div>
            )}

            {/* MAIN CONTAINER */}
            <main className="w-full max-w-2xl flex-1 px-4 py-6 flex flex-col">
                {/* Profile Card & Fetch Trigger */}
                <div
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl
                        p-5 mb-6 flex flex-col sm:flex-row sm:items-center
                        sm:justify-between gap-4"
                >
                    <div className="flex items-center space-x-3">
                        <div
                            className={`w-12 h-12 rounded-full from-zinc-700
                                to-zinc-600 flex items-center justify-center
                                font-bold text-lg text-white`}
                        >
                            {posts.length > 0 ? posts[0]!.username.at(0) : "?"}
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">
                                @
                                {posts.length > 0
                                    ? posts[0]!.username
                                    : "Unknown"}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={handleFetchPosts}
                        disabled={isFetching}
                        className="bg-white hover:bg-zinc-200 text-black text-xs
                            font-bold px-4 py-2.5 rounded-full transition
                            duration-150 flex items-center justify-center
                            space-x-2 disabled:opacity-50"
                    >
                        {isFetching ? (
                            <>
                                <svg
                                    className="animate-spin h-3.5 w-3.5
                                        text-black"
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

                {/* VIEW TABS (切り替えコントロール) */}
                <div className="flex border-b border-zinc-800 mb-4">
                    <button
                        onClick={() => handleTabChange("posts")}
                        className={`flex-1 py-3 text-sm font-bold border-b-2
                            transition duration-150 ${
                                activeTab === "posts"
                                    ? "border-white text-white"
                                    : `border-transparent text-zinc-500
                                        hover:text-zinc-300`
                            }`}
                    >
                        📝 自分の投稿 ({posts.length})
                    </button>
                    <button
                        onClick={() => handleTabChange("replies")}
                        className={`flex-1 py-3 text-sm font-bold border-b-2
                            transition duration-150 flex justify-center
                            items-center space-x-1.5 ${
                                activeTab === "replies"
                                    ? "border-white text-white"
                                    : `border-transparent text-zinc-500
                                        hover:text-zinc-300`
                            }`}
                    >
                        <span>💬 受信した返信 ({replies.length})</span>
                        {/* {replies.some((r) => r.isHot) && (
                            <span
                                className="w-2 h-2 rounded-full bg-rose-500
                                    animate-ping"
                            ></span>
                        )} */}
                    </button>
                </div>

                {activeTab === "posts" ? (
                    <TimeLine posts={posts} />
                ) : (
                    <Replies replies={replies} />
                )}
            </main>
        </div>
    );
}

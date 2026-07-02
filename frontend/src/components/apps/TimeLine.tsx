import { formatDate } from "@/lib/utils";
import type { ThreadsMediaObject } from "@/types";

type Props = {
    posts: ThreadsMediaObject[];
};

const TimeLine = ({ posts }: Props) => {
    return (
        <>
            {/* THREADS POSTS FEED */}
            <div className="flex-1 flex flex-col">
                <div
                    className="text-xs font-bold text-zinc-400 mb-3 uppercase
                        tracking-wider pl-1"
                >
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
                                        className={`w-9.5 h-9.5 rounded-full
                                            ${post.profile_picture_url ? "bg-cover" : "bg-zinc-600"}
                                            flex items-center justify-center
                                            text-xs font-bold text-white
                                            shadow-inner`}
                                    >
                                        {post.profile_picture_url ? (
                                            <img
                                                src={post.profile_picture_url}
                                                alt={post.username}
                                                className="object-cover w-full
                                                    h-full"
                                            />
                                        ) : (
                                            <span>
                                                {post.username
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    {/* Threads-like thread connector line */}
                                    <div
                                        className="w-0.5 flex-1 bg-zinc-800
                                            my-1"
                                    ></div>
                                </div>

                                {/* Right Column: Post Content & Actions */}
                                <div className="flex-1">
                                    <div
                                        className="flex items-center
                                            justify-between mb-1"
                                    >
                                        <div
                                            className="flex items-center
                                                space-x-1.5"
                                        >
                                            <span
                                                className="text-xs font-bold
                                                    text-white hover:underline
                                                    cursor-pointer"
                                            >
                                                {post.username}
                                            </span>
                                            <span
                                                className="text-[10px]
                                                    text-zinc-500"
                                            >
                                                @{post.owner.id}
                                            </span>
                                        </div>
                                        <span
                                            className="text-[10px]
                                                text-zinc-500"
                                        >
                                            {formatDate(post.timestamp)}
                                        </span>
                                    </div>

                                    {/* Post Text */}
                                    <p
                                        className="text-xs text-zinc-200
                                            leading-relaxed whitespace-pre-wrap
                                            select-text mb-3"
                                    >
                                        {post.text}
                                    </p>

                                    {/* Post Media (If exists) */}
                                    {post.media_url && (
                                        <div
                                            className="mb-3 rounded-xl
                                                overflow-hidden border
                                                border-zinc-800 bg-zinc-950
                                                max-h-72 flex items-center
                                                justify-center"
                                        >
                                            <img
                                                src={post.media_url}
                                                alt="Threads Post Attachment"
                                                className="object-cover w-full
                                                    h-full"
                                            />
                                        </div>
                                    )}

                                    {/* Action Bar (Threads Icons Style) */}
                                    <div
                                        className="flex items-center space-x-4
                                            text-zinc-400 text-xs py-1"
                                    >
                                        {/* Like Action */}
                                        {/* <button
                                                className="flex items-center
                                                    space-x-1
                                                    hover:text-rose-500
                                                    transition"
                                            >
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
                                            </button> */}

                                        {/* Reply Action */}
                                        {/* <button
                                                className="flex items-center
                                                    space-x-1 hover:text-sky-400
                                                    transition"
                                            >
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
                                            </button> */}

                                        {/* Repost Action */}
                                        {/* <button
                                                className="flex items-center
                                                    space-x-1
                                                    hover:text-emerald-400
                                                    transition"
                                            >
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
                                            </button> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="flex-1 flex flex-col items-center
                            justify-center py-16 border border-dashed
                            border-zinc-800 rounded-2xl text-zinc-500"
                    >
                        <span className="text-3xl mb-2">📭</span>
                        <p className="text-xs">
                            このアカウントの投稿はまだ取得されていません。
                        </p>
                    </div>
                )}
            </div>

            {/* API STRUCTURE EXPLANATION */}
            <div
                className="mt-8 p-4 bg-zinc-900/30 border border-zinc-850
                    rounded-xl"
            >
                <h3
                    className="text-xs font-bold text-white mb-2 flex
                        items-center"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                    Threads API のフェッチ仕様 (参考)
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Cloudflare Workers 経由で Threads 投稿を取得する際は、Graph
                    API の <code>/me/threads</code> エンドポイントを使用します。
                    <code>
                        fields=id,text,media_product_type,media_url,timestamp,like_count
                    </code>{" "}
                    をクエリに投げることで、上記のような構造化データが JSON
                    で取得できます。
                </p>
            </div>
        </>
    );
};

export default TimeLine;

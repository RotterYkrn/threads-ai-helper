import { formatDate } from "@/lib/utils";
import type { ThreadsReplyObject } from "@/types";

const Replies = ({ replies }: { replies: ThreadsReplyObject[] }) => {
    return (
        <>
            {replies.length > 0 ? (
                <div
                    className="space-y-0.5 divide-y divide-zinc-800
                        animate-fade-in"
                >
                    {replies.map((reply) => (
                        <div
                            key={reply.id}
                            className="py-5 flex space-x-3 items-start"
                        >
                            {/* Avatar icon of the replying user */}
                            <div
                                className={`w-9.5 h-9.5 rounded-full
                                    ${reply.profile_picture_url ? "bg-cover" : "bg-zinc-600"}
                                    flex items-center justify-center text-xs
                                    font-bold text-white shadow-inner`}
                            >
                                {reply.profile_picture_url ? (
                                    <img
                                        src={reply.profile_picture_url}
                                        alt={reply.username}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span>
                                        {reply.username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                <div
                                    className="flex items-center justify-between
                                        mb-1"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className="text-xs font-bold
                                                text-white hover:underline
                                                cursor-pointer"
                                        >
                                            @{reply.username}
                                        </span>

                                        {/* Hot Label for Target Tracking */}
                                        {/* {reply.isHot && (
                                            <span
                                                className="bg-rose-950/80
                                                    text-rose-300 border
                                                    border-rose-800 text-[9px]
                                                    font-bold px-1.5 py-0.5
                                                    rounded animate-pulse"
                                            >
                                                見込み🔥
                                            </span>
                                        )} */}
                                    </div>
                                    <span className="text-[10px] text-zinc-500">
                                        {formatDate(reply.timestamp)}
                                    </span>
                                </div>

                                {/* Replying target preview */}
                                <div
                                    className="text-[10px] text-zinc-500
                                        bg-zinc-950 px-2.5 py-1 rounded-lg
                                        border border-zinc-900 inline-block mb-2
                                        max-w-full truncate"
                                >
                                    返信先:{" "}
                                    <span className="italic text-zinc-400">
                                        {reply.parentPostText}
                                    </span>
                                </div>

                                {/* Reply Body Text */}
                                <p
                                    className="text-xs text-zinc-200
                                        leading-relaxed whitespace-pre-wrap
                                        select-text mb-3"
                                >
                                    {reply.text}
                                </p>

                                {/* Reply Interactive Action Bar */}
                                <div className="flex items-center space-x-4">
                                    <button
                                        className="bg-zinc-900 hover:bg-zinc-800
                                            border border-zinc-800 text-zinc-200
                                            text-[10px] font-bold px-3 py-1.5
                                            rounded-full transition flex
                                            items-center space-x-1"
                                    >
                                        <span>📨 DMで返信する</span>
                                    </button>
                                    <button
                                        className="text-zinc-500
                                            hover:text-zinc-300 text-[10px]
                                            font-medium transition"
                                    >
                                        非表示にする
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    className="flex-1 flex flex-col items-center justify-center
                        py-16 border border-dashed border-zinc-800 rounded-2xl
                        text-zinc-500"
                >
                    <span className="text-3xl mb-2">🔔</span>
                    <p className="text-xs">まだ新しい返信通知はありません。</p>
                </div>
            )}
        </>
    );
};

export default Replies;

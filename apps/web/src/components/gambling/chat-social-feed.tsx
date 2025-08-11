"use client";

import { useState } from "react";

export default function ChatSocialFeed() {
  const [activeTab, setActiveTab] = useState("feed");
  const [message, setMessage] = useState("");

  const feedPosts = [
    {
      id: 1,
      user: "Alex Chen",
      username: "@alexc",
      avatar: "AC",
      time: "2 min ago",
      type: "win",
      content:
        "Just hit a 5-leg parlay! Chiefs, Lakers, Arsenal, Yankees, and Cowboys all came through! 🔥",
      amount: 1250,
      likes: 23,
      comments: 8,
      sport: "🏈🏀⚽⚾🏈",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      username: "@sarahj",
      avatar: "SJ",
      time: "15 min ago",
      type: "tip",
      content:
        "Really liking the Lakers spread tonight. They've been covering at home and Warriors on back-to-back. What do you think?",
      likes: 12,
      comments: 15,
      sport: "🏀",
    },
    {
      id: 3,
      user: "Mike Rodriguez",
      username: "@mikerod",
      avatar: "MR",
      time: "32 min ago",
      type: "loss",
      content:
        "Ouch, that Cowboys game hurt. Last-minute field goal killed my under bet. On to the next one! 💪",
      amount: -150,
      likes: 8,
      comments: 12,
      sport: "🏈",
    },
    {
      id: 4,
      user: "Emma Davis",
      username: "@emmad",
      avatar: "ED",
      time: "1 hour ago",
      type: "achievement",
      content:
        "Hit my 10th win in a row! Feeling unstoppable right now. Thanks for all the support everyone! 🎯",
      likes: 45,
      comments: 22,
      badge: "10-Win Streak",
    },
  ];

  const chatMessages = [
    {
      id: 1,
      user: "Alex",
      message: "Anyone else loving this NFL slate today?",
      time: "2:34 PM",
      avatar: "AC",
    },
    {
      id: 2,
      user: "Sarah",
      message: "Chiefs -3.5 looking good to me",
      time: "2:35 PM",
      avatar: "SJ",
    },
    {
      id: 3,
      user: "Mike",
      message: "I'm on the over 54.5 in that game",
      time: "2:36 PM",
      avatar: "MR",
    },
    {
      id: 4,
      user: "Emma",
      message: "Be careful with that total, weather might be an issue",
      time: "2:37 PM",
      avatar: "ED",
    },
    {
      id: 5,
      user: "Tom",
      message: "Good point Emma, checking weather now",
      time: "2:38 PM",
      avatar: "TG",
    },
    {
      id: 6,
      user: "You",
      message: "What about the Lakers game tonight?",
      time: "2:39 PM",
      avatar: "YU",
      isOwn: true,
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl p-6 border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg
            className="w-6 h-6 text-[#00CED1] mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          Community
        </h3>
        <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
              activeTab === "feed"
                ? "bg-[#00CED1] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
              activeTab === "chat"
                ? "bg-[#FFAB91] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Live Chat
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-96 overflow-y-auto">
        {activeTab === "feed" && (
          <div className="space-y-4">
            {feedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {post.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {post.user}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {post.username} • {post.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.sport && (
                      <span className="text-lg">{post.sport}</span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        post.type === "win"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : post.type === "loss"
                            ? "bg-red-500/20 text-red-400"
                            : post.type === "tip"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-violet-500/20 text-violet-400"
                      }`}
                    >
                      {post.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {post.content}
                  </p>
                  {post.amount && (
                    <div
                      className={`mt-2 text-lg font-bold ${
                        post.amount > 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {post.amount > 0 ? "+" : ""}${Math.abs(post.amount)}
                    </div>
                  )}
                  {post.badge && (
                    <div className="mt-2 inline-flex items-center space-x-2 bg-violet-500/20 border border-violet-500/30 rounded-full px-3 py-1">
                      <span className="text-violet-400 font-semibold text-sm">
                        {post.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{post.comments}</span>
                    </button>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 space-y-3 mb-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      msg.isOwn
                        ? "bg-gradient-to-br from-[#FFAB91] to-[#00CED1]"
                        : "bg-gradient-to-br from-slate-600 to-slate-700"
                    }`}
                  >
                    {msg.avatar}
                  </div>
                  <div className={`flex-1 ${msg.isOwn ? "text-right" : ""}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-slate-300 text-sm font-medium">
                        {msg.user}
                      </span>
                      <span className="text-slate-500 text-xs">{msg.time}</span>
                    </div>
                    <div
                      className={`inline-block px-3 py-2 rounded-2xl text-sm ${
                        msg.isOwn
                          ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white"
                          : "bg-slate-800/70 text-slate-200"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Input (only show in chat tab) */}
      {activeTab === "chat" && (
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <div className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800/50 border border-slate-600 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00CED1] placeholder-slate-400"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Online Users (chat tab only) */}
      {activeTab === "chat" && (
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>47 users online</span>
          </div>
        </div>
      )}
    </div>
  );
}

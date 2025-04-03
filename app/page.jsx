"use client";

import { useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");

  const handleLoad = async () => {
    setLoading(true);
    const tidMatch = url.match(/tid=(\d+)/);
    if (!tidMatch) return alert("tid が URL に含まれていません");
    const tid = tidMatch[1];

    let finalTitle = "";
    const allPosts = [];
    for (let tp = 50; tp >= 1; tp--) {
      const res = await fetch(`/api/bakusai?tid=${tid}&tp=${tp}`);
      const data = await res.json();
      if (data.posts.length === 0) break;
      if (!finalTitle && data.title) finalTitle = data.title;
      allPosts.push(...data.posts);
    }

    setTitle(finalTitle);
    setPosts(allPosts.reverse());
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: 10 }}>
        爆サイスーパービューア（完全版）
      </h1>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="スレURLを貼ってください"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleLoad} disabled={loading}>
          {loading ? "読み込み中…" : "読み込む"}
        </button>
      </div>
      {title && <h2 style={{ marginTop: 20 }}>🧵 {title}</h2>}
      <div style={{ whiteSpace: "pre-wrap", fontSize: "14px", marginTop: 10 }}>
        {posts.map((post, idx) => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <div style={{ color: "#888", fontSize: "12px" }}>
              {post.num} {post.date}
            </div>
            <div dangerouslySetInnerHTML={{ __html: post.msg }} />
          </div>
        ))}
      </div>
    </div>
  );
}

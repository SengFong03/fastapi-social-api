// src/components/Post.jsx
import { useState } from "react"; // 👈 记得引入 useState
import toast from "react-hot-toast";
import axios from "axios";

function Post({ post, onDelete, token }) {
  const [postData, setPostData] = useState(post.Post); // 把 props 转成 state，因为我们要修改它
  const votes = post.votes;

  // 👇 新的状态：我是不是正在编辑中？
  const [isEditing, setIsEditing] = useState(false);

  // 👇 临时存放修改内容的盘子
  const [editTitle, setEditTitle] = useState(postData.title);
  const [editContent, setEditContent] = useState(postData.content);

  // 删除逻辑 (不变)
  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/posts/${postData.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Post deleted successfully!");
      onDelete(postData.id);
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  // 💾 保存逻辑 (新!)
  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    try {
      // 1. 发送 PUT 请求
      await axios.put(`http://127.0.0.1:8000/posts/${postData.id}/`, {
        title: editTitle,
        content: editContent,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Post updated successfully!");

      // 2. 更新本地显示的数据
      setPostData({ ...postData, title: editTitle, content: editContent });

      // 3. 退出编辑模式
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Failed to update post");
    }
  };

  return (
    <div className="post-card" style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        {/* ✏️ Edit 按钮 (如果是编辑模式，就不显示 Edit 按钮) */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: "#f0f0f0",
              border: "1px solid #ddd",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        )}

        {/* 🗑️ Delete 按钮 (只有在非编辑模式下才显示，防止误删) */}
        {!isEditing && (
          <button
            onClick={handleDeleteClick}
            style={{
              background: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        )}
      </div>

      {/* 👇 核心魔法：如果是编辑模式，显示输入框；否则显示普通文字 */}
      {isEditing ? (
        // === 编辑模式 UI ===
        <div style={{ marginTop: "20px" }}>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{
              display: "block",
              width: "90%",
              padding: "8px",
              marginBottom: "10px",
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{
              display: "block",
              width: "90%",
              padding: "8px",
              minHeight: "80px",
              fontFamily: "inherit",
            }}
          />
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button
              onClick={handleSave}
              style={{
                background: "black",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                background: "transparent",
                border: "1px solid #ccc",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // === 浏览模式 UI ===
        <>
          <h2 className="post-title">{postData.title}</h2>
          <p
            style={{ fontSize: "0.8rem", color: "#999", marginBottom: "10px" }}
          >
            📅 {new Date(postData.created_at).toLocaleDateString()}
          </p>
          <p
            className="post-content"
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: "1.5",
              color: "#4a5568",
            }}
          >
            {postData.content}
          </p>
        </>
      )}

      <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "10px" }}>
        👍 Likes: {votes}
      </div>
    </div>
  );
}

export default Post;

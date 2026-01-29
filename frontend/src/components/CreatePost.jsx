// src/components/CreatePost.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

// 👇 注意这里接收了一个叫 onPostCreated 的道具(prop)
// 这是父组件给我们的“对讲机”，发帖成功了就用它通知父组件
function CreatePost({ onPostCreated, token }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    try {
      // TODO: change owner_id to current logged in user id
      // 发送请求 (owner_id=1 是暂时的作弊写法)
      const response = await axios.post("https://fastforum-backend.onrender.com/posts/", {
        title: title,
        content: content,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post created successfully!");

      // 🎉 成功了！调用父组件给的函数，把新数据传回去
      // 注意：这里我们得手动补上 votes: 0，因为后端返回的只有 Post 信息
      const newPostWrapper = { Post: response.data, votes: 0 };
      onPostCreated(newPostWrapper);

      // 清空输入框
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    }
  };

  return (
    // 👇 看这里！直接用 className，删掉那堆 style
    <div className="post-card">
      <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Create a Post</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field" // 👈 用 CSS 类
          />
        </div>

        <div>
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-field" // 👈 用 CSS 类
            style={{
              minHeight: "100px",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreatePost;

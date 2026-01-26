// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import CreatePost from "./components/CreatePost";
import Post from "./components/Post";
import Login from "./components/Login"; // 👈 新增
import Register from "./components/Register"; // 👈 新增
import { Toaster, toast } from "react-hot-toast"; // 👈 记得引入 toast 用于登出提示

function App() {
  const [posts, setPosts] = useState([]);

  // 🔐 1. 状态管理：检查有没有 Token，以及是否在注册页面
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isRegistering, setIsRegistering] = useState(false);

  const [view, setView] = useState("feed");

  // 📡 获取帖子列表 (这个可以公开，不需要 Token也能看)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/posts");
        // console.log("数据拿到啦:", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("出错了:", error);
        toast.error("无法连接到服务器");
      }
    };
    fetchData();
  }, []);

  // ✅ 登录成功处理函数
  const handleLoginSuccess = (accessToken) => {
    localStorage.setItem("token", accessToken); // 存进浏览器
    setToken(accessToken); // 更新状态，React 会自动刷新界面
    setView("feed");
  };

  // 🚪 登出处理函数
  const handleLogout = () => {
    localStorage.removeItem("token"); // 清除浏览器缓存
    setToken(null); // 清空状态
    toast.success("Logged out successfully");
  };

  // ➕ 新增帖子处理
  const handleNewPost = (newPostWrapper) => {
    setPosts([newPostWrapper, ...posts]);
  };

  // 🗑️ 删除帖子处理
  const handleRemovePost = (deletedId) => {
    const updatedPosts = posts.filter((item) => item.Post.id !== deletedId);
    setPosts(updatedPosts);
  };

  return (
    <div className="feed-container">
      <Toaster position="top-center" />

      {/* === 顶部导航栏 (Navbar) === */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "600px",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #eee", // 加条线更好看
          paddingBottom: "10px",
        }}
      >
        {/* 点击标题，无脑回首页 */}
        <h1
          style={{ color: "#333", margin: 0, cursor: "pointer" }}
          onClick={() => setView("feed")}
        >
          FastForum
        </h1>

        {/* 👇 右上角按钮逻辑 */}
        {token ? (
          // 如果已登录 -> 显示 Logout
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              background: "#eee",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Logout
          </button>
        ) : (
          // 如果没登录 -> 显示 Login 按钮
          // 只有在 'feed' 模式下才显示 Login 按钮 (不然在登录页显示Login按钮很怪)
          view === "feed" && (
            <button
              onClick={() => setView("login")} // 👈 点击切换视图
              style={{
                padding: "8px 16px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Login
            </button>
          )
        )}
      </div>

      {/* === 主内容区 (根据 view 切换) === */}

      {/* 1. 登录视图 */}
      {view === "login" && !token && (
        <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
          <Login
            onLogin={handleLoginSuccess}
            onSwitchToRegister={() => setView("register")} // 切去注册
          />
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            <span
              onClick={() => setView("feed")}
              style={{ cursor: "pointer", color: "#666" }}
            >
              ← Back to Feed
            </span>
          </p>
        </div>
      )}

      {/* 2. 注册视图 */}
      {view === "register" && !token && (
        <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
          <Register
            onSwitchToLogin={() => setView("login")} // 切回登录
          />
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            <span
              onClick={() => setView("feed")}
              style={{ cursor: "pointer", color: "#666" }}
            >
              ← Back to Feed
            </span>
          </p>
        </div>
      )}

      {/* 3. 帖子流视图 (Feed) */}
      {view === "feed" && (
        <>
          {/* 如果登录了，显示发帖框 */}
          {token && <CreatePost onPostCreated={handleNewPost} token={token} />}

          {/* 所有人都能看到帖子列表 */}
          {posts.length === 0 ? (
            <p style={{ textAlign: "center" }}>Loading posts...</p>
          ) : (
            posts.map((item) => (
              <Post
                key={item.Post.id}
                post={item}
                onDelete={handleRemovePost}
                token={token}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}

export default App;

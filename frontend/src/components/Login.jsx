// src/components/Login.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// 👇 新增 onSwitchToRegister 属性
function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⚠️ 重点：FastAPI OAuth2 必须用 FormData 且 key 必须是 "username"
    const formData = new FormData();
    formData.append("username", email); 
    formData.append("password", password);

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", formData);
      onLogin(response.data.access_token);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error("Login failed, please check your credentials");
    }
  };

  return (
    <div className="post-card">
      <h2 style={{marginTop: 0}}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email" placeholder="Email" className="input-field"
          value={email} onChange={(e) => setEmail(e.target.value)} required
        />
        <input
          type="password" placeholder="Password" className="input-field"
          value={password} onChange={(e) => setPassword(e.target.value)} required
        />
        <button
          type="submit"
          style={{
            width: "100%", padding: "12px", background: "black", color: "white",
            border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>

      {/* 👇 切换到注册的按钮 */}
      <p style={{marginTop: '15px', textAlign: 'center', fontSize: '0.9rem'}}>
        Don't have an account?{" "}
        <span 
          onClick={onSwitchToRegister} 
          style={{color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}
        >
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
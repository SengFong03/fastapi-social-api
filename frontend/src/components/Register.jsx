// src/components/Register.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 假设你的后端注册接口是 /users/
      await axios.post("https://fastforum-backend.onrender.com/users/", {
        email: email,
        password: password,
      });

      toast.success("Registration successful! Please log in.");
      // 🎉 注册完，直接跳去登录页
      onSwitchToLogin(); 

    } catch (error) {
      console.error(error);
      // 如果后端返回 "Email already registered"，这里会显示
      toast.error("Registration failed, email may already be registered");
    }
  };

  return (
    <div className="post-card">
      <h2 style={{marginTop: 0}}>Create Account</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            width: "100%", padding: "12px", background: "black", color: "white",
            border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer"
          }}
        >
          Sign Up
        </button>
      </form>
      
      {/* 👇 切换到登录的按钮 */}
      <p style={{marginTop: '15px', textAlign: 'center', fontSize: '0.9rem'}}>
        Already have an account?{" "}
        <span 
          onClick={onSwitchToLogin} 
          style={{color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}
        >
          Login here
        </span>
      </p>
    </div>
  );
}

export default Register;
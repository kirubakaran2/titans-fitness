import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
import eyeImage from '../img/eye.png';
import brand from '../img/brand.png';
import insta from '../img/insta.png';
import whatsapp from '../img/whatsapp.png';
import tele from '../img/location.png';
import codeby from '../img/codebuilders.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [loading, setLoading] = useState(false); // Loading state

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleLogin = async () => {
    setLoading(true); 
    try {
      const response = await axios.post('https://titan-api-v2uu.onrender.com/login', { email, password });
      const authToken = response.data.token;
      setToken(authToken);
      sessionStorage.setItem('token', authToken);
      toast.success('Login successful');
      window.location.href = '/Dashboard';
    } catch (error) {
      console.error('Error logging in', error);
      toast.error('Error logging in');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      window.location.href = '/Dashboard';
    }
  }, [token]);
  return (
    <div>
      <ToastContainer />
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="example@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={eyeImage}
                alt="Toggle Password Visibility"
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <button className="login-button" onClick={handleLogin}>Login</button>
        </div>
      </div>
      <footer className="footer-container">
  <div className="footer-footer">
    <div className="footer-col">
      <img src={brand} alt="Tshirt12439" className="footer-tshirt12" />
      <span className="footer-text">
        <span>Unleash Your Inner Titan at Titans Fitness Gym -</span>
        <br />
        <span>Where Strength Meets Passion!</span>
      </span>
      <button className="rounded-full border border-white bg-70AB0E-800 px-8 mt-5 py-3 flex items-center justify-center text-white">
        Drop a line
      </button>
    </div>
    <div className="footer-col1">
      <div className="footer-row">
        <div className="footer-col2">
          <span className="footer-text09">Contact</span>
          <div className="footer-list">
            <a href="tel:+918489135973">+91 8489135973</a>
            <a href="tel:+919043931098">+91 9043931098</a>
            <a href="mailto:thetitanfitnessstudio@gmail.com">thetitanfitnessstudio@gmail.com</a>
          </div>
          <div className="flex flex-col items-center mt-5">
        <a href="https://www.codebuilders.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mb-2">
          www.codebuilders.in
        </a>
        <div className="flex items-center">
          <span>Powered by</span>
          <img src="https://www.codebuilders.in/img/code-builders-logo.svg" alt="Powered by" className="w-20 h-20 ml-2" />
        </div>
      </div>
        </div>
        <div className="lg:w-1/2">
          <div className="flex flex-col p-5">
            <p className="text-sm text-70AB0E-800 mb-5">FOLLOW US</p>
            <div className="flex items-center space-x-4">
              <a href="https://www.instagram.com/the_titans_fitness_studio?igsh=MWNmODMwcTFoZDhjdQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <img src={insta} alt="Instagram" className="w-10 h-10" />
              </a>
              <a href="https://wa.me/919043931098" target="_blank" rel="noopener noreferrer">
                <img src={whatsapp} alt="WhatsApp" className="w-10 h-10" />
              </a>
              <a href="https://maps.app.goo.gl/bmQFcQ2PV89kd2Px6?g_st=iw" target="_blank" rel="noopener noreferrer">
                <img src={tele} alt="Location" className="w-10 h-10" />
              </a>
            </div>
            <p className="text-black text-lg font-bold mt-5">We accept all major cards and UPI transactions.</p>
          </div>
        </div>
      </div>
      <span>© 2023 — Copyright</span>
    </div>
  </div>
</footer>
    </div>
  );
}

export default Login;

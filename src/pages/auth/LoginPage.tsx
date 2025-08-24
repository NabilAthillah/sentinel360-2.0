'use client'
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";


const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="max-w-screen w-full h-screen bg-[#181D26] flex flex-col justify-center items-center gap-20 lg:gap-32 px-5 sm:px-0">

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {/* Logo */}
      <img
        src="/images/logo.png"
        alt="App Logo"
        className="max-w-60 w-full"
      />

      {/* Form */}
      <form className="max-w-[400px] w-full flex flex-col gap-6">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 pt-[17.5px] pb-[10.5px] text-[#F4F7FF] text-base bg-[#222834] border-b-[1px] border-b-[#98A1B3] rounded-[4px_4px_0px_0px] placeholder:text-[#98A1B3] placeholder:text-base active:outline-none focus-visible:outline-none"
          required
        />

        {/* Password */}
        <div className="w-full flex items-center bg-[#222834] border-b-[1px] border-b-[#98A1B3] rounded-[4px_4px_0px_0px]">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 pt-[17.5px] pb-[10.5px] bg-[#222834] rounded-[4px_4px_0px_0px] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] placeholder:text-base active:outline-none focus-visible:outline-none"
            placeholder="Masukkan password"
            required
          />
          <button
            type="button"
            onClick={togglePassword}
            className="p-2 rounded-[4px_4px_0px_0px]"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff
                size={20}
                color="#98A1B3"
                style={{ backgroundColor: "#222834", borderRadius: "4px" }}
              />
            ) : (
              <Eye
                size={20}
                color="#98A1B3"
                style={{ backgroundColor: "#222834", borderRadius: "4px" }}
              />
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex justify-center items-center py-4 text-center text-[#181D26] font-medium bg-[#EFBF04] border-[1px] border-[#EFBF04] rounded-full transition-all hover:text-[#EFBF04] hover:bg-[#181D26]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

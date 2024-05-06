import React from "react";

const Login = () => {
  return (
    <>
    <div className="w-screen h-screen bg-yellow-100">
      <div className="h-screen max-w-md bg-white text-center m-auto py-16">
        <div className="text-3xl text-black">Welcome to feedonymous</div>
        <div className="m-auto px-4 my-28">
          <div className="border border-gray-400 rounded-2xl px-4 py-2 mb-4 text-black">
            Login With Google
          </div>
          <div className="border border-gray-400 rounded-2xl px-4 py-2 mb-4">
            Login With Facebook
          </div>
          <div className="border border-gray-400 rounded-2xl px-4 py-2 mb-4">
            Login With Twitter
          </div>
          <div className="border border-gray-400 rounded-2xl px-4 py-2 mb-4">
            Login With GitHub
          </div>
          <div className="border border-gray-400 rounded-2xl px-4 py-2 mb-4">
            Login With LinkedIn
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Login;

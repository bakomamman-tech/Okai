// client/src/App.jsx
import React from "react";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-okaiGray">
      <h1 className="text-5xl font-bold text-okaiBlue mb-4">Welcome to Okai</h1>
      <p className="text-lg text-okaiDark mb-6">
        Your world-class social app, built with love in Nigeria 🇳🇬
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="bg-okaiBlue text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Log In
        </a>
        <a
          href="/register"
          className="bg-white text-okaiBlue border border-okaiBlue px-6 py-2 rounded hover:bg-gray-200"
        >
          Register
        </a>
      </div>
    </div>
  );
};

export default App;

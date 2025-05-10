import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Select Form Type</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/sv-engineering-invoice-app/invoice1")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          SV Engineering Invoice Form
        </button>
        <button
          onClick={() => navigate("/sv-engineering-invoice-app/invoice2")}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Engineering Invoice Form
        </button>
      </div>
    </div>
  );
};

export default Home;

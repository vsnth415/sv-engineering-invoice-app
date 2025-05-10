import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceFormSVEngineering from "./components/InvoiceFormSVEngineering";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sv-engineering-invoice-app/" element={<Home />} />
        <Route
          path="/sv-engineering-invoice-app/invoice1"
          element={<InvoiceForm />}
        />
        <Route
          path="/sv-engineering-invoice-app/invoice2"
          element={<InvoiceFormSVEngineering />}
        />
      </Routes>
    </Router>
  );
}

export default App;

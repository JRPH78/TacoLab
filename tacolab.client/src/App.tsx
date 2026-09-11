import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
// import Option from "./pages/Home/Option2";
// import Option from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <main className="app">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </main>
  );
}

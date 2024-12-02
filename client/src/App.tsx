import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<TaskList />} path="/tasks" />
        </Routes>

      </Router>
    </>
  );
}

export default App;

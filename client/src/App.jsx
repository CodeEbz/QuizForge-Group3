import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SubjectSelection from "./pages/SubjectSelection";
import DifficultySelection from "./pages/DifficultySelection";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Leaderboard from "./pages/Leaderboard";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />

        <Route path="/auth" element={<Auth />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/quiz-menu" element={<SubjectSelection />} />

        <Route
          path="/difficulty/:subject"
          element={<DifficultySelection />}
        />

        <Route
          path="/quiz/:subject/:difficulty"
          element={<Quiz />}
        />

        <Route path="/score" element={<Result />} />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        <Route
          path="/statistics"
          element={<Statistics />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

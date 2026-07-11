import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuizMenu from "./pages/QuizMenu";
import DifficultySelection from "./pages/Difficulty";
import Leaderboard from "./pages/Leaderboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/quiz-menu" element={<QuizMenu />} />
        <Route path="/difficulty/:subject" element={<DifficultySelection />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

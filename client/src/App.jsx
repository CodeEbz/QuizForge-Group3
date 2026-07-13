import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth";
import DashboardPage from "./pages/Dashboard";
import QuizMenu from "./pages/QuizMenu";
import DifficultySelection from "./pages/Difficulty";
import QuizPage from "./pages/QuizPage";
import ScorePage from "./pages/ScorePage";
import Leaderboard from "./pages/Leaderboard";
import Statistics from "./pages/Statistics";
import ProfilePage from "./pages/Profile";
import HistoryPage from "./pages/History";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quiz-menu" element={<QuizMenu />} />
        <Route path="/difficulty/:subject" element={<DifficultySelection />} />
        <Route path="/quiz/:subject/:difficulty" element={<QuizPage />} />
        <Route path="/score" element={<ScorePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

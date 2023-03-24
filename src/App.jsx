import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "./context/profile-context";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import './styles/main.scss';
import "rsuite/dist/rsuite.min.css";

function App() {
  return (
  <BrowserRouter>
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </ProfileProvider>
  </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "./context/profile-context";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import './styles/main.scss';
import "rsuite/dist/rsuite.min.css";
import Chat from "./pages/Chat";
import FourOFour from "./pages/404";

function App() {
  return (
  <BrowserRouter>
    <ProfileProvider>
      <Routes>
        <Route exact path="/" element={<Home />}>
          <Route exact path="/chat/:chatId" element={<Chat />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/*" element={<FourOFour />} />
      </Routes>
    </ProfileProvider>
  </BrowserRouter>
  )
}

export default App

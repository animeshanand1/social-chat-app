
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Profile from './components/Page/Profile';
import About from './components/Page/About';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ChatUi from './components/Page/ChatUi';
// import AccountPage from './components/Page/MyAccout';
import ProfileCard from './components/SuggestedCards/SuggestCard';
import Suggested from './components/Page/Suggested';
import FriendsPage from './components/Page/Friends/FriendsPage';
import VisitProfile from './components/Page/VisitProfile';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <div className="App">
        <Navbar className='navbar-holder' />
        <Routes>
          <Route path="/message/:receiptId" element={<ChatUi/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/explore" element={<Suggested />} />
          <Route path="/visitProfile/:id" element={<VisitProfile />} />
          <Route path="/connections" element={<FriendsPage />} />
         
        </Routes>
      </div>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

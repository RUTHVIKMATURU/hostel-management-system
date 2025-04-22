
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import StudentLogin from './components/StudentLogin';
import Home from './components/Home';
import Announcements from './components/Announcements';
import Complaints from './components/Complaints';
import Outpass from './components/Outpass';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Navigate to="/login" replace />} />
                    <Route path="login" element={<StudentLogin />} />
                    <Route path="signup" element={<StudentSignup />} />
                    <Route path="home" element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />
                    <Route path="announcements" element={
                        <PrivateRoute>
                            <Announcements />
                        </PrivateRoute>
                    } />
                    <Route path="complaints" element={
                        <PrivateRoute>
                            <Complaints />
                        </PrivateRoute>
                    } />
                    <Route path="outpass" element={
                        <PrivateRoute>
                            <Outpass />
                        </PrivateRoute>
                    } />
                    <Route path="profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                </Route>
            </Routes>
        </Router>
    );
};

export default App

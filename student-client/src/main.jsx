import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/darkTheme.css';
import './styles/AnnouncementStyles.css';
import './styles/ProfileStyles.css';
import './styles/ComplaintStyles.css';
import './styles/OutpassStyles.css';
import './styles/LoginStyles.css';
import './styles/SignupStyles.css';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import PrivateRoute from './components/PrivateRoute.jsx';

import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import StudentLogin from './components/StudentLogin.jsx';
import StudentSignup from './components/StudentSignup.jsx';
import Announcement from './components/Announcement.jsx';
import Community from './components/Community.jsx';
import Complaints from './components/Complaints.jsx';
import Outpass from './components/Outpass.jsx';
import StudentProfile from './components/StudentProfile.jsx';
import TodayAnnouncements from './components/TodayAnnouncements.jsx';
import AllAnnouncements from './components/AllAnnouncements.jsx';
import AnnouncementDetail from './components/AnnouncementDetail.jsx';
import OutpassPage from './components/OutpassPage.jsx';
import OutpassList from './components/OutpassList.jsx';
import PostComplaint from './components/PostComplaints.jsx';
import ComplaintsList from './components/ComplaintsList.jsx';

const browserRouterObj = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />
      },
      {
        path: 'login',
        element: <StudentLogin />
      },
      {
        path: 'signup',
        element: <StudentSignup />
      },
      {
        path: 'home',
        element: <PrivateRoute><Home /></PrivateRoute>
      },
      {
        path: 'announcements',
        element: <PrivateRoute><Announcement /></PrivateRoute>,
        children: [
          { path: 'today', element: <TodayAnnouncements /> },
          { path: 'all', element: <AllAnnouncements /> }
        ]
      },
      {
        path: 'announcements/:id',
        element: <PrivateRoute><AnnouncementDetail /></PrivateRoute>
      },
      {
        path: 'complaints',
        element: <PrivateRoute><Complaints /></PrivateRoute>,
        children: [
          { path: 'complaint', element: <PostComplaint /> },
          { path: 'complaint-list', element: <ComplaintsList /> }
        ]
      },
      {
        path: 'outpass',
        element: <PrivateRoute><OutpassPage /></PrivateRoute>
      },
      {
        path: 'profile',
        element: <PrivateRoute><StudentProfile /></PrivateRoute>
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={browserRouterObj} />
    </UserProvider>
  </StrictMode>,
);

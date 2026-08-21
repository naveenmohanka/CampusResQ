import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Incidents } from '../pages/Incidents/Incidents';
import { IncidentDetail } from '../pages/Incidents/IncidentDetail';
import { AlertsPage } from '../pages/Alerts/Alerts';
import { AnalyticsPage } from '../pages/Analytics/Analytics';
import { UsersPage } from '../pages/Users/Users';
import { ActivityLogsPage } from '../pages/ActivityLogs/ActivityLogs';
import { SettingsPage } from '../pages/Settings/Settings';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'incidents',
        element: <Incidents />,
      },
      {
        path: 'incidents/:id',
        element: <IncidentDetail />,
      },
      {
        path: 'alerts',
        element: <AlertsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'activity-logs',
        element: <ActivityLogsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

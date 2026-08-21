import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { IncidentsPage } from '../pages/Incidents/Incidents';
import { IncidentDetail } from '../pages/Incidents/IncidentDetail';
import { AnalyticsPage } from '../pages/Analytics/Analytics';
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
        element: <IncidentsPage />,
      },
      {
        path: 'incidents/:id',
        element: <IncidentDetail />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

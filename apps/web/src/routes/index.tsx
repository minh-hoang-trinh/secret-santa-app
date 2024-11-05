import { createFileRoute, Navigate } from '@tanstack/react-router';
import { withProtectedRoute } from '../auth.provider';

const Home = () => {
  return <Navigate to="/draws" />;
};

export const Route = createFileRoute('/')({
  component: withProtectedRoute(Home),
});

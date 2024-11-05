import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';

import '@mantine/core/styles.css';
import { Affix, Badge, Button, Container } from '@mantine/core';
import { useAuth } from '../auth.provider';

const Layout = () => {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Container>
      <Outlet />
      {isLoggedIn && (
        <>
          <Affix position={{ bottom: 20, right: 20 }}>
            <Button
              onClick={async () => {
                await logout();

                await navigate({ to: '/login' });
              }}
            >
              LogOut
            </Button>
          </Affix>
          <Affix position={{ bottom: 20, left: 20 }}>
            <Badge color="blue">{currentUser}</Badge>
          </Affix>
        </>
      )}
    </Container>
  );
};

export const Route = createRootRoute({
  component: Layout,
});

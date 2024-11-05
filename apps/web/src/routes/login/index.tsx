import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router';
import { useForm } from '@mantine/form';
import { useAuth } from '../../auth.provider';

const Login = () => {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: 'admin',
      password: 'password',
    },
  });

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <Stack>
      <form
        onSubmit={form.onSubmit(async ({ username, password }) => {
          await login(username, password);
          await navigate({ to: '/' });
        })}
      >
        <TextInput label="Username" {...form.getInputProps('username')} />
        <PasswordInput label="Password" {...form.getInputProps('password')} />
        <Button type="submit">Login</Button>
      </form>
    </Stack>
  );
};

export const Route = createFileRoute('/login/')({
  component: Login,
});

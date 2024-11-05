import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { withProtectedRoute } from '../../auth.provider';
import { FC } from 'react';
import {
  Button,
  Flex,
  Grid,
  Group,
  Input,
  Space,
  Stack,
  Table,
} from '@mantine/core';
import { useListDraws } from '../../api/useListDraws';
import { Draw } from '../../api/types';
import { useForm } from '@mantine/form';
import { useCreateDraw } from '../../api/useCreateDraw';

const DrawRow: FC<{ draw: Draw }> = ({ draw }) => {
  const navigate = useNavigate();
  return (
    <Table.Tr
      key={draw.id}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate({
          to: '/draws/$drawId',
          params: {
            drawId: draw.id,
          },
        });
      }}
    >
      <Table.Td>{draw.id}</Table.Td>
      <Table.Td>{draw.name}</Table.Td>
      <Table.Td>{draw.ownerId}</Table.Td>
      <Table.Td>{draw.status}</Table.Td>
      <Table.Td>{draw.participants.length}</Table.Td>
    </Table.Tr>
  );
};

const Draws = () => {
  const { data, isLoading } = useListDraws();
  const { mutateAsync: createDraw } = useCreateDraw();
  const form = useForm({
    initialValues: {
      name: '',
    },
  });

  if (isLoading || !data) {
    return <h1>Loading...</h1>;
  }

  const rows = data.draws.map((draw: Draw) => (
    <DrawRow key={draw.id} draw={draw} />
  ));

  return (
    <>
      <h1>
        Last 5 draws
        <form
          onSubmit={form.onSubmit(async ({ name }) => {
            await createDraw(name);
          })}
        >
          <Group>
            <Input placeholder="Draw name" {...form.getInputProps('name')} />
            <Button type="submit">Create draw</Button>
          </Group>
        </form>
      </h1>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Owner</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Nb of participants</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Space h="xl" />
    </>
  );
};

export const Route = createFileRoute('/draws/')({
  component: withProtectedRoute(Draws),
});

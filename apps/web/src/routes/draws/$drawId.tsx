import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { FC, useEffect } from 'react';
import { useAuth, withProtectedRoute } from '../../auth.provider';
import { useGetDraw } from '../../api/useGetDraw';
import {
  Badge,
  Button,
  Grid,
  Group,
  Input,
  MultiSelect,
  Space,
  Table,
} from '@mantine/core';
import { useStartDraw } from '../../api/useStartDraw';
import { useParticipateDraw } from '../../api/useParticipateDraw';
import { useForm } from '@mantine/form';
import { useGetBlacklist } from '../../api/useGetBlacklist';
import { useUpdateBlacklist } from '../../api/useUpdateBlacklist';
import { useGetResults } from '../../api/useGetResults';

const DrawPage: FC = () => {
  const { drawId } = Route.useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { isLoading, data: drawData } = useGetDraw(drawId);
  const isOwner = currentUser === drawData?.ownerId || currentUser === 'admin';

  const { isLoading: isBlacklistLoading, data: blacklistData } =
    useGetBlacklist(drawId);

  const { data: resultsData } = useGetResults(
    drawId,
    drawData?.status === 'COMPLETED' && isOwner
  );

  const { mutateAsync: startDraw } = useStartDraw(drawId);
  const { mutateAsync: participateDraw } = useParticipateDraw(drawId);
  const { mutateAsync: updateBlacklist } = useUpdateBlacklist(drawId);

  const participateForm = useForm({
    initialValues: {
      comment: 'I want a rubber duck',
    },
  });

  const blacklistForm = useForm();

  useEffect(() => {
    blacklistForm.setValues({
      blacklistUserIds: blacklistData?.blacklist || [],
    });
  }, [blacklistData]);

  if (isLoading || isBlacklistLoading || !drawData) {
    return <h1>Loading...</h1>;
  }

  const isDrawStillOpen = drawData.status === 'OPEN';
  const isAlreadyParticipant = drawData.participants.find(
    (userId) => userId === currentUser
  );

  const canStartDraw = isDrawStillOpen && isOwner;
  const canJoinDraw = isDrawStillOpen && !isAlreadyParticipant;
  const canUpdateBlacklist = isDrawStillOpen && isAlreadyParticipant;

  return (
    <>
      <Group>
        <Button onClick={() => navigate({ to: '/draws' })}>Back</Button>
        <h1>{drawData.name}</h1>
        {canStartDraw && (
          <Button onClick={async () => await startDraw()}>Start</Button>
        )}
      </Group>
      <h2>Participants</h2>
      <Grid>
        {drawData.participants.sort().map((participant) => (
          <Grid.Col key={participant} span={2}>
            <Badge>{participant}</Badge>
          </Grid.Col>
        ))}
      </Grid>
      <Space h="lg" />
      {canJoinDraw && (
        <form
          onSubmit={participateForm.onSubmit(async ({ comment }) => {
            await participateDraw(comment);
          })}
        >
          <Group>
            <Input
              placeholder="Comment"
              {...participateForm.getInputProps('comment')}
            />
            <Button type="submit">Participate</Button>
          </Group>
        </form>
      )}
      {canUpdateBlacklist && !isBlacklistLoading && (
        <form
          onSubmit={blacklistForm.onSubmit(async ({ blacklistUserIds }) => {
            await updateBlacklist(blacklistUserIds);
          })}
        >
          <Group>
            <MultiSelect
              style={{ flexGrow: 1 }}
              data={drawData.participants.filter(
                (userId) => userId !== currentUser
              )}
              {...blacklistForm.getInputProps('blacklistUserIds')}
            />
            <Button type="submit">Update blacklist</Button>
          </Group>
        </form>
      )}
      {resultsData && (
        <>
          <h2>Results</h2>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Sender</Table.Th>
                <Table.Th>Receiver</Table.Th>
                <Table.Th>Comment From Receiver</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {resultsData.results
                .sort((a, b) => (a.sender > b.sender ? 1 : -1))
                .map(({ sender, receiver, commentFromReceiver }) => (
                  <Table.Tr key={sender}>
                    <Table.Th>{sender}</Table.Th>
                    <Table.Th>{receiver}</Table.Th>
                    <Table.Th>{commentFromReceiver}</Table.Th>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </>
  );
};

export const Route = createFileRoute('/draws/$drawId')({
  component: withProtectedRoute(DrawPage),
});

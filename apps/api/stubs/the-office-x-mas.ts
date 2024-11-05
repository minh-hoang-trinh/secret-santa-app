import { PrismaClient } from '@prisma/client';

const theOfficeSanta = [
  {
    username: 'michael-scott',
    blacklist: ['jan-levinson', 'toby-flenderson'],
    comment: 'world best boss mug',
  },
  { username: 'dwight-schrute', blacklist: ['jim-halpert', 'angela-martin'] },
  { username: 'jim-halpert', blacklist: ['dwight-schrute', 'pam-beesly'] },
  { username: 'pam-beesly', blacklist: ['jim-halpert', 'roy-anderson'] },
  { username: 'angela-martin', blacklist: ['dwight-schrute', 'andy-bernard'] },
  { username: 'ryan-howard', blacklist: ['kelly-kapoor', 'michael-scott'] },
  { username: 'kelly-kapoor', blacklist: ['ryan-howard'] },
  { username: 'andy-bernard', blacklist: ['angela-martin'] },
  { username: 'stanley-hudson', blacklist: [] },
  { username: 'phyllis-vance', blacklist: [] },
  { username: 'meredith-palmer', blacklist: [] },
  { username: 'creed-bratton', blacklist: [] },
  { username: 'oscar-martinez', blacklist: [] },
  { username: 'toby-flenderson', blacklist: ['michael-scott'] },
  { username: 'jan-levinson', blacklist: ['michael-scott'] },
  { username: 'darryl-philbin', blacklist: [] },
  { username: 'erin-hannon', blacklist: [] },
  { username: 'gabe-lewis', blacklist: ['erin-hannon'] },
  { username: 'holly-flax', blacklist: ['michael-scott'] },
  { username: 'roy-anderson', blacklist: ['pam-beesly'] },
];

const prisma = new PrismaClient();
export async function seedTheOffice() {
  await Promise.all([
    prisma.user.create({
      data: {
        username: 'admin',
        hashedPassword: 'password',
      },
    }),
    prisma.user.createMany({
      data: theOfficeSanta.map(({ username }) => ({
        username,
        hashedPassword: 'password',
      })),
    }),
  ]);

  const { id: drawId } = await prisma.draw.create({
    data: {
      name: 'The Office xMas 2024',
      ownerId: 'michael-scott',
      participants: {
        createMany: {
          data: theOfficeSanta.map(({ username, comment }) => ({
            userId: username,
            comment,
          })),
        },
      },
    },
  });

  await prisma.blacklist.createMany({
    data: theOfficeSanta.flatMap(({ username, blacklist }) =>
      blacklist.map((blacklistedUserId) => ({
        drawId,
        userId: username,
        blacklistedUserId,
      }))
    ),
  });
}

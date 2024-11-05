import {
  Combination,
  DrawCombinationFinderService,
  Participant,
} from './draw-combination-finder.service';

const participantsWithoutBlacklist: Participant[] = [
  { userId: '1', blacklist: [] },
  { userId: '2', blacklist: [] },
  { userId: '3', blacklist: [] },
];

const participantsWithBlacklist: Participant[] = [
  { userId: '1', blacklist: ['2'] },
  { userId: '2', blacklist: [] },
  { userId: '3', blacklist: [] },
];

const theOffice = [
  { userId: 'michael-scott', blacklist: ['jan-levinson', 'toby-flenderson'] },
  { userId: 'dwight-schrute', blacklist: ['jim-halpert', 'angela-martin'] },
  { userId: 'jim-halpert', blacklist: ['dwight-schrute', 'pam-beesly'] },
  { userId: 'pam-beesly', blacklist: ['jim-halpert', 'roy-anderson'] },
  { userId: 'angela-martin', blacklist: ['dwight-schrute', 'andy-bernard'] },
  { userId: 'ryan-howard', blacklist: ['kelly-kapoor', 'michael-scott'] },
  { userId: 'kelly-kapoor', blacklist: ['ryan-howard'] },
  { userId: 'andy-bernard', blacklist: ['angela-martin'] },
  { userId: 'toby-flenderson', blacklist: ['michael-scott'] },
  { userId: 'jan-levinson', blacklist: ['michael-scott'] },
  { userId: 'darryl-philbin', blacklist: [] },
  { userId: 'erin-hannon', blacklist: [] },
  { userId: 'gabe-lewis', blacklist: ['erin-hannon'] },
  { userId: 'holly-flax', blacklist: ['michael-scott'] },
  { userId: 'roy-anderson', blacklist: ['pam-beesly'] },
];

const participantsWithNoPossibleCombination: Participant[] = [
  { userId: '1', blacklist: ['2'] },
  { userId: '2', blacklist: ['1'] },
  { userId: '3', blacklist: [] },
];

const isCombinationValid = (
  participants: Participant[],
  combination: Combination
) => {
  if (participants.length !== combination.length) {
    return false;
  }

  return combination.every(({ userId, receiverId }) => {
    const giverParticipant = participants.find(
      (participant) => participant.userId === userId
    );
    const receiverParticipant = participants.find(
      (participant) => participant.userId === receiverId
    );
    return (
      giverParticipant &&
      receiverParticipant &&
      !giverParticipant.blacklist.includes(receiverId)
    );
  });
};

describe('DrawCombinationFinderService', () => {
  const service = new DrawCombinationFinderService();

  describe('findPossibleCombination', () => {
    describe('given a list of participants with only two participants', () => {
      it('should return a valid combination', () => {
        const result = service.findPossibleCombination([
          { userId: '1', blacklist: [] },
          { userId: '2', blacklist: [] },
        ]);

        expect(result).toEqual(
          expect.arrayContaining([
            { userId: '1', receiverId: '2' },
            { userId: '2', receiverId: '1' },
          ])
        );
      });
    });
    describe.each([
      [participantsWithoutBlacklist, participantsWithBlacklist, theOffice],
    ])(
      'given a list of participants with possible combinations',
      (participants) => {
        it('should return a valid combination', () => {
          const result = service.findPossibleCombination(participants);

          expect(isCombinationValid(participants, result)).toBe(true);
        });
      }
    );

    describe('given a list of participants with no possible combinations', () => {
      it('should throw an error', () => {
        expect(() =>
          service.findPossibleCombination(participantsWithNoPossibleCombination)
        ).toThrow('No possible secret santa combination');
      });
    });

    describe.each([[[]], [[{ userId: '1', blacklist: [] }]]])(
      'given a list of participants that is less than 2',
      (participants) => {
        it('should throw an error', () => {
          expect(() => service.findPossibleCombination(participants)).toThrow(
            'The number of participants must be at least 2'
          );
        });
      }
    );
  });
});

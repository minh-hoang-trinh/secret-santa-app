import { Injectable } from '@nestjs/common';

export interface Participant {
  userId: string;
  blacklist: string[];
}

export type Combination = { userId: string; receiverId: string }[];

@Injectable()
export class DrawCombinationFinderService {
  public findPossibleCombination(participants: Participant[]): Combination {
    if (participants.length < 2) {
      throw new Error('The number of participants must be at least 2');
    }

    const firstParticipant =
      participants[Math.floor(Math.random() * participants.length)];
    const firstParticipantBlacklist = firstParticipant.blacklist;

    const results: { participantId: string; traversed: string[] }[] = [
      {
        participantId: firstParticipant.userId,
        traversed: [firstParticipant.userId],
      },
    ];
    const pools = participants.filter(
      (participant) => participant.userId !== firstParticipant.userId
    );

    while (true) {
      const lastNode = results[results.length - 1];
      const currentParticipant = participants.find(
        (participant) => participant.userId === lastNode.participantId
      );

      if (currentParticipant === undefined) {
        console.error('currentParticipant is undefined', lastNode);
        throw new Error('No possible secret santa combination');
      }

      const currentBlacklist = currentParticipant.blacklist;

      const next = pools.find(
        (participant) =>
          !currentBlacklist.includes(participant.userId) &&
          !lastNode.traversed.includes(participant.userId)
      );

      if (next === undefined) {
        results.pop();
        pools.push(currentParticipant);

        if (
          results.length === 1 &&
          new Set([...results[0].traversed, ...firstParticipantBlacklist])
            .size === participants.length
        ) {
          throw new Error('No possible secret santa combination');
        }

        continue;
      }

      pools.splice(pools.indexOf(next), 1);
      lastNode.traversed.push(next.userId);

      results.push({
        participantId: next.userId,
        traversed: [next.userId],
      });

      if (results.length === participants.length) {
        if (!next.blacklist.includes(firstParticipant.userId)) {
          console.log(
            'The last participant can give a gift to the first participant, the combination is valid'
          );
          break;
        }

        results.pop();
        pools.push(currentParticipant);
      }
    }

    const secretSantaList = results
      .map((result) => result.participantId)
      .map((userId, index) => {
        const receiverId =
          index + 1 === results.length
            ? results[0].participantId
            : results[index + 1].participantId;
        return { userId, receiverId };
      });

    return secretSantaList;
  }
}

export type Draw = {
  id: string;
  name: string;
  ownerId: string;
  status: 'OPEN' | 'COMPLETED';
  participants: string[];
};

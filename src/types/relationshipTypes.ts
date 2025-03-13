
import { ReactElement } from 'react';

export type InteractionAction = {
  id: string;
  name: string;
  icon: ReactElement;
  points: number;
  description: string;
};

export type InteractionHistoryEvent = {
  date: string;
  action: string;
  points: number;
};

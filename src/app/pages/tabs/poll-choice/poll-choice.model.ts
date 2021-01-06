import { BaseEntity } from 'src/model/base-entity';
import { Vote } from '../vote/vote.model';

export class PollChoice implements BaseEntity {
  constructor(public id?: number, public choice?: string, public votes?: Vote[], public pollQuestion?: string, public pollId?: number) {}
}

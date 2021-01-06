import { BaseEntity } from 'src/model/base-entity';
import { PollChoice } from '../poll-choice/poll-choice.model';

export class Poll implements BaseEntity {
  constructor(
    public id?: number,
    public question?: string,
    public active?: boolean,
    public createdBy?: string,
    public creationDate?: any,
    public choices?: PollChoice[]
  ) {
    this.active = false;
  }
}

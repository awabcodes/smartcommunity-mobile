import { BaseEntity } from 'src/model/base-entity';

export class NeedOrder implements BaseEntity {
  constructor(
    public id?: number,
    public quantity?: string,
    public note?: string,
    public userLogin?: string,
    public userId?: number,
    public needName?: string,
    public needId?: number
  ) {}
}

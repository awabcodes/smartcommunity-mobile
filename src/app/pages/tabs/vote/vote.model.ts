import { BaseEntity } from 'src/model/base-entity';

export class Vote implements BaseEntity {
  constructor(
    public id?: number,
    public creationDate?: any,
    public userLogin?: string,
    public userId?: number,
    public choiceChoice?: string,
    public choiceId?: number
  ) {}
}

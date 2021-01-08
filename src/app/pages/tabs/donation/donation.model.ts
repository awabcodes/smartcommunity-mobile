import { BaseEntity } from 'src/model/base-entity';

export class Donation implements BaseEntity {
  constructor(
    public id?: number,
    public amount?: number,
    public receiptNumber?: string,
    public userLogin?: string,
    public userId?: number,
    public requestCause?: string,
    public requestId?: number,
    public collected?: boolean,
  ) { }
}

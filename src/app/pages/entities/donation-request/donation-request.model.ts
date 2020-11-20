import { BaseEntity } from 'src/model/base-entity';
import { Donation } from '../donation/donation.model';

export class DonationRequest implements BaseEntity {
  constructor(
    public id?: number,
    public cause?: string,
    public paymentInfo?: string,
    public info?: string,
    public totalAmount?: number,
    public contact?: string,
    public amountRaised?: number,
    public donations?: Donation[]
  ) {}
}

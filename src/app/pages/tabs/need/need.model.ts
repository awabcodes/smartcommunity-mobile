import { BaseEntity } from 'src/model/base-entity';
import { NeedOrder } from '../need-order/need-order.model';

export class Need implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public info?: string,
    public available?: boolean,
    public contact?: string,
    public imageContentType?: string,
    public image?: any,
    public quantity?: string,
    public orders?: NeedOrder[]
  ) {
    this.available = false;
  }
}

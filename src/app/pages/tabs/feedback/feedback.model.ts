import { BaseEntity } from 'src/model/base-entity';

export const enum FeedbackType {
  'SUGGESTION',
  'COMPLAINT',
  'WATER_COMPLAINT',
  'AUTUMN_COMPLAINT',
  'SECURITY_COMPLAINT'
}

export const enum FeedbackStatus {
  'OPEN',
  'CLOSED',
}

export class Feedback implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public content?: string,
    public type?: FeedbackType,
    public status?: FeedbackStatus,
    public creationDate?: any,
    public imageContentType?: string,
    public image?: any,
    public userLogin?: string,
    public userId?: number
  ) {}
}

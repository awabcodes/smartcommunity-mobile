import { BaseEntity } from 'src/model/base-entity';

export const enum AnnouncementType {
  'NEWS',
  'EVENT',
  'OTHER',
}

export class Announcement implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public content?: string,
    public creationDate?: any,
    public type?: AnnouncementType,
    public location?: string,
    public imageContentType?: string,
    public image?: any,
    public contact?: string,
    public announcementDate?: any
  ) {}
}

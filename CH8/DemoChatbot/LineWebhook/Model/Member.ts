import { Profile } from "@line/bot-sdk";

export interface MemberInterface {
    userId: string;
    displayName: string;
    pictureUrl: string;
    createTime: number
}

export class Member implements MemberInterface{
    userId: string;
    displayName: string;
    pictureUrl: string;
    createTime: number

    constructor(profile : Profile, timestamp: number) {
        this. userId = profile.userId
        this.displayName = profile.displayName
        this.pictureUrl = profile.pictureUrl
        this.createTime = timestamp
    }
}

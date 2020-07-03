export type Banner={
    targetid:Number,
    url:String,
    imageUrl:String,
}

export type HotTag={

        id:number;
        name:string;
        position:number;
}

export type SongSheet={
    id:number;
    name:string;
    picUrl:string;
    coverImgUrl:string;
    playCount:number;
    tracks:Song[];
    tags:string[];
    createTime:number;
    creator:{nickname:string;avatarUrl:string};
    description:string;
    subscribedCount:number;
    shareCount:number;
    commentCount:number;
    subscribed:boolean;
    userId:string;


}

export type Singer={
    id:string;
    name:string;
    alias:string[];
    picUrl:string;
    albumSize:number;
}

export type Song={
    id:number;
    name:string;
    url:string;
    ar:Singer[]
    al:{id:number;name:string;picUrl:string};
    dt:number;
}

export type SongUrl={
    id:number;
    url:string;
}

export type Lyric={
    lyric:string;
    tlyric:string;
}

export type SheetList={

    playlists:SongSheet[];
    total:number;
}

export type SingerDetail={
    artist:Singer;
    hotSongs:Song[];
}
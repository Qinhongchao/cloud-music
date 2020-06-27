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
    playCount:number;
    tracks:Song[];
}

export type Singer={
    id:string;
    name:string;
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
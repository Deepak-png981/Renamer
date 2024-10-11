export interface YmlJob {
    "runs-on": string;
    strategy?: any;
    steps?: any[];
}

export interface YmlContent {
    name?: string;
    on?: {
        pull_request?: { branches?: string[] };
        push?: { branches?: string[] };
    };
    jobs?: { [key: string]: YmlJob };
}

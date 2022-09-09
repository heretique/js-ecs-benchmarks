export declare type Constructor<T, Args extends any[] = any> = {
    new (...args: Args): T;
};
export declare type InstanceTypeTuple<T extends any[]> = {
    [K in keyof T]: T[K] extends Constructor<infer U> ? U : never;
};
export declare function join(arr: string[], sep: string): string;

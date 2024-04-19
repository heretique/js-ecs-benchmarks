export declare class IdPool {
    private free;
    constructor();
    reserve(): number;
    release(id: number): void;
}

export declare class SparseSet {
    private dense;
    private sparse;
    private size;
    private capacity;
    private maxCapacity;
    constructor(capacity: number);
    /**
     * Adds a value to the data structure.
     *
     * @param value - The value to be added.
     * @returns The index at which the value was added.
     * @throws {Error} If the value is greater than or equal to the maximum capacity of the data structure.
     */
    add(value: number): number;
    remove(value: number): void;
    has(value: number): boolean;
    clear(): void;
    getSize(): number;
    getCapacity(): number;
    get(value: number): number;
    getValues(): Int32Array;
    [Symbol.iterator](): Iterator<number>;
    forEach(callback: (index: number) => void): void;
    map<T>(callback: (index: number) => T): T[];
    filter(predicate: (index: number) => boolean): number[];
}

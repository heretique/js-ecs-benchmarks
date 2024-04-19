export type Trie<S, T> = {
    value?: T;
    branches?: Map<S, Trie<S, T>>;
};
/** Gets the value associated with the sequence seq in the trie.
 * @returns the value, or undefined if not found */
export declare function getInTrie<S, T>(trie: Trie<S, T>, seq: S[]): T | undefined;
/** Sets the value associated with the sequence seq in the trie. */
export declare function setInTrie<S, T>(trie: Trie<S, T>, seq: S[], value: T): void;
/** Calls found for each sequence in trie that is a subsequence of seq (has the same order with one or more elements deleted).
 * If found returns false, stops searching.
 * @param seq a list of symbols
 * @param trie a trie of subsequences */
export declare function foreachSubsequenceInTrie<S, T>(trie: Trie<S, T>, seq: S[], found: (value: T) => boolean | void): false | void;
/** Reusable iterator for searching a trie for subsequences of a sequence.
 * Usage:
 * it = new TrieSubsequenceIterator();
 * let value: T;
 * for (it.start(trie, ['A', 'B', 'C']); it.next(); ) {
 *   ...it.value...
 * } */
export declare class TrieSubsequenceIterator<S, T> {
    /** Iteration path. ***Valid length is pathLen + 1.***
     * [0] is the trie being searched; subsequent elements are the branches taken at each step. */
    path: (Trie<S, T> | undefined)[];
    /** Sequence index at each step in the path. ***Valid length is pathLen.***
     * If the value iterated is from the root of the trie, pathLen is 0 and nothing in this array is valid. */
    seqIdx: number[];
    /** Length of path. */
    pathLen: number;
    /** Sequence to search the trie for subsequences of. */
    seq?: S[];
    /** Value found at current step, if any. */
    value?: T;
    constructor(seq: S[], trie: Trie<S, T>);
    reset(seq?: S[], trie?: Trie<S, T>): this;
    next(): boolean;
}

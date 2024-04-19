import { Constructor } from "./util";
type TagName = string | number | {
    toString(): string;
};
export interface EntityTag<Name extends TagName> {
    /**
     * Don't try to use this, it only exists to preserve the type parameter.
     */
    __$PHANTOM$: Name & never;
}
export declare abstract class Tag {
    private static cache;
    /**
     * This can be used to assign an entity a
     * unique component type, for identification
     * purposes.
     *
     * Example:
     * ```
     *  const registry = new Registry();
     *  // create
     *  const enemy = registry.create(Tag.for("Enemy"));
     *  const player = registry.create(Tag.for("Player"));
     *
     *  // query
     *  registry.view(Tag.for("Enemy")).each(() => { ... });
     *  registry.view(Tag.for("Player")).each(() => { ... });
     * ```
     */
    static for<Name extends TagName>(name: Name): Constructor<EntityTag<Name>>;
}
export {};

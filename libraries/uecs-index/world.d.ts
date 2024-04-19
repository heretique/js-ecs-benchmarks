import { type Constructor, type InstanceTypeTuple } from "./util";
/**
 * An opaque identifier used to access component arrays
 */
export type Entity = number;
/**
 * The Null entity can be used to initialiaze a variable
 * which is meant to hold an entity without actually using `null`.
 */
export declare const Null: Entity;
/** Type alias for registering a component as a Singleton. */
export type Singleton = Component;
/**
 * Stores arbitrary data
 */
export interface Component {
    /**
     * Called when the component is attached to an entity.
     * @param entity The entity the component was attached to.
     */
    added?: (entity: Entity) => void;
    /**
     * Callback called when a component is detached from an entity.
     * Usually will be followed by a call to `free`
     * @param entity The entity the component was detached from.
     */
    removed?: (entity: Entity) => void;
    interpolationSynced?: (rawData: any, syncTime: number) => void;
    /**
     * Callback called when a component is destroyed.
     * @param world The world the component was destroyed in.
     * @param entity The entity the component was attached to before it was destroyed.
     */
    free?: (world: World, entity: Entity) => void;
    [x: string]: any;
    [x: number]: any;
}
/** Type of component type names: `Constructor.prototype.name`. */
type ComponentTypeName = string;
/** Type of component property names on an index iterator. */
export type IndexComponentName = string;
/** Specifies an index. Property names beginning with an underscore denote components that
 * must be present on the entity, but are not accessible from the iteration.
 *
 * Example: Given `class A {}; class B{};`, the index spec `{ a: A, b: B, _c: C }`
 * in the expression `world.index({ a: A, b: B, _c: C })`
 * specifies an index of types `A`, `B`, and `C`, which will be accessed by properties
 * `a` and `b`, with type `C` not being accessible, in the returned `IndexIterator.` */
export type IndexSpec = Record<IndexComponentName, Constructor<Component>>;
/** Removes all properties with a name starting with an underscore. */
type WithoutIgnoredComponents<IS extends IndexSpec> = Pick<IS, {
    [k in keyof IS]: k extends `_${string}` ? never : k;
}[keyof IS]>;
/** Converts a Record of Constructors to a Record of the constructed types. */
type ConstructorsToTypes<IS extends IndexSpec> = {
    [key in keyof IS]: IS[key] extends Constructor<infer C> ? C : never;
};
/** Converts an `IndexSpec` to a record with properties of the specified component type. */
export type IndexRecord<IS extends IndexSpec> = ConstructorsToTypes<WithoutIgnoredComponents<IS>>;
/** Selects between an IndexIteratorBase with or without an entity property. */
type IndexIteratorBaseEntitySelector<IS extends IndexSpec, WithEntity extends boolean> = {
    entity: IndexIteratorBase<IS, WithEntity>;
    _entity: Omit<IndexIteratorBase<IS, WithEntity>, "entity">;
}[WithEntity extends true ? "entity" : "_entity"];
/** Symbol property name for `IndexIterator`'s current storage location. */
declare const $iS: unique symbol;
/** Symbol property name for `IndexIterator`'s current additions version. */
declare const $addVer: unique symbol;
/** Symbol property name for `IndexIterator`'s current removals version. */
declare const $remVer: unique symbol;
/** Base for `IndexIterator`, which enables iterating an index.
 * This is reusable; call `start()` to reset it rather than creating a new one every time. */
declare class IndexIteratorBase<IS extends IndexSpec, WithEntity extends boolean> {
    indexBase: IndexBase<IS>;
    names: (keyof IS)[];
    /** The current position in the `Index`. Don't rely on this being meaningful. */
    private [$iS];
    /** The current additions version number, synched with the index to determine whether it gained any elements. */
    private [$addVer];
    /** The current removals version number, synched with the index to determine whether it lost any elements. */
    private [$remVer];
    constructor(indexBase: IndexBase<IS>, names: (keyof IS)[]);
    /** Starts / resets the iterator. */
    start(): IndexIterator<IS, WithEntity>;
    /** Moves to the next (entity, ...components) in the index.
     * This is also a type guard that informs TypeScript the component properties are valid.
     * @returns self, or undefined if at end */
    next(): this is IndexIteratorAtNext<IS, WithEntity>;
    /** `it.first()?.` is quivalent to `if (it.start().next()) it.`.
     * Use to express intent when only one result is needed / expected. */
    first(): undefined | IndexIteratorAtNext<IS, WithEntity>;
    /** Equivalent to `.wasAddedTo() || .wasRemovedFrom()` */
    wasChanged(): boolean;
    /** @returns `true` if index gained any items since last called (`false` on first call).
     * Doesn't track the exact set of items, so if all gained items were lost again, would still return `true`. */
    wasAddedTo(): boolean;
    /** @returns `true` if index lost any items since last called (`false` on first call).
     * Doesn't track the exact set of items, so if all lost items were gained back, would still return `true`. */
    wasRemovedFrom(): boolean;
    /** Entity at the current iteration. */
    entity: Entity;
}
/** Enables iterating an index.
 *
 * Usage: `for (it.start(); it.next(); ) { ...it.entity, it.indexSpecComponentName... }`
 *
 * This is reusable; call `start()` to reset it rather than creating a new one every time.
 *
 * Note that the base type of an iterator, `IndexIterator` has no component properties,
 * and `.next()` is a type guard that informs TypeScript they exist via `IndexIteratorAtEntity`.
 */
export type IndexIterator<IS extends IndexSpec, WithEntity extends boolean> = IndexIteratorBaseEntitySelector<IS, WithEntity>;
/** Enables iterating an index.
 *
 * Usage: `for (it.start(); it.next(); ) { ...it.entity, it.indexSpecComponentName... }`
 *
 * Note that the base type of an iterator, `IndexIterator` has no component properties,
 * and `.next()` is a type guard that informs TypeScript they exist via `IndexIteratorAtEntity`.
 */
export type IndexIteratorAtNext<IS extends IndexSpec, WithEntity extends boolean> = IndexIteratorBaseEntitySelector<IS, WithEntity> & IndexRecord<IS>;
/** Enables faster iteration of entities that have a specific set of components. */
export declare class IndexBase<C extends Component> {
    types: ComponentTypeName[];
    /** Map from entity to its (entity, ...components) index in storage. Always a multiple of types.length. */
    entityISByEntity: Map<number, number>;
    /** Linearized storage for (entity, ...components). */
    storage: (undefined | Entity | C)[];
    /** List of free indexes in elements. */
    freeISs: number[];
    /** Increments when one or more entities have been added. */
    addVer: number;
    /** Indicates whether an addVer has been observed. */
    addVerObserved: boolean;
    /** Increments when one or more entities have been removed. */
    remVer: number;
    /** Indicates whether a remVer has been observed. */
    remVerObserved: boolean;
    constructor(types: ComponentTypeName[]);
    /** Adds entity and components (sorted by component type names), to the index.
     * @param components sorted by component type names; only the number of components in the index will be used */
    add(entity: Entity, components: C[]): void;
    /** If the entity is already in the index, updates the component of the specified type.
     * @returns `false` if `entity` is not in the index, `true` otherwise.
     * @throws if the type is not in the index's component type set. */
    emplace(entity: Entity, type: ComponentTypeName, component: C): boolean;
    /** Removes an entity from the index.
     * @returns `true` if `entity` was in the index and was deleted, `false` otherwise. */
    remove(entity: Entity): boolean;
    observeAddVer(): number;
    observeRemVer(): number;
}
type EntityTracker = {
    entityAdded?: (entity: Entity) => void;
    entityRemoved?: (entity: Entity) => void;
};
/**
 * World is the core of the ECS.
 * It stores all entities and their components, and enables efficiently querying them.
 *
 * Visit https://jprochazk.github.io/uecs/ for a comprehensive tutorial.
 */
export declare class World {
    private entitySequence;
    private entities;
    private components;
    private views;
    private readonly singletonEntity;
    private entityTracker?;
    /** Map from component type to all indexes using it, for updating indexes on component deletions. */
    private indexesByComponent;
    /** Trie of (sorted) component type set to index. */
    private indexByComponents;
    /** Iterator for searching for indexes on a subset of a given type set. */
    private indexByComponentsSubIt;
    trackEntities(entityTracker: EntityTracker): void;
    registerSingleton<T extends Singleton>(component: T): void;
    getSingleton<T extends Singleton>(type: Constructor<T>): T | undefined;
    removeSingleton<T extends Singleton>(type: Constructor<T>): void;
    private create_typesP;
    private create_ecs;
    /**
     * Creates an entity, and optionally assigns all `components` to it.
     * @throws if any component type is duplicated
     */
    create<T extends Component[]>(...components: T): Entity;
    /** @param types ***sorted*** component type names */
    /**
     * Inserts the `entity`, and optionally assigns all `components` to it.
     *
     * If the entity already exists, all `components` will be assigned to it.
     * If it already has some other components, they won't be destroyed:
     * ```ts
     *  class A { constructor(value = 0) { this.value = value } }
     *  class B { constructor(value = 0) { this.value = value } }
     *  const world = new World;
     *  const entity = world.create(new A, new B);
     *  world.get(entity, A); // A { value: 0 }
     *  world.insert(entity, new A(5));
     *  world.get(entity, A); // A { value: 5 }
     *  world.get(entity, B); // B { value: 0 }
     * ```
     *
     * You can first check if the entity exists, destroy it if so, and then insert it.
     * ```ts
     *  if (world.exists(entity)) {
     *      world.destroy(entity);
     *  }
     *  world.insert(entity, new A, new B, ...);
     * ```
     */
    insert<T extends Component[]>(entity: Entity, ...components: T): Entity;
    /**
     * Returns true if `entity` exists in this World
     */
    exists(entity: Entity): boolean;
    /**
     * Destroys an entity and all its components
     *
     * Calls `.free()` (if available) on each destroyed component
     * Note: `.free()` will be called after the entity is fully destroyed.
     * This is to allow `.destroy()` to be called from a `.free()`
     *
     * Example:
     * ```
     *  class A { free() { console.log("A freed"); } }
     *  const world = new World();
     *  const entity = world.create(new A);
     *  world.destroy(entity); // logs "A freed"
     * ```
     */
    destroy(entity: Entity): void;
    /**
     * Retrieves `component` belonging to `entity`. Returns `undefined`
     * if it the entity doesn't have `component`, or the `entity` doesn't exist.
     *
     * Example:
     * ```
     *  class A { value = 50 }
     *  class B {}
     *  const world = new World();
     *  const entity = world.create();
     *  world.emplace(entity, new A);
     *  world.get(entity, A).value; // 50
     *  world.get(entity, A).value = 10;
     *  world.get(entity, A).value; // 10
     *  world.get(entity, B); // undefined
     *  world.get(100, A); // undefined
     * ```
     */
    get<T extends Component>(entity: Entity, componentClass: Constructor<T> | string): T | undefined;
    /**
     * Retrieves all components for the given entity. Useful when editing the scene/world.
     * @param entity
     * @returns
     */
    getAll(entity: Entity): Component[];
    /**
     * Returns `true` if `entity` exists AND has `component`, false otherwise.
     *
     * Example:
     * ```
     *  class A {}
     *  const world = new World();
     *  const entity = world.create();
     *  world.has(entity, A); // false
     *  world.emplace(entity, new A);
     *  world.has(entity, A); // true
     *  world.has(100, A); // false
     * ```
     */
    has<T extends Component>(entity: Entity, componentClass: Constructor<T>): boolean;
    /**
     * Sets `entity`'s instance of component `type` to `component`.
     * @throws If `entity` does not exist
     *
     *
     * Warning: Overwrites any existing instance of the component.
     * This is to avoid an unnecessary check in 99% of cases where the
     * entity does not have the component yet. Use `world.has` to
     * check for the existence of the component first, if this is undesirable.
     *
     * Example:
     * ```
     *  class A { constructor(value) { this.value = value } }
     *  const entity = world.create();
     *  world.emplace(entity, new A(0));
     *  world.emplace(entity, new A(5));
     *  world.get(entity, A); // A { value: 5 } -> overwritten
     * ```
     *
     * Note: This is the only place in the API where an error will be
     * thrown in case you try to use a non-existent entity.
     *
     * Here's an example of why it'd be awful if `World.emplace` *didn't* throw:
     * ```ts
     *  class A { constructor(value = 0) { this.value = value } }
     *  const world = new World;
     *  world.exists(0); // false
     *  world.emplace(0, new A);
     *  // entity '0' doesn't exist, but it now has a component.
     *  // let's try creating a brand new entity:
     *  const entity = world.create();
     *  // *BOOM!*
     *  world.get(0, A); // A { value: 0 }
     *  // it'd be extremely difficult to track down this bug.
     * ```
     */
    emplace<T extends Component>(entity: Entity, component: T): void;
    /**
     * Removes instance of `component` from `entity`, and returns the removed component.
     * Returns `undefined` if nothing was removed, or if `entity` does not exist.
     *
     * Example:
     * ```
     *  class A { value = 10 }
     *  const world = new World();
     *  const entity = world.create();
     *  world.emplace(entity, new A);
     *  world.get(entity, A).value = 50
     *  world.remove(entity, A); // A { value: 50 }
     *  world.remove(entity, A); // undefined
     * ```
     *
     * This does **not** call `.free()` on the component. The reason for this is that
     * you don't always want to free the removed component. Don't fret, you can still
     * free component, because the `World.remove` call returns it! Example:
     * ```
     *  class F { free() { console.log("freed") } }
     *  const world = new World;
     *  const entity = world.create(new F);
     *  world.remove(entity, F).free();
     *  // you can use optional chaining to easily guard against the 'undefined' case:
     *  world.remove(entity, F)?.free();abc
     * ```
     */
    remove<T extends Component>(entity: Entity, componentClass: Constructor<T> | string): T | undefined;
    /**
     * Returns the size of the world (how many entities / components are stored)
     */
    size(componentConstructor?: Constructor<Component>): number;
    /**
     * Used to query for entities with specific component combinations
     * and efficiently iterate over the result.
     *
     * Example:
     * ```
     *  class Fizz { }
     *  class Buzz { }
     *  const world = new World();
     *  for (let i = 0; i < 100; ++i) {
     *      const entity = world.create();
     *      if (i % 3 === 0) world.emplace(entity, new Fizz);
     *      if (i % 5 === 0) world.emplace(entity, new Buzz);
     *  }
     *
     *  world.view(Fizz, Buzz).each((n) => {
     *      console.log(`FizzBuzz! (${n})`);
     *  });
     * ```
     */
    view<T extends Constructor<Component>[]>(...types: T): View<T>;
    /** Gathers spec names and types. */
    private index_specs;
    /** Gathers an entity's components to add to index. */
    private index_ecs;
    /** For sorting [name in index, component class name] pairs by component class name. */
    private index_indexComponentSpecOrd;
    /** Creates an index for a set of types.
     * @param indexSpec `{ componentName0: ComponentClass0`, ... `}`; `componentNameN` is used in the iteration
     * @throws if there are any duplicate components in types */
    index<IS extends IndexSpec, WithEntity extends boolean>(indexSpec: IS, _withEntity?: WithEntity): IndexIterator<IS, WithEntity>;
    /**
     * Removes every entity, and destroys all components.
     */
    clear(): void;
    /**
     * Returns an iterator over all the entities in the world.
     */
    all(): IterableIterator<Entity>;
}
/**
 * The callback passed into a `View`, generated by a world.
 *
 * If this callback returns `false`, the iteration will halt.
 */
export type ViewCallback<T extends Constructor<Component>[]> = (entity: Entity, ...components: InstanceTypeTuple<T>) => false | void;
/**
 * A view is a non-owning entity iterator.
 *
 * It is used to efficiently iterate over large batches of entities,
 * and their components.
 *
 * A view is lazy, which means that it fetches entities and components
 * just before they're passed into the callback.
 *
 * The callback may return false, in which case the iteration will halt early.
 *
 * This means you should avoid adding entities into the world, which have the same components
 * as the ones you're currently iterating over, unless you add a base case to your callback:
 * ```ts
 *  world.view(A, B, C).each((entity, a, b, c) => {
 *      // our arbitrary base case is reaching entity #1000
 *      // without this, the iteration would turn into an infinite loop.
 *      if (entity === 1000) return false;
 *      world.create(A, B, C);
 *  })
 * ```
 */
export interface View<T extends Constructor<Component>[]> {
    /**
     * Iterates over all the entities in the `View`.
     *
     * If you return `false` from the callback, the iteration will halt.
     */
    each(callback: ViewCallback<T>): void;
}
export {};

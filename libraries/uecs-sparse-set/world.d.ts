import { InstanceTypeTuple, Constructor } from "./util";
/**
 * An opaque identifier used to access component arrays
 */
export type Entity = number;
/**
 * The Null entity can be used to initialize a variable
 * which is meant to hold an entity without actually using `null`.
 */
export declare const Null: Entity;
/**
 * Stores arbitrary data
 */
export interface Component {
    free?: () => void;
    [x: string]: any;
    [x: number]: any;
}
/**
 * World is the core of the ECS.
 * It stores all entities and their components, and enables efficiently querying them.
 *
 * Visit https://jprochazk.github.io/uecs/ for a comprehensive tutorial.
 */
export declare class World {
    private ids;
    private entities;
    private componentsStorage;
    private views;
    /**
     * Creates an entity, and optionally assigns all `components` to it.
     */
    create<T extends Component[]>(...components: T): Entity;
    /**
     * Returns true if `entity` exists in this World
     */
    exists(entity: Entity): boolean;
    /**
     * Destroys an entity and all its components
     *
     * Calls `.free()` (if available) on each destroyed component
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
    get<T extends Component>(entity: Entity, component: Constructor<T>): T | undefined;
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
    has<T extends Component>(entity: Entity, component: Constructor<T>): boolean;
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
     *  world.remove(entity, F)?.free();
     * ```
     */
    remove<T extends Component>(entity: Entity, component: Constructor<T>): T | undefined;
    /**
     * Returns the size of the world (how many entities are stored)
     */
    size(): number;
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
    /**
     * Removes every entity, and destroys all components.
     */
    clear(): void;
    /**
     * Returns an iterator over all the entities in the world.
     */
    all(): Iterable<Entity>;
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

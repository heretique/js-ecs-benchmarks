import { World } from './uecs-index/index.esm';

class Position {
    x = 0;
    y = 0;
}

class Velocity {
    dx = 1.2;
    dy = 1.7;
}

class MovementSystem {
    updateCount = 0;
    index = null; 

    constructor(world) {
        this.world = world;
        this.index = this.world.index({pos: Position, vel: Velocity});
    }

    update() {
        for (const it = this.index.start(); it.next(); ) {
            const { pos, vel } = it;
            pos.x += vel.dx;
            pos.y += vel.dy;
            this.updateCount++;
        }
    }
}

export default {
    name: 'uecs-index',
    setup() {
        this.world = new World();
        this.movementSystem = new MovementSystem(this.world);
    },
    createEntity() {
        const entity = this.world.create();
        return entity;
    },
    addPositionComponent(entity) {
        this.world.emplace(entity, new Position());
    },
    addVelocityComponent(entity) {
        this.world.emplace(entity, new Velocity());
    },
    removePositionComponent(entity) {
        this.world.remove(entity, Position);
    },
    removeVelocityComponent(entity) {
        this.world.remove(entity, Velocity);
    },
    destroyEntity(entity) {
        this.world.destroy(entity);
    },
    cleanup() {},
    updateMovementSystem() {
        this.movementSystem.update();
    },
    geMovementSystemUpdateCount() {
        return this.movementSystem.updateCount;
    },
};

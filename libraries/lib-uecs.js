import { World } from 'uecs';

class Position {
    x = 0;
    y = 0;
}

class Velocity {
    dx = 1.2;
    dy = 1.7;
}
class Health {
    h = 100;
}

class SingleSystem {
    updateCount = 0;
    view = null;

    constructor(world) {
        this.view = world.view(Position);
    }

    update() {
        this.view.each((_, pos) => {
            pos.x += 1;
            pos.y += 1;
            this.updateCount++;
        });
    }
}

class MovementSystem {
    updateCount = 0;
    view = null;

    constructor(world) {
        this.view = world.view(Position, Velocity);
    }

    update() {
        this.view.each((_, pos, vel) => {
            pos.x += vel.dx;
            pos.y += vel.dy;
            this.updateCount++;
        });
    }
}

class MovementAndHealthSystem {
    updateCount = 0;
    view = null;

    constructor(world) {
        this.view = world.view(Position, Velocity, Health);
    }

    update() {
        this.view.each((_, pos, vel, health) => {
            pos.x += vel.dx;
            pos.y += vel.dy;
            health += 1
            this.updateCount++;
        });
    }
}

export default {
    name: 'uecs',
    setup() {
        this.world = new World();
        this.singleSystem = new SingleSystem(this.world);
        this.movementSystem = new MovementSystem(this.world);
        this.movementAndHealthSystem = new MovementAndHealthSystem(this.world);
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
    addHealthComponent(entity) {
        this.world.emplace(entity, new Health());
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
    updateSingleSystem() {
        this.singleSystem.update();
    },
    geSingleSystemUpdateCount() {
        return this.singleSystem.updateCount;
    },
    updateMovementSystem() {
        this.movementSystem.update();
    },
    geMovementSystemUpdateCount() {
        return this.movementSystem.updateCount;
    },
    updateMovementAndHealthSystem() {
        this.movementAndHealthSystem.update();
    },
    geMovementAndHealthSystemUpdateCount() {
        return this.movementAndHealthSystem.updateCount;
    },
};

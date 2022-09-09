export default {
    name: 'Velocity',
    iterations: 100,
    entitiesNo: 1000000,
    setup(ctx) {
        ctx.setup();
        for (let i = 0; i < this.entitiesNo; i++) {
            const entity = ctx.createEntity();
            if (i % 2 === 0) ctx.addPositionComponent(entity);
            if (i % 32 === 0) ctx.addVelocityComponent(entity);
        }
    },
    perform(ctx) {
            ctx.updateMovementSystem();
    },
};

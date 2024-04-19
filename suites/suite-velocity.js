export default {
    name: 'Velocity',
    iterations: 50,
    entitiesNo: 100000,
    setup(ctx) {
        ctx.setup();
        for (let i = 0; i < this.entitiesNo; i++) {
            const entity = ctx.createEntity();
            if (i % 3 === 0)
            ctx.addPositionComponent(entity);
            if (i % 8 === 0) 
            ctx.addVelocityComponent(entity);
        }
    },
    perform(ctx) {
        ctx.updateMovementSystem();
    },
};

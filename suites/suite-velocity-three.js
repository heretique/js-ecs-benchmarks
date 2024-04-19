export default {
    name: 'Velocity Three Components',
    iterations: 50,
    entitiesNo: 100000,
    setup(ctx) {
        ctx.setup();
        for (let i = 0; i < this.entitiesNo; i++) {
            const entity = ctx.createEntity();
            // if (i % 2 === 0)
            ctx.addPositionComponent(entity);
            ctx.addVelocityComponent(entity);
            ctx.addHealthComponent(entity);
        }
    },
    perform(ctx) {
            ctx.updateMovementAndHealthSystem();
    },
};

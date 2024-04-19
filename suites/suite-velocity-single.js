export default {
    name: 'Velocity Single Component',
    iterations: 50,
    entitiesNo: 100000,
    setup(ctx) {
        ctx.setup();
        for (let i = 0; i < this.entitiesNo; i++) {
            const entity = ctx.createEntity();
            // if (i % 2 === 0)
            ctx.addPositionComponent(entity);
        }
    },
    perform(ctx) {
        ctx.updateSingleSystem();
    },
};

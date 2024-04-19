export default {
    name: 'Additions',
    iterations: 50,
    entitiesNo: 10000,
    setup(ctx) {
        ctx.setup();
    },
    perform(ctx) {
        for (let i = 0; i < this.entitiesNo; i++) {
            const entity = ctx.createEntity();

            ctx.addPositionComponent(entity);
            ctx.addVelocityComponent(entity);
        }
    },
};

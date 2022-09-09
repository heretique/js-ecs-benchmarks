export default {
    name: 'Add/Remove',
    iterations: 100,
    entitiesNo: 10000,
    setup(ctx) {
        ctx.setup();
    },
    perform(ctx) {
        for (let i = 0; i < this.entitiesNo; i++) {
            const entity1 = ctx.createEntity();
            const entity2 = ctx.createEntity();

            ctx.addPositionComponent(entity1);
            ctx.addVelocityComponent(entity1);

            ctx.addPositionComponent(entity2);
            ctx.addVelocityComponent(entity2);

            ctx.removePositionComponent(entity1);
            ctx.destroyEntity(entity1);
        }
    },
};

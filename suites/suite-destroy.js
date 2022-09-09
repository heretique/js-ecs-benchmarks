export default {
    name: 'Destroy',
    iterations: 100,
    entitiesNo: 10000,
    entities: [],
    setup(ctx) {
        ctx.setup();
        for (let i = 0; i < this.entitiesNo; i++) {
            const entity = ctx.createEntity();
            this.entities.push(entity);

            ctx.addPositionComponent(entity);
            ctx.addVelocityComponent(entity);
        }
    },
    perform(ctx) {
        for (const entity of this.entities) {
             ctx.destroyEntity(entity);
        }
    },
};

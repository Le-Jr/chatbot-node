const mp = new MercadoPago('TEST-3a759c69-1193-421a-9d21-9fa14cc3bfc0');
const bricksBuilder = mp.bricks();



const plans = []
document.querySelectorAll(".buyButton").forEach((node) => {
    const plan = {
        name: node.id,
        id: node.dataset.plan
    }
    plans.push(plan)
})
plans.forEach((brick) => {
    mp.bricks().create("wallet", brick.name, {
        initialization: {
            preferenceId: brick.id,
        },
        customization: {
            texts: {
                valueProp: 'smart_option',
            },
        },
    });
}
)
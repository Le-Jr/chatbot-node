const mp = new MercadoPago("APP_USR-3a91c05c-2e2a-4cef-9037-eadc81789858");
const bricksBuilder = mp.bricks();

const plans = [];
document.querySelectorAll(".buyButton").forEach((node) => {
  const plan = {
    name: node.id,
    id: node.dataset.plan,
  };
  plans.push(plan);
});

plans.forEach((brick) => {
  mp.bricks().create("wallet", brick.name, {
    initialization: {
      preferenceId: brick.id,
    },
    customization: {
      texts: {
        valueProp: "smart_option",
      },
      visual: {
        buttonBackground: "black",
        borderRadius: "25px",
      },
    },
  });
});

const path = window.location.pathname;
const pathLocate = path.split("/");
let user = {
    id: pathLocate[2],
};

const buyButton = document.querySelectorAll(".buyButton");


buyButton.forEach((button) => {
    button.addEventListener("click", (e) => {
        const planId = e.target.dataset.plan
        buyPlan(user.id, planId)

    })
})

async function buyPlan(clientId, planId) {
    await fetch(`/user/${clientId}/${planId}/pay`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId: clientId, planId: planId }),
    }).then((response) => {
        return response.json
    }).then((result) => {
        console.log(result)
    }).catch((Error) => {
        console.log(Error)
    }
    )

}

const form = document.getElementById("form");
const inputPesos = document.getElementById("inputPesos");
const cambioResults = document.getElementById("cambioResults");
const selectMonedas = document.getElementById("selectMonedas");


const chartDOM = document.getElementById("myChart")
let myChart


// FUNCIÓN ASYNC CON REQUEST
const getMonedas = async () => {
    try {

        const res = await fetch(`https://mindicador.cl/api/${selectMonedas.value}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error("Error en el request");
        }

        const valorMoneda = +data.serie[0].valor;

        const cambioMoneda = +(valorMoneda * inputPesos.value).toFixed()

        cambioResults.textContent = `$ ${cambioMoneda.toLocaleString()}`

        return data;
    } catch (err) {
        cambioResults.textContent = err;
    }
}


// PREPARANDO LOS DATOS PARA EL CHART
const preparandoDatosParaChart = async (monedas) => {
    const ejeX = monedas.serie.map((item) => {
        return item.fecha.slice(0, 10);
    });
    const maxEjeX = ejeX.slice(0, 10);

    const ejeY = monedas.serie.map((item) => {
        return item.valor;
    });

    const maxEjeY = ejeY.slice(0, 10);

    const config = {
        type: "line",
        data: {
            labels: maxEjeX.reverse(),
            datasets: [
                {
                    label: `${selectMonedas.value}`,
                    backgroundColor: "blue",
                    data: maxEjeY.reverse(),
                },
            ],
        },
    };

    return config;
};

// RENDER EN EL CHART
async function renderizandoChart() {
    if (myChart) {
        myChart.destroy();
    }
    const monedas = await getMonedas();
    const config = await preparandoDatosParaChart(monedas);

    myChart = new Chart(chartDOM, config);
}

// CREANDO EVENTO SUBMIT
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (inputPesos.value == 0 || selectMonedas.value == "") {
        alert("Debes completar el formulario");
    } else {
        getMonedas();
        renderizandoChart();
    }
});













let listaPerfumes = [];

window.onload = function () {
    cargarPerfumes();

    document.getElementById("btnFiltrar").addEventListener("click", filtrarPerfumes);

    document.getElementById("precio").addEventListener("input", function () {
        document.getElementById("valorPrecio").textContent = "$" + this.value;
    });
};

function cargarPerfumes() {
    fetch("xml/perfumes.xml")
        .then(function (respuesta) {
            return respuesta.text();
        })
        .then(function (datos) {
            let parser = new DOMParser();
            let xml = parser.parseFromString(datos, "text/xml");

            let perfumes = xml.getElementsByTagName("perfume");

            for (let i = 0; i < perfumes.length; i++) {
                let perfume = {
                    id: perfumes[i].getElementsByTagName("id")[0].textContent,
                    nombre: perfumes[i].getElementsByTagName("nombre")[0].textContent,
                    marca: perfumes[i].getElementsByTagName("marca")[0].textContent,
                    precio: perfumes[i].getElementsByTagName("precio")[0].textContent,
                    familia: perfumes[i].getElementsByTagName("familia")[0].textContent,
                    disponible: perfumes[i].getElementsByTagName("disponible")[0].textContent,
                    imagen: perfumes[i].getElementsByTagName("imagen")[0].textContent
                };

                listaPerfumes.push(perfume);
            }

            mostrarPerfumes(listaPerfumes);
        });
}

function mostrarPerfumes(perfumes) {
    let contenedor = document.getElementById("contenedorPerfumes");
    contenedor.innerHTML = "";

    for (let i = 0; i < perfumes.length; i++) {
        contenedor.innerHTML += `
            <article class="card">
                <img src="${perfumes[i].imagen}" alt="${perfumes[i].nombre}">
                <h3>${perfumes[i].nombre}</h3>
                <p>${perfumes[i].marca}</p>
                <p class="precio">$${perfumes[i].precio}</p>
                <a href="detallesPerfume.html?id=${perfumes[i].id}">Ver detalles</a>
            </article>
        `;
    }
}

function filtrarPerfumes() {
    let marcaSeleccionada = document.getElementById("marca").value;
    let precioMaximo = Number(document.getElementById("precio").value);

    let perfumesFiltrados = [];

    for (let i = 0; i < listaPerfumes.length; i++) {
        let precioPerfume = Number(listaPerfumes[i].precio);

        if (
            (marcaSeleccionada === "" || listaPerfumes[i].marca === marcaSeleccionada)
            && precioPerfume <= precioMaximo
        ) {
            perfumesFiltrados.push(listaPerfumes[i]);
        }
    }

    mostrarPerfumes(perfumesFiltrados);
}
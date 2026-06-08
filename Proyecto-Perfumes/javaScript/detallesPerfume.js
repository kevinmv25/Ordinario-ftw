window.onload = function () {
    cargarDetallePerfume();
};

function cargarDetallePerfume() {
    let parametros = new URLSearchParams(window.location.search);
    let idPerfume = parametros.get("id");

    fetch("xml/perfumes.xml")
        .then(function (respuesta) {
            return respuesta.text();
        })
        .then(function (datos) {
            let parser = new DOMParser();
            let xml = parser.parseFromString(datos, "text/xml");

            let perfumes = xml.getElementsByTagName("perfume");

            for (let i = 0; i < perfumes.length; i++) {
                let id = perfumes[i].getElementsByTagName("id")[0].textContent;

                if (id === idPerfume) {
                    let nombre = perfumes[i].getElementsByTagName("nombre")[0].textContent;
                    let marca = perfumes[i].getElementsByTagName("marca")[0].textContent;
                    let precio = perfumes[i].getElementsByTagName("precio")[0].textContent;
                    let familia = perfumes[i].getElementsByTagName("familia")[0].textContent;
                    let disponible = perfumes[i].getElementsByTagName("disponible")[0].textContent;
                    let imagen = perfumes[i].getElementsByTagName("imagen")[0].textContent;
                    let descripcion = perfumes[i].getElementsByTagName("descripcion")[0].textContent;

                    mostrarDetalle(nombre, marca, precio, familia, disponible, imagen, descripcion);
                }
            }
        });
}

function mostrarDetalle(nombre, marca, precio, familia, disponible, imagen, descripcion) {
    let contenedor = document.getElementById("detallePerfume");

    contenedor.innerHTML = `
        <article class="imagen-detalle">
            <img src="${imagen}" alt="${nombre}">
        </article>

        <article class="info-detalle">
            <h2>${nombre}</h2>
            <p class="marca">Marca: ${marca}</p>
            <p class="precio">$${precio}</p>
            <p>${descripcion}</p>
            <p><strong>Familia olfativa:</strong> ${familia}</p>
            <p><strong>Disponibilidad:</strong> ${disponible}</p>

            <div class="botones-detalle">
                <a href="detallesCompra.html?id=${obtenerIdActual()}">Comprar</a>
                <button onclick="agregarFavorito()">Agregar a favoritos</button>
            </div>
        </article>
    `;
}

function obtenerIdActual() {
    let parametros = new URLSearchParams(window.location.search);
    return parametros.get("id");
}

function agregarFavorito() {
    alert("Perfume agregado a favoritos");
}
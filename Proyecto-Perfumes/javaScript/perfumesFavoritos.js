window.onload = function () {
    cargarFavoritos();
};

function cargarFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    let contenedor = document.getElementById("contenedorFavoritos");
    contenedor.innerHTML = "";

    if (favoritos.length === 0) {
        contenedor.innerHTML = `
            <p class="mensaje-vacio">
                No tienes perfumes agregados a favoritos.
            </p>
        `;
        return;
    }

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

                if (favoritos.includes(id)) {
                    let nombre = perfumes[i].getElementsByTagName("nombre")[0].textContent;
                    let marca = perfumes[i].getElementsByTagName("marca")[0].textContent;
                    let precio = perfumes[i].getElementsByTagName("precio")[0].textContent;
                    let imagen = perfumes[i].getElementsByTagName("imagen")[0].textContent;

                    contenedor.innerHTML += `
                        <article class="card-favorito">
                            <img src="${imagen}" alt="${nombre}">
                            <h2>${nombre}</h2>
                            <p>${marca}</p>
                            <p>$${precio}</p>

                            <a href="detallesPerfume.html?id=${id}">
                                Ver detalles
                            </a>

                            <button onclick="eliminarFavorito('${id}')">
                                Eliminar
                            </button>
                        </article>
                    `;
                }
            }
        });
}

function eliminarFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    favoritos = favoritos.filter(function (favorito) {
        return favorito !== id;
    });

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    cargarFavoritos();
}
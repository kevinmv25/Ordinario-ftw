let perfumesXML = [];

window.onload = function () {
    cargarDatosCompra();

    document.getElementById("btnComprar").addEventListener("click", confirmarCompra);
};

function cargarDatosCompra() {
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
                    precio: Number(perfumes[i].getElementsByTagName("precio")[0].textContent),
                    imagen: perfumes[i].getElementsByTagName("imagen")[0].textContent
                };

                perfumesXML.push(perfume);
            }

            mostrarCompra();
        });
}

function mostrarCompra() {
    let compra = JSON.parse(localStorage.getItem("compra")) || [];

    let contenedor = document.getElementById("listaCompra");
    contenedor.innerHTML = "";

    if (compra.length === 0) {
        contenedor.innerHTML = `
            <p class="mensaje-vacio">
                No hay perfumes agregados a la compra.
            </p>
        `;

        document.getElementById("subtotalGeneral").textContent = "$0";
        document.getElementById("totalGeneral").textContent = "$0";
        return;
    }

    let totalGeneral = 0;

    for (let i = 0; i < compra.length; i++) {
        let perfume = buscarPerfume(compra[i].id);

        if (perfume !== null) {
            let subtotal = perfume.precio * compra[i].cantidad;
            totalGeneral = totalGeneral + subtotal;

            contenedor.innerHTML += `
                <article class="item-compra">
                    <img src="${perfume.imagen}" alt="${perfume.nombre}">

                    <div class="info-item">
                        <h3>${perfume.nombre}</h3>
                        <p>${perfume.marca}</p>
                        <p>Precio: $${perfume.precio}</p>

                        <div class="controles-cantidad">
                            <button onclick="bajarCantidad('${perfume.id}')">-</button>

                            <input type="number"
                                   value="${compra[i].cantidad}"
                                   min="1"
                                   onchange="cambiarCantidad('${perfume.id}', this.value)">

                            <button onclick="subirCantidad('${perfume.id}')">+</button>
                        </div>

                        <p class="subtotal-item">
                            Subtotal: $${subtotal}
                        </p>

                        <button class="btn-eliminar"
                                onclick="eliminarCompra('${perfume.id}')">
                            Eliminar
                        </button>
                    </div>
                </article>
            `;
        }
    }

    document.getElementById("subtotalGeneral").textContent = "$" + totalGeneral;
    document.getElementById("totalGeneral").textContent = "$" + totalGeneral;
}

function buscarPerfume(id) {
    for (let i = 0; i < perfumesXML.length; i++) {
        if (perfumesXML[i].id === id) {
            return perfumesXML[i];
        }
    }

    return null;
}

function subirCantidad(id) {
    let compra = JSON.parse(localStorage.getItem("compra")) || [];

    for (let i = 0; i < compra.length; i++) {
        if (compra[i].id === id) {
            compra[i].cantidad = compra[i].cantidad + 1;
        }
    }

    localStorage.setItem("compra", JSON.stringify(compra));

    mostrarCompra();
}

function bajarCantidad(id) {
    let compra = JSON.parse(localStorage.getItem("compra")) || [];

    for (let i = 0; i < compra.length; i++) {
        if (compra[i].id === id && compra[i].cantidad > 1) {
            compra[i].cantidad = compra[i].cantidad - 1;
        }
    }

    localStorage.setItem("compra", JSON.stringify(compra));

    mostrarCompra();
}

function cambiarCantidad(id, nuevaCantidad) {
    let compra = JSON.parse(localStorage.getItem("compra")) || [];

    nuevaCantidad = Number(nuevaCantidad);

    if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) {
        nuevaCantidad = 1;
    }

    for (let i = 0; i < compra.length; i++) {
        if (compra[i].id === id) {
            compra[i].cantidad = nuevaCantidad;
        }
    }

    localStorage.setItem("compra", JSON.stringify(compra));

    mostrarCompra();
}

function eliminarCompra(id) {
    let compra = JSON.parse(localStorage.getItem("compra")) || [];

    compra = compra.filter(function (producto) {
        return producto.id !== id;
    });

    localStorage.setItem("compra", JSON.stringify(compra));

    mostrarCompra();
}

function confirmarCompra() {
    let compra = JSON.parse(localStorage.getItem("compra")) || [];

    if (compra.length === 0) {
        document.getElementById("mensajeCompra").textContent =
            "No hay productos para comprar.";
        return;
    }

    localStorage.removeItem("compra");

    document.getElementById("mensajeCompra").textContent =
        "Compra registrada correctamente.";

    mostrarCompra();
}
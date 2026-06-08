window.onload = function () {
    document.getElementById("formLogin").addEventListener("submit", iniciarSesion);
};

function iniciarSesion(evento) {
    evento.preventDefault();

    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;

    if (correo === "" || password === "") {
        document.getElementById("mensajeLogin").textContent = "Debe ingresar correo y contraseña.";
        return;
    }

    validarConXML(correo, password);
}

function validarConXML(correo, password) {
    fetch("xml/usuarios.xml")
        .then(function (respuesta) {
            return respuesta.text();
        })
        .then(function (datos) {
            let parser = new DOMParser();
            let xml = parser.parseFromString(datos, "text/xml");

            let usuarios = xml.getElementsByTagName("usuario");

            for (let i = 0; i < usuarios.length; i++) {
                let correoXML = usuarios[i].getElementsByTagName("correo")[0].textContent;
                let passwordXML = usuarios[i].getElementsByTagName("password")[0].textContent;

                if (correo === correoXML && password === passwordXML) {
                    document.getElementById("mensajeLogin").textContent = "Inicio de sesión correcto.";

                    setTimeout(function () {
                        window.location.href = "principal.html";
                    }, 1000);

                    return;
                }
            }

            validarConLocalStorage(correo, password);
        });
}

function validarConLocalStorage(correo, password) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === correo && usuarios[i].password === password) {
            document.getElementById("mensajeLogin").textContent = "Inicio de sesión correcto.";

            setTimeout(function () {
                window.location.href = "principal.html";
            }, 1000);

            return;
        }
    }

    document.getElementById("mensajeLogin").textContent = "Correo o contraseña incorrectos.";
}
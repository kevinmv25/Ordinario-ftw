window.onload = function () {
    document.getElementById("formCrearCuenta").addEventListener("submit", crearCuenta);
};

function crearCuenta(evento) {
    evento.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;
    let password = document.getElementById("password").value;
    let confirmarPassword = document.getElementById("confirmarPassword").value;
    let aceptar = document.getElementById("aceptar").checked;

    if (nombre === "" || correo === "" || telefono === "" || password === "" || confirmarPassword === "") {
        document.getElementById("mensajeCuenta").textContent = "Debe llenar todos los campos.";
        return;
    }

    if (password !== confirmarPassword) {
        document.getElementById("mensajeCuenta").textContent = "Las contraseñas no coinciden.";
        return;
    }

    if (aceptar === false) {
        document.getElementById("mensajeCuenta").textContent = "Debe aceptar los términos y condiciones.";
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === correo) {
            document.getElementById("mensajeCuenta").textContent = "Este correo ya está registrado.";
            return;
        }
    }

    let usuarioNuevo = {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        password: password
    };

    usuarios.push(usuarioNuevo);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    document.getElementById("mensajeCuenta").textContent = "Cuenta creada correctamente.";

    document.getElementById("formCrearCuenta").reset();
}
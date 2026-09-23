// ============================================================
// REGISTRO DE VISITAS
// CÁMARA + GPS + GOOGLE APPS SCRIPT
// ============================================================

const piso =
    new URLSearchParams(window.location.search).get("piso") || "No identificado";

const pisoLabel = document.getElementById("pisoLabel");

if (pisoLabel) {
    pisoLabel.textContent = piso;
}


// ============================================================
// VARIABLES
// ============================================================

let tipoSeleccionado = "";

let cameraStream = null;

let photoBlob = null;


// ============================================================
// ELEMENTOS
// ============================================================

const visitForm = document.getElementById("visitForm");

const openCameraBtn =
    document.getElementById("openCameraBtn");

const takePhotoBtn =
    document.getElementById("takePhotoBtn");

const retakePhotoBtn =
    document.getElementById("retakePhotoBtn");

const cameraContainer =
    document.getElementById("cameraContainer");

const camera =
    document.getElementById("camera");

const canvas =
    document.getElementById("canvas");

const previewWrap =
    document.getElementById("previewWrap");

const preview =
    document.getElementById("preview");

const locationBtn =
    document.getElementById("locationBtn");

const locationStatus =
    document.getElementById("locationStatus");

const sendBtn =
    document.getElementById("sendBtn");

const status =
    document.getElementById("status");


// ============================================================
// SELECCIÓN MANTENCIÓN / SEGURIDAD
// ============================================================

document.querySelectorAll(".staff").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".staff").forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        tipoSeleccionado =
            button.dataset.tipo;

        document.getElementById("tipo").value =
            tipoSeleccionado;

    });

});


// ============================================================
// ABRIR CÁMARA
// ============================================================

openCameraBtn.addEventListener("click", async () => {

    try {

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {

            alert(
                "Tu navegador no permite utilizar la cámara directamente."
            );

            return;
        }

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "environment"
                    },
                    width: {
                        ideal: 1280
                    },
                    height: {
                        ideal: 720
                    }
                },
                audio: false
            });

        camera.srcObject =
            cameraStream;

        cameraContainer.classList.remove("hidden");

        openCameraBtn.classList.add("hidden");

        previewWrap.classList.add("hidden");

    } catch (error) {

        console.error(error);

        alert(
            "No fue posible abrir la cámara. " +
            "Debes permitir el acceso a la cámara."
        );

    }

});


// ============================================================
// TOMAR FOTOGRAFÍA
// ============================================================

takePhotoBtn.addEventListener("click", () => {

    if (!cameraStream) {
        return;
    }

    const width =
        camera.videoWidth;

    const height =
        camera.videoHeight;

    if (!width || !height) {

        alert(
            "La cámara todavía no está lista. Intenta nuevamente."
        );

        return;
    }

    canvas.width = width;
    canvas.height = height;

    const context =
        canvas.getContext("2d");

    context.drawImage(
        camera,
        0,
        0,
        width,
        height
    );

    canvas.toBlob(
        blob => {

            if (!blob) {

                alert(
                    "No fue posible capturar la fotografía."
                );

                return;
            }

            photoBlob = blob;

            const imageURL =
                URL.createObjectURL(blob);

            preview.src =
                imageURL;

            previewWrap.classList.remove("hidden");

            cameraContainer.classList.add("hidden");

            stopCamera();

        },
        "image/jpeg",
        0.82
    );

});


// ============================================================
// REPETIR FOTOGRAFÍA
// ============================================================

retakePhotoBtn.addEventListener("click", async () => {

    photoBlob = null;

    preview.src = "";

    previewWrap.classList.add("hidden");

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "environment"
                    },
                    width: {
                        ideal: 1280
                    },
                    height: {
                        ideal: 720
                    }
                },
                audio: false
            });

        camera.srcObject =
            cameraStream;

        cameraContainer.classList.remove("hidden");

    } catch (error) {

        alert(
            "No fue posible volver a abrir la cámara."
        );

    }

});


// ============================================================
// DETENER CÁMARA
// ============================================================

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => track.stop());

        cameraStream = null;

    }

    camera.srcObject = null;

}


// ============================================================
// GPS
// ============================================================

locationBtn.addEventListener("click", obtenerUbicacion);

function obtenerUbicacion() {

    if (!navigator.geolocation) {

        locationStatus.textContent =
            "Este dispositivo no permite obtener ubicación.";

        return;
    }

    locationStatus.textContent =
        "Obteniendo ubicación...";

    locationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                position.coords.accuracy;

            document.getElementById("latitud").value =
                latitude;

            document.getElementById("longitud").value =
                longitude;

            document.getElementById("accuracy").value =
                accuracy;

            locationStatus.textContent =
                "✅ Ubicación registrada correctamente.";

            locationBtn.textContent =
                "✅ Ubicación registrada";

        },

        error => {

            console.error(error);

            locationStatus.textContent =
                "⚠️ No se pudo obtener la ubicación. Puedes intentar nuevamente.";

            locationBtn.disabled = false;

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

}


// ============================================================
// ENVÍO DEL FORMULARIO
// ============================================================

visitForm.addEventListener("submit", async event => {

    event.preventDefault();

    status.textContent = "";

    // ------------------------------------------
    // VALIDAR TIPO
    // ------------------------------------------

    if (!tipoSeleccionado) {

        status.textContent =
            "Selecciona Mantención o Seguridad.";

        return;
    }


    // ------------------------------------------
    // VALIDAR FOTO
    // ------------------------------------------

    if (!photoBlob) {

        status.textContent =
            "Debes tomar una fotografía antes de enviar el registro.";

        return;
    }


    // ------------------------------------------
    // VALIDAR GPS
    // ------------------------------------------

    const latitud =
        document.getElementById("latitud").value;

    const longitud =
        document.getElementById("longitud").value;

    if (!latitud || !longitud) {

        status.textContent =
            "Debes registrar tu ubicación antes de enviar.";

        return;
    }


    // ------------------------------------------
    // BLOQUEAR BOTÓN
    // ------------------------------------------

    sendBtn.disabled = true;

    sendBtn.textContent =
        "Enviando registro...";


    try {

        // --------------------------------------
        // CONVERTIR FOTO A BASE64
        // --------------------------------------

        const base64 =
            await blobToBase64(photoBlob);


        // --------------------------------------
        // DATOS
        // --------------------------------------

        const data =
            new URLSearchParams();

        data.append(
            "piso",
            piso
        );

        data.append(
            "tipo",
            tipoSeleccionado
        );

        data.append(
            "nombre",
            document.getElementById("nombre").value.trim()
        );

        data.append(
            "correo",
            document.getElementById("correo").value.trim()
        );

        data.append(
            "telefono",
            document.getElementById("telefono").value.trim()
        );

        data.append(
            "mensaje",
            document.getElementById("mensaje").value.trim()
        );

        data.append(
            "fotoBase64",
            base64
        );

        data.append(
            "fotoMime",
            "image/jpeg"
        );

        data.append(
            "fotoNombre",
            "foto_visita.jpg"
        );

        data.append(
            "latitud",
            latitud
        );

        data.append(
            "longitud",
            longitud
        );

        data.append(
            "accuracy",
            document.getElementById("accuracy").value
        );


        // --------------------------------------
        // ENVÍO A GOOGLE APPS SCRIPT
        // --------------------------------------

        await fetch(
            APPS_SCRIPT_URL,
            {
                method: "POST",
                mode: "no-cors",
                body: data
            }
        );


        // --------------------------------------
        // ÉXITO
        // --------------------------------------

        window.location.href =
            "./gracias.html";


    } catch (error) {

        console.error(error);

        status.textContent =
            "No fue posible enviar el registro.";

        sendBtn.disabled = false;

        sendBtn.textContent =
            "Enviar registro";

    }

});


// ============================================================
// BLOB → BASE64
// ============================================================

function blobToBase64(blob) {

    return new Promise((resolve, reject) => {

        const reader =
            new FileReader();

        reader.onloadend = () => {

            const result =
                reader.result;

            const base64 =
                result.split(",")[1];

            resolve(base64);

        };

        reader.onerror =
            reject;

        reader.readAsDataURL(blob);

    });

}


// ============================================================
// LIMPIAR CÁMARA AL SALIR
// ============================================================

window.addEventListener(
    "beforeunload",
    stopCamera
);
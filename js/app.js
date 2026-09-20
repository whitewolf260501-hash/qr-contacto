// ============================================================
// FORMULARIO QR + WEB3FORMS
// ============================================================

const form = document.getElementById("contactForm");
const status = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

// Access Key directamente configurada
const WEB3FORMS_ACCESS_KEY =
    "aec0b1b0-d22a-4f29-85ac-01fd8c2622ed";

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    status.textContent = "";

    const formData = new FormData(form);

    // Agregar Access Key directamente
    formData.set("access_key", WEB3FORMS_ACCESS_KEY);

    try {

        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        console.log("Respuesta Web3Forms:", result);

        if (result.success) {

            window.location.href = "./gracias.html";

        } else {

            status.textContent =
                result.message ||
                "No se pudo enviar el mensaje.";

            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar mensaje";
        }

    } catch (error) {

        console.error("Error:", error);

        status.textContent =
            "No se pudo conectar con Web3Forms.";

        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensaje";
    }

});
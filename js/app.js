const form = document.getElementById("contactForm");
const accessKey = document.getElementById("accessKey");
const status = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

accessKey.value = WEB3FORMS_ACCESS_KEY;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (WEB3FORMS_ACCESS_KEY === "TU_ACCESS_KEY") {
    status.textContent = "Falta configurar el Access Key de Web3Forms.";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  status.textContent = "";

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = "./gracias.html";
      return;
    }

    throw new Error(result.message || "Error al enviar");
  } catch (error) {
    console.error(error);
    status.textContent =
      "No se pudo enviar el mensaje. Revisa la configuración e inténtalo nuevamente.";
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar mensaje";
  }
});

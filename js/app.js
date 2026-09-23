<<<<<<< HEAD
const form=document.getElementById("visitForm");
const piso=new URLSearchParams(location.search).get("piso")||"No identificado";
const pisoLabel=document.getElementById("pisoLabel");
const foto=document.getElementById("foto");
const preview=document.getElementById("preview");
const previewWrap=document.getElementById("previewWrap");
const statusBox=document.getElementById("status");
const sendBtn=document.getElementById("sendBtn");
let tipo="";

pisoLabel.textContent=piso==="No identificado"?piso:`Piso ${piso}`;

document.querySelectorAll(".staff").forEach(btn=>{
  btn.addEventListener("click",()=>{
    tipo=btn.dataset.tipo;
    document.querySelectorAll(".staff").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

foto.addEventListener("change",()=>{
  const file=foto.files[0];
  if(!file){previewWrap.classList.add("hidden");return;}
  preview.src=URL.createObjectURL(file);
  previewWrap.classList.remove("hidden");
});

function comprimirImagen(file,maxWidth=1400,quality=.78){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width,h=img.height;
        if(w>maxWidth){h=Math.round(h*maxWidth/w);w=maxWidth;}
        const canvas=document.createElement("canvas");
        canvas.width=w;canvas.height=h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        canvas.toBlob(blob=>{
          if(!blob)return reject(new Error("No se pudo procesar la fotografía."));
          const r=new FileReader();
          r.onload=()=>resolve({base64:r.result.split(",")[1],mime:blob.type});
          r.onerror=reject;
          r.readAsDataURL(blob);
        },"image/jpeg",quality);
      };
      img.onerror=reject;
      img.src=reader.result;
    };
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}

form.addEventListener("submit",async e=>{
  e.preventDefault();

  if(!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PEGA_AQUI")){
    statusBox.textContent="Falta configurar la URL de Google Apps Script.";
    statusBox.className="status error";
    return;
  }
  if(!tipo){
    statusBox.textContent="Selecciona Mantención o Seguridad.";
    statusBox.className="status error";
    return;
  }
  if(!foto.files[0]){
    statusBox.textContent="Debes tomar una fotografía.";
    statusBox.className="status error";
    return;
  }

  sendBtn.disabled=true;
  sendBtn.textContent="Enviando...";
  statusBox.textContent="Preparando fotografía...";
  statusBox.className="status loading";

  try{
    const image=await comprimirImagen(foto.files[0]);

    const data=new URLSearchParams();
    data.append("piso",piso);
    data.append("tipo",tipo);
    data.append("nombre",document.getElementById("nombre").value.trim());
    data.append("correo",document.getElementById("correo").value.trim());
    data.append("telefono",document.getElementById("telefono").value.trim());
    data.append("mensaje",document.getElementById("mensaje").value.trim());
    data.append("fotoBase64",image.base64);
    data.append("fotoMime",image.mime);
    data.append("fotoNombre",foto.files[0].name);

    statusBox.textContent="Enviando registro y fotografía...";

    await fetch(APPS_SCRIPT_URL,{
      method:"POST",
      mode:"no-cors",
      body:data
    });

    // no-cors no permite leer la respuesta, pero la solicitud se envía.
    location.href="./gracias.html";
  }catch(error){
    console.error(error);
    statusBox.textContent="No se pudo enviar el registro. Inténtalo nuevamente.";
    statusBox.className="status error";
    sendBtn.disabled=false;
    sendBtn.textContent="Enviar registro";
  }
});
=======
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
>>>>>>> 1adc5f276837ec90d428288b3347aacd7134431e

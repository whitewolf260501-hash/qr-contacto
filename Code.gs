// ============================================================
// REGISTRO DE VISITAS - GOOGLE APPS SCRIPT
// ============================================================
// 1) Pega aquí el ID de tu Google Sheets.
// 2) Pega aquí el ID de tu carpeta de Google Drive.
// 3) Pega aquí el correo que recibirá las notificaciones.
// 4) Implementa como Aplicación web.
// ============================================================

const CONFIG = {
  SPREADSHEET_ID: "19JGCD1MvWJX6G68AEOQtkRpEvn_ZMa3JqXVZMyyZMPk",
  SHEET_NAME: "Registros",
  FOLDER_ID: "1dA0SgmIAcRlxEX0R7lGvd_Xj6ey8IW3i",
  DESTINATARIO: "whitewolf.soporte@gmail.com"
};
function doGet() {
  return ContentService
    .createTextOutput("Sistema de registro activo.");
}

function doPost(e) {
  try {
    const p = e.parameter || {};

    const piso = clean_(p.piso);
    const tipo = clean_(p.tipo);
    const nombre = clean_(p.nombre);
    const mensaje = clean_(p.mensaje);

    if (!piso || !tipo || !nombre || !p.fotoBase64) {
      return json_({ok:false, error:"Faltan datos obligatorios."});
    }

    const ahora = new Date();

    // Crear archivo de imagen en Drive.
    const bytes = Utilities.base64Decode(p.fotoBase64);
    const mime = p.fotoMime || "image/jpeg";
    const extension = mime === "image/png" ? "png" : "jpg";
    const original = (p.fotoNombre || "foto").replace(/[^a-zA-Z0-9._-]/g,"_");
    const nombreArchivo =
      "Piso_" + piso + "_" +
      tipo.replace(/[^a-zA-Z0-9_-]/g,"_") + "_" +
      Utilities.formatDate(ahora, Session.getScriptTimeZone(), "yyyyMMdd_HHmmss") +
      "_" + original.replace(/\.[^.]+$/,"") + "." + extension;

    const blob = Utilities.newBlob(bytes, mime, nombreArchivo);
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    const file = folder.createFile(blob);

    // Registrar en Google Sheets.
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
      sheet.appendRow([
        "Fecha y hora","Piso","Personal","Nombre",
        "Mensaje","Archivo","ID archivo"
      ]);
    }

    sheet.appendRow([
      ahora,
      piso,
      tipo,
      nombre,
      mensaje,
      file.getUrl(),
      file.getId()
    ]);

    // Enviar correo con la fotografía como archivo adjunto.
    const asunto =
      "Nueva visita - Piso " + piso + " - " + tipo;

    const cuerpo =
      "NUEVO REGISTRO DE VISITA\n\n" +
      "Piso: " + piso + "\n" +
      "Personal: " + tipo + "\n" +
      "Nombre: " + nombre + "\n" +
      "Fecha: " + Utilities.formatDate(ahora, Session.getScriptTimeZone(), "dd/MM/yyyy") + "\n" +
      "Hora: " + Utilities.formatDate(ahora, Session.getScriptTimeZone(), "HH:mm:ss") + "\n\n" +
      "Mensaje:\n" + mensaje + "\n\n" +
      "Fotografía guardada en Google Drive:\n" + file.getUrl();

    MailApp.sendEmail({
      to: CONFIG.DESTINATARIO,
      subject: asunto,
      body: cuerpo,
      attachments: [file.getBlob()],
      name: "Registro de visitas del edificio"
    });

    return json_({ok:true, id:file.getId()});

  } catch (error) {
    console.error(error);
    return json_({ok:false, error:String(error)});
  }
}

function clean_(value) {
  return String(value || "").trim();
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

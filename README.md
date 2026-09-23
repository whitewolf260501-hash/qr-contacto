# QR Edificio - GitHub Pages + Google Apps Script

## Arquitectura

GitHub Pages sirve la página pública.

Google Apps Script:
- recibe el formulario;
- guarda la fotografía en Google Drive;
- registra la visita en Google Sheets;
- envía un correo con la fotografía como archivo adjunto.

## 1. Google Sheets

Crea una hoja y copia su ID desde la URL:

https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit

El proyecto usa una pestaña llamada `Registros`. Si no existe, Apps Script la crea.

## 2. Google Drive

Copia el ID de la carpeta desde:

https://drive.google.com/drive/folders/ESTE_ES_EL_ID

No hace falta hacer pública la carpeta para que el sistema guarde el archivo.

## 3. Google Apps Script

Abre Apps Script y reemplaza todo el contenido de `Code.gs` por el código incluido.

Completa:

SPREADSHEET_ID
FOLDER_ID
DESTINATARIO

Ejemplo:

const CONFIG = {
  SPREADSHEET_ID: "1AbCd...",
  SHEET_NAME: "Registros",
  FOLDER_ID: "1XyZ...",
  DESTINATARIO: "correo@ejemplo.com"
};

Guarda.

## 4. Implementar

En Apps Script:

Implementar > Nueva implementación > Aplicación web

Ejecutar como:
- Yo

Quién tiene acceso:
- Cualquier persona

Autoriza los permisos de Google cuando los solicite.

Copia la URL terminada en `/exec`.

## 5. GitHub

En `js/config.js` pega:

const APPS_SCRIPT_URL = "URL_DEL_WEB_APP";

Sube el proyecto a tu repositorio GitHub Pages.

## 6. QR por piso

El generador crea URLs:

...?piso=1
...?piso=2
...?piso=3

etc.

Cambia TOTAL_PISOS en `generar-qrs.html`.

## 7. Fotografía

El navegador solicita la cámara mediante:

accept="image/*"
capture="environment"

La página comprime la fotografía antes de enviarla para reducir el tamaño del correo.

Apps Script guarda la imagen en Drive y MailApp la manda como adjunto.

## Importante

La clave de Google Apps Script NO se coloca en GitHub.

El código del frontend solo contiene la URL pública `/exec`.

Nunca pongas una contraseña ni credenciales privadas de Google en `config.js`.

## Prueba

Primero prueba con:
- un piso;
- una fotografía pequeña;
- un correo propio.

Comprueba:
1. llegó el correo;
2. la foto llegó como adjunto;
3. apareció la fila en Sheets;
4. apareció el archivo en Drive.

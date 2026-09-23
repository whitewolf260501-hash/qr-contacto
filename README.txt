QR + FORMULARIO + WEB3FORMS
============================

Esta versión reemplaza Firebase y EmailJS.

OBJETIVO
--------
Cliente escanea QR
      ↓
Página web
      ↓
Formulario
      ↓
Web3Forms
      ↓
Tu correo


VENTAJAS
--------
- No usa Firebase.
- No usa PHP.
- Funciona en GitHub Pages.
- El cliente no necesita Gmail ni Outlook.
- No necesitas crear Service ID ni Template ID.
- No necesitas Public Key de EmailJS.
- Solo necesitas un Access Key de Web3Forms.
- El QR puede mantenerse fijo.

PLAN GRATUITO
-------------
Web3Forms indica actualmente que su plan gratuito permite 250 envíos al mes y formularios ilimitados.

CONFIGURACIÓN
-------------

1. Crea una cuenta gratuita en Web3Forms.

2. Crea un Access Key.

3. El correo receptor se configura en Web3Forms.

4. Abre:
   js/config.js

5. Cambia:

   const WEB3FORMS_ACCESS_KEY = "TU_ACCESS_KEY";

   por tu Access Key.

EJEMPLO:

   const WEB3FORMS_ACCESS_KEY = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";


CAMBIAR EL CORREO RECEPTOR
--------------------------
No tienes que modificar el QR.

El destinatario se administra desde Web3Forms.
Si posteriormente cambias el correo receptor en la configuración del servicio,
la URL del QR sigue siendo la misma.

Si quieres cambiar solamente el texto del mensaje que recibes, también
puedes modificar los campos subject/from_name del formulario.


GITHUB PAGES
------------
Sube:

index.html
gracias.html
css/styles.css
js/config.js
js/app.js

La URL será similar a:

https://TU-USUARIO.github.io/TU-REPOSITORIO/


QR
--
El QR debe apuntar a:

https://TU-USUARIO.github.io/TU-REPOSITORIO/

No apuntes el QR directamente a Web3Forms.

Así puedes cambiar el diseño del formulario sin volver a generar el QR.


IMPORTANTE
----------
El Access Key es una credencial pública pensada para formularios web.
No coloques contraseñas de correo, API keys privadas ni credenciales de
administrador en JavaScript público.

Web3Forms puede aplicar límites y protecciones contra abuso/spam.

function launchEmail({ name, playStoreUrl = 'https://play.google.com/store/apps/details?id=com.abuelitoscontentos' }) {
  const firstName = name ? name.split(' ')[0] : 'amigo/a';
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#FFF8F0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F0;padding:40px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- CONFETTI HEADER -->
        <tr><td style="background:linear-gradient(135deg,#F07A5A,#E8567A);border-radius:20px 20px 0 0;padding:50px 40px 40px;text-align:center;">
          <p style="margin:0 0 12px;font-size:56px;line-height:1;">🎉</p>
          <h1 style="margin:0;color:#fff;font-size:32px;font-weight:900;letter-spacing:-1px;">¡Ya está aquí!</h1>
          <p style="margin:12px 0 0;color:rgba(255,255,255,0.95);font-size:18px;font-weight:700;">
            Abuelitos Contentos ya está disponible en Google Play
          </p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#fff;padding:36px 40px;border-left:1px solid #fde8d0;border-right:1px solid #fde8d0;">
          <p style="margin:0 0 20px;font-size:17px;color:#3D1C0B;line-height:1.6;">
            ¡Hola <strong>${firstName}</strong>! 🌻
          </p>
          <p style="margin:0 0 20px;font-size:15px;color:#5a3010;line-height:1.7;">
            Este es el momento que estábamos esperando. La app que diseñamos con todo el amor
            del mundo para que los abuelos estén más felices ya está disponible. Y tú eres
            de los <strong>primeros en tenerla</strong>.
          </p>

          <!-- BIG CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#FFF8F0,#FFF1E0);border:2px solid #F5A623;border-radius:16px;margin-bottom:28px;">
            <tr><td style="padding:28px;text-align:center;">
              <p style="margin:0 0 16px;font-size:32px;">📱</p>
              <p style="margin:0 0 16px;font-size:15px;color:#5a3010;font-weight:600;line-height:1.6;">
                Descárgala ahora y dásela a tu abuelito/a.<br/>
                <strong>Es completamente gratis.</strong>
              </p>
              <a href="${playStoreUrl}" style="display:inline-block;background:#F5A623;color:#fff;text-decoration:none;font-weight:800;font-size:16px;padding:16px 36px;border-radius:100px;">
                ⬇️ Descargar en Google Play
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 12px;font-size:14px;font-weight:800;color:#F07A5A;">Recuerda que incluye:</p>
          ${['📞 Videollamadas con un toque','🧩 Juegos para la mente','💊 Recordatorio de medicamentos','📸 Álbum familiar compartido','🎵 Música de su época','👨‍👩‍👧 Círculo de cuidado familiar']
            .map(f => `<p style="margin:0 0 8px;font-size:14px;color:#3D1C0B;">✅ ${f}</p>`).join('')}
        </td></tr>

        <!-- SHARE -->
        <tr><td style="background:#FFF8F0;padding:24px 40px;border:1px solid #fde8d0;text-align:center;">
          <p style="margin:0 0 12px;font-size:14px;color:#7a4020;font-weight:600;">
            ¿Tienes amigos con abuelos? Comparte y haz feliz a más familias 💛
          </p>
          <a href="https://abuelitoscontentos.com" style="font-size:13px;color:#F07A5A;font-weight:700;">
            abuelitoscontentos.com
          </a>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#FFF8F0;border:1px solid #fde8d0;border-radius:0 0 20px 20px;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#b08060;line-height:1.7;">
            © 2025 Abuelitos Contentos · Hecho con ❤️ para los abuelos del mundo<br/>
            <a href="https://abuelitoscontentos.com/unsubscribe" style="color:#F07A5A;">Cancelar suscripción</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

module.exports = { launchEmail };

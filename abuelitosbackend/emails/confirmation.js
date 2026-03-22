function confirmationEmail({ name, email }) {
  const firstName = name ? name.split(' ')[0] : 'amigo/a';
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#FFF8F0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F0;padding:40px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#F5A623,#F07A5A);border-radius:20px 20px 0 0;padding:40px 40px 32px;text-align:center;">
          <p style="margin:0 0 8px;font-size:42px;">💛</p>
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:900;letter-spacing:-1px;">¡Estás dentro!</h1>
          <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px;font-weight:600;">
            Ya formas parte de la familia Abuelitos Contentos
          </p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#fff;padding:36px 40px;border-left:1px solid #fde8d0;border-right:1px solid #fde8d0;">
          <p style="margin:0 0 20px;font-size:17px;color:#3D1C0B;line-height:1.6;">
            Hola <strong>${firstName}</strong> 👋
          </p>
          <p style="margin:0 0 20px;font-size:15px;color:#5a3010;line-height:1.7;">
            Gracias por unirte a la lista de espera. Cuando lancemos la app en <strong>Google Play</strong>,
            serás de los primeros en enterarte — y tendrás acceso prioritario.
          </p>

          <!-- WHAT TO EXPECT -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F0;border-radius:12px;padding:24px;margin-bottom:24px;">
            <tr><td>
              <p style="margin:0 0 16px;font-size:14px;font-weight:800;color:#F07A5A;text-transform:uppercase;letter-spacing:1px;">Qué incluirá la app</p>
              ${[
                ['📞','Videollamadas con un toque','Sin contraseñas, sin complicaciones'],
                ['🧩','Juegos para la mente','Crucigramas, memoria y más'],
                ['💊','Recordatorio de medicamentos','Nunca más un olvido'],
                ['👨‍👩‍👧','Círculo de cuidado familiar','Familia coordinada y tranquila'],
              ].map(([icon,title,sub]) => `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td width="40" style="font-size:22px;vertical-align:top;padding-top:2px;">${icon}</td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:14px;font-weight:700;color:#3D1C0B;">${title}</p>
                    <p style="margin:2px 0 0;font-size:13px;color:#9a5030;">${sub}</p>
                  </td>
                </tr>
              </table>`).join('')}
            </td></tr>
          </table>

          <p style="margin:0 0 8px;font-size:14px;color:#9a5030;line-height:1.6;">
            Mientras tanto, cuéntale a tu familia sobre nosotros. Cuantos más seamos, mejor app construiremos juntos. 💛
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#fff;padding:0 40px 36px;border-left:1px solid #fde8d0;border-right:1px solid #fde8d0;text-align:center;">
          <a href="https://abuelitoscontentos.com" style="display:inline-block;background:linear-gradient(135deg,#F5A623,#F07A5A);color:#fff;text-decoration:none;font-weight:800;font-size:15px;padding:14px 32px;border-radius:100px;">
            Ver la landing page 🌻
          </a>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#FFF8F0;border:1px solid #fde8d0;border-radius:0 0 20px 20px;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#b08060;line-height:1.7;">
            Recibiste este email porque te registraste en <strong>abuelitoscontentos.com</strong><br/>
            Si no fuiste tú, ignora este mensaje.<br/>
            © 2025 Abuelitos Contentos · Hecho con ❤️ para los abuelos del mundo
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

module.exports = { confirmationEmail };

function careInviteEmail({ inviterName, grandparentName, circleId, inviteeEmail }) {
  const joinUrl = `https://abuelitoscontentos.com/circulo?id=${circleId}&email=${encodeURIComponent(inviteeEmail)}`;
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#FFF8F0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F0;padding:40px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#4A7C59,#5B9EC9);border-radius:20px 20px 0 0;padding:44px 40px 36px;text-align:center;">
          <p style="margin:0 0 10px;font-size:44px;">👨‍👩‍👧‍👦</p>
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:900;letter-spacing:-0.5px;">
            Te invitan al círculo de cuidado
          </h1>
          <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:15px;font-weight:600;">
            de <strong>${grandparentName}</strong>
          </p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#fff;padding:36px 40px;border-left:1px solid #d0eadb;border-right:1px solid #d0eadb;">
          <p style="margin:0 0 18px;font-size:16px;color:#3D1C0B;line-height:1.6;">
            Hola 👋
          </p>
          <p style="margin:0 0 18px;font-size:15px;color:#1a3a26;line-height:1.7;">
            <strong>${inviterName}</strong> te ha invitado a unirte al
            <strong>círculo de cuidado de ${grandparentName}</strong> en Abuelitos Contentos.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#1a3a26;line-height:1.7;">
            El círculo de cuidado permite que toda la familia colabore para que
            <strong>${grandparentName}</strong> esté bien atendido/a y feliz. 💛
          </p>

          <!-- WHAT IS THE CIRCLE -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9F4;border-radius:12px;padding:22px;margin-bottom:24px;">
            <tr><td>
              <p style="margin:0 0 14px;font-size:13px;font-weight:800;color:#4A7C59;text-transform:uppercase;letter-spacing:1px;">Qué podrás hacer</p>
              ${[
                ['🔔','Recibir alertas','Te avisamos si algo necesita atención'],
                ['📅','Coordinar turnos','Quién visita, quién llama, quién ayuda'],
                ['💊','Ver medicamentos','Confirmar que los tomó correctamente'],
                ['📸','Compartir momentos','Fotos y mensajes directamente al abuelo'],
              ].map(([icon,title,sub]) => `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                <tr>
                  <td width="36" style="font-size:20px;vertical-align:top;padding-top:2px;">${icon}</td>
                  <td>
                    <p style="margin:0;font-size:14px;font-weight:700;color:#1a3a26;">${title}</p>
                    <p style="margin:2px 0 0;font-size:12px;color:#4a7050;">${sub}</p>
                  </td>
                </tr>
              </table>`).join('')}
            </td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="text-align:center;padding:8px 0 24px;">
              <a href="${joinUrl}" style="display:inline-block;background:linear-gradient(135deg,#4A7C59,#3a6449);color:#fff;text-decoration:none;font-weight:800;font-size:15px;padding:15px 34px;border-radius:100px;">
                Unirme al círculo 💚
              </a>
            </td></tr>
          </table>

          <p style="margin:0;font-size:13px;color:#7a9080;line-height:1.6;text-align:center;">
            Si no conoces a ${inviterName} o recibiste esto por error, ignora el mensaje.
          </p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#F0F9F4;border:1px solid #d0eadb;border-radius:0 0 20px 20px;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#608060;line-height:1.7;">
            © 2025 Abuelitos Contentos · Cuidando juntos a quienes más queremos ❤️
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

module.exports = { careInviteEmail };

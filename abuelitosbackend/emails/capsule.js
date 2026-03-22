function capsuleNotifyEmail({ familyName, nombre, para, momento, appUrl }) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0D0804;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0804;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- SEAL HEADER -->
        <tr><td style="background:linear-gradient(160deg,#2C1A08,#1A0F05);border-radius:20px 20px 0 0;padding:50px 40px 40px;text-align:center;border:1px solid rgba(201,150,58,0.2);border-bottom:none;">
          <div style="width:80px;height:80px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#C03030,#6B0F0F);display:inline-flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:20px;box-shadow:0 6px 30px rgba(139,32,32,0.5);">
            🕯️
          </div>
          <h1 style="margin:0;color:#E8C06A;font-size:26px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;">
            Nueva Cápsula de Vida
          </h1>
          <p style="margin:10px 0 0;color:rgba(232,192,106,0.6);font-size:14px;font-style:italic;">
            Familia ${familyName}
          </p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:linear-gradient(160deg,#2C1A08,#1A0F05);padding:0 40px 36px;border:1px solid rgba(201,150,58,0.2);border-top:none;border-bottom:none;">
          <p style="margin:0 0 20px;font-size:16px;color:#F0E4C8;line-height:1.7;">
            <strong style="color:#E8C06A;">${nombre}</strong> acaba de sellar una cápsula de vida.<br/>
            Un mensaje grabado con amor, esperando el momento exacto.
          </p>

          <!-- CAPSULE INFO -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,150,58,0.06);border:1px solid rgba(201,150,58,0.15);border-radius:14px;margin-bottom:28px;">
            <tr><td style="padding:22px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(201,150,58,0.1);">
                    <span style="font-size:12px;color:rgba(201,150,58,0.7);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">De</span>
                    <span style="font-size:15px;color:#F0E4C8;font-weight:600;">${nombre}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(201,150,58,0.1);">
                    <span style="font-size:12px;color:rgba(201,150,58,0.7);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Para</span>
                    <span style="font-size:15px;color:#F0E4C8;font-weight:600;">${para}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <span style="font-size:12px;color:rgba(201,150,58,0.7);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Se abrirá</span>
                    <span style="font-size:15px;color:#E8C06A;font-style:italic;">${momento}</span>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <p style="margin:0 0 24px;font-size:14px;color:rgba(240,228,200,0.6);line-height:1.7;font-style:italic;">
            Esta cápsula está guardada de forma segura en la nube, esperando el momento en que deba abrirse.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="text-align:center;">
              <a href="${appUrl}" style="display:inline-block;background:linear-gradient(135deg,#C9963A,#A07020);color:#1A0F05;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:100px;letter-spacing:0.5px;">
                Ver las cápsulas de la familia →
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#0D0804;border:1px solid rgba(201,150,58,0.1);border-radius:0 0 20px 20px;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(201,150,58,0.4);font-style:italic;line-height:1.7;">
            Abuelitos Contentos · Cápsulas de Vida<br/>
            Palabras que vivirán para siempre ✨
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

module.exports = { capsuleNotifyEmail };

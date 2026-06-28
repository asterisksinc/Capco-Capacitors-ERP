import { NextResponse } from "next/server";
import tls from "node:tls";

function sendSmtpEmail({
  to,
  subject,
  body,
  attachmentBase64,
  filename,
}: {
  to: string;
  subject: string;
  body: string;
  attachmentBase64?: string;
  filename?: string;
}) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: "smtp.gmail.com",
      port: 465,
      rejectUnauthorized: false,
    });

    let step = 0;
    let resolved = false;

    const send = (data: string) => {
      socket.write(data + "\r\n");
    };

    socket.on("data", (chunk) => {
      const response = chunk.toString();
      console.log("[SMTP SERVER RESPONSE]:", response);

      // Handle common SMTP response statuses
      if (response.startsWith("220") && step === 0) {
        send("EHLO localhost");
        step = 1;
      } else if (response.startsWith("250") && step === 1) {
        send("AUTH LOGIN");
        step = 2;
      } else if (response.startsWith("334") && step === 2) {
        send(Buffer.from("vmknexgentemp@gmail.com").toString("base64"));
        step = 3;
      } else if (response.startsWith("334") && step === 3) {
        send(Buffer.from("rrbv jell tzgz rqcc").toString("base64"));
        step = 4;
      } else if (response.startsWith("235") && step === 4) {
        send("MAIL FROM:<vmknexgentemp@gmail.com>");
        step = 5;
      } else if (response.startsWith("250") && step === 5) {
        send(`RCPT TO:<${to}>`);
        step = 6;
      } else if (response.startsWith("250") && step === 6) {
        send("DATA");
        step = 7;
      } else if (response.startsWith("354") && step === 7) {
        const boundary = "----=_Part_Boundary_Capco_Mailing";

        let message = `From: vmknexgentemp@gmail.com\r\n`;
        message += `To: ${to}\r\n`;
        message += `Subject: ${subject}\r\n`;
        message += `MIME-Version: 1.0\r\n`;
        message += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

        // Body
        message += `--${boundary}\r\n`;
        message += `Content-Type: text/plain; charset="UTF-8"\r\n\r\n`;
        message += `${body}\r\n\r\n`;

        // Attachment
        if (attachmentBase64 && filename) {
          const cleanBase64 = attachmentBase64.split(";base64,").pop() || attachmentBase64;
          
          let contentType = "application/octet-stream";
          if (filename.endsWith(".xlsx")) {
            contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          } else if (filename.endsWith(".pdf")) {
            contentType = "application/pdf";
          } else if (filename.endsWith(".csv")) {
            contentType = "text/csv";
          }

          message += `--${boundary}\r\n`;
          message += `Content-Type: ${contentType}; name="${filename}"\r\n`;
          message += `Content-Disposition: attachment; filename="${filename}"\r\n`;
          message += `Content-Transfer-Encoding: base64\r\n\r\n`;
          message += `${cleanBase64}\r\n\r\n`;
        }

        message += `--${boundary}--`;

        send(message);
        send(".");
        step = 8;
      } else if (response.startsWith("250") && step === 8) {
        send("QUIT");
        step = 9;
      } else if (step === 9) {
        resolved = true;
        socket.end();
        resolve(true);
      }
    });

    socket.on("error", (err) => {
      console.error("[SMTP SOCKET ERROR]:", err);
      reject(err);
    });

    socket.on("end", () => {
      if (!resolved && step < 9) {
        reject(new Error(`SMTP connection closed prematurely at step ${step}`));
      }
    });
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.to) {
      return NextResponse.json({ ok: false, error: "Recipient email 'to' is required." }, { status: 400 });
    }

    const { to, subject = "Capco Inventory Export", message = "Please find attached the exported inventory sheet.", attachmentBase64, filename } = body;

    console.log(`Sending email to ${to}...`);
    await sendSmtpEmail({
      to,
      subject,
      body: message,
      attachmentBase64,
      filename,
    });

    return NextResponse.json({ ok: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Failed to send email via SMTP:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Internal server error" }, { status: 500 });
  }
}

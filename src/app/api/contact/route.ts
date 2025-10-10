import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// POST /api/contact - Enviar formulario de contacto vía SMTP Gmail
export async function POST(request: NextRequest) {
  try {
    const { name, email, company, project, message, privacy } = await request.json();

    // Validar campos requeridos
    if (!name || !email || !project || !message || !privacy) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Crear transporter con SMTP de Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true para puerto 465, false para otros puertos
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Mapear valores internos a textos legibles
    const projectLabels = {
      web: 'Desarrollo web',
      ai: 'Integración de IA',
      ecommerce: 'E-commerce',
      mobile: 'Aplicación móvil',
      other: 'Otro',
    };

    // Configurar opciones del email
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: process.env.MAIL_USERNAME, // Email del destinatario (tú mismo)
      subject: `Nuevo mensaje de contacto - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>

          <div style="margin: 20px 0;">
            <h3 style="color: #0066cc; margin-bottom: 5px;">Información del contacto:</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #0066cc; margin-bottom: 5px;">Detalles del proyecto:</h3>
            <p><strong>Tipo:</strong> ${projectLabels[project as keyof typeof projectLabels] || project}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #0066cc; margin-bottom: 5px;">Mensaje:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
              ${message}
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>Este mensaje fue enviado desde el formulario de contacto de tu portfolio.</p>
            <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      `,
      // También enviar copia al remitente si lo deseas
      ...(process.env.CONTACT_REPLY_TO && {
        replyTo: email,
      }),
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: 'Mensaje enviado correctamente. Te responderé lo antes posible.',
      success: true,
    });

  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' },
      { status: 500 }
    );
  }
}

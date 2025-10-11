import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';
// @ts-ignore - types provided by package or ignored at build
import { v2 as cloudinary } from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '../auth/[...nextauth]/route.js';

// POST /api/upload - Subir imágenes de forma moderna
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown;
    const userId = (session as any)?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Archivo es requerido' },
        { status: 400 }
      );
    }

    if (!type || !['profileImage', 'heroImage', 'projectImage', 'heroVideo'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo inválido' },
        { status: 400 }
      );
    }

    // Validaciones por tipo
    if (type === 'heroVideo') {
      if (!file.type.startsWith('video/')) {
        return NextResponse.json(
          { error: 'Solo se permiten archivos de video para heroVideo' },
          { status: 400 }
        );
      }
      // Máximo 100MB para video
      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El archivo de video es demasiado grande (máximo 100MB)' },
          { status: 400 }
        );
      }

      // Subir video a Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `portfolio/hero/${userId}`,
            resource_type: 'video',
            eager: [{ format: 'mp4' }],
            eager_async: true,
          },
          (error: any, result: any) => {
            if (error || !result) return reject(error);
            resolve({ url: result.secure_url as string, public_id: result.public_id as string });
          }
        );
        stream.end(buffer);
      });

      return NextResponse.json({
        message: 'Video subido a Cloudinary correctamente',
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        size: file.size,
        type: file.type,
      });
    } else {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Solo se permiten archivos de imagen' },
          { status: 400 }
        );
      }
      // Máximo 5MB para imagen
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El archivo es demasiado grande (máximo 5MB)' },
          { status: 400 }
        );
      }
    }

    // Convertir archivo a buffer y guardar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Si es imagen de proyecto, subir a Cloudinary
    if (type === 'projectImage') {
      // Cloudinary lee CLOUDINARY_URL del entorno automáticamente
      const uploadResult = await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `portfolio/projects/${userId}`,
            resource_type: 'image',
          },
          (error: any, result: any) => {
            if (error || !result) return reject(error);
            resolve({ url: result.secure_url as string, public_id: result.public_id as string });
          }
        );
        stream.end(buffer);
      });

      return NextResponse.json({
        message: 'Imagen subida a Cloudinary correctamente',
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        size: file.size,
        type: file.type,
      });
    }

    // Para otros tipos, mantener almacenamiento local actual
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try { await fs.access(uploadsDir); } catch { await fs.mkdir(uploadsDir, { recursive: true }); }
    const userDir = path.join(uploadsDir, userId);
    try { await fs.access(userDir); } catch { await fs.mkdir(userDir, { recursive: true }); }
    const timestamp = Date.now();
    const extension = path.extname(file.name) || '.jpg';
    const filename = `${type}_${timestamp}${extension}`;
    const filepath = path.join(userDir, filename);
    await fs.writeFile(filepath, buffer);

    const publicUrl = `/uploads/${userId}/${filename}`;
    return NextResponse.json({ message: 'Imagen subida correctamente', url: publicUrl, filename, size: file.size, type: file.type });

  } catch (error: any) {
    console.error('Error subiendo imagen:', error);
    const message = (error && (error.message || error.error?.message)) || 'Error interno del servidor';
    const status = (error && (error.http_code || error.status || 500)) || 500;
    return NextResponse.json({ error: message }, { status });
  }
}

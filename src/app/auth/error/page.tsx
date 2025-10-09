'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const errorMessages = {
  Configuration: 'Hay un problema con la configuración del servidor.',
  AccessDenied: 'No tienes permisos para acceder a este recurso.',
  Verification: 'El enlace de verificación ha expirado o ya ha sido utilizado.',
  Default: 'Ha ocurrido un error durante la autenticación.',
  CredentialsSignin: 'Las credenciales proporcionadas son incorrectas.',
  EmailSignin: 'No se pudo enviar el email de verificación.',
  OAuthSignin: 'Error al iniciar sesión con el proveedor externo.',
  OAuthCallback: 'Error en el callback del proveedor externo.',
  OAuthCreateAccount: 'No se pudo crear la cuenta con el proveedor externo.',
  EmailCreateAccount: 'No se pudo crear la cuenta con el email proporcionado.',
  Callback: 'Error en el callback de autenticación.',
  OAuthAccountNotLinked: 'Para confirmar tu identidad, inicia sesión con la misma cuenta que usaste originalmente.',
  SessionRequired: 'Debes iniciar sesión para acceder a esta página.',
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error) => {
    return errorMessages[error] || errorMessages.Default;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-300 dark:bg-red-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-300 dark:bg-orange-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Error de Autenticación
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {getErrorMessage(error)}
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-center block"
            >
              Intentar de nuevo
            </Link>

            <Link
              href="/"
              className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-center block"
            >
              Volver al inicio
            </Link>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">
                <strong>Error técnico:</strong> {error}
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Si el problema persiste, contacta al administrador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

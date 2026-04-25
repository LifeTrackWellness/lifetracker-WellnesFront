import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerifyState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setState("error");
      setErrorMessage("Token de verificación no encontrado en la URL.");
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => setState("success"))
      .catch((error) => {
        setState("error");
        setErrorMessage(
          error.response?.data?.error ||
          error.response?.data?.message ||
          "El enlace es inválido o ha vencido."
        );
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Verificación de email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {state === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
              <p className="text-gray-600">Verificando tu cuenta...</p>
            </>
          )}

          {state === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-lg font-semibold text-green-700">
                ¡Email confirmado!
              </p>
              <p className="text-gray-600">
                Tu cuenta ha sido activada. Ya puedes iniciar sesión.
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Ir a iniciar sesión</Link>
              </Button>
            </>
          )}

          {state === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <p className="text-lg font-semibold text-red-700">
                Verificación fallida
              </p>
              <p className="text-gray-600">{errorMessage}</p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/register">Volver al registro</Link>
              </Button>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
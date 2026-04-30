import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService, LoginData } from "@/services/authService";

const loginSchema = z.object({
  email: z.string().email("Debe ser un correo válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data as LoginData);
      if (response.role === "PROFESSIONAL") navigate("/patients");
      else if (response.role === "PATIENT") navigate("/patient/home");
      else navigate("/");
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Panel izquierdo — identidad de marca */}
      <div style={{
        width: "45%",
        background: "hsl(199, 89%, 18%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "3rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Círculos decorativos */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "300px", height: "300px", borderRadius: "50%",
          border: "1px solid hsl(199, 60%, 35%)", opacity: 0.4,
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "250px", height: "250px", borderRadius: "50%",
          border: "1px solid hsl(199, 60%, 35%)", opacity: 0.3,
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "-40px",
          width: "160px", height: "160px", borderRadius: "50%",
          border: "1px solid hsl(199, 60%, 35%)", opacity: 0.25,
        }} />

        {/* Contenido */}
        <div style={{ position: "relative", textAlign: "center", color: "white", maxWidth: "320px" }}>
          {/* Ícono */}
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "hsl(199, 89%, 28%)",
            border: "1px solid hsl(199, 60%, 38%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 2rem",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="hsl(199, 89%, 70%)" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>

          <h1 style={{
            fontSize: "2rem", fontWeight: "400", letterSpacing: "-0.02em",
            color: "white", margin: "0 0 0.75rem", lineHeight: 1.2,
          }}>
            LifeTracker<br />
            <span style={{ color: "hsl(199, 89%, 65%)", fontStyle: "italic" }}>Wellness</span>
          </h1>

          <p style={{
            fontSize: "0.95rem", color: "hsl(199, 30%, 70%)",
            lineHeight: 1.7, margin: "0 0 3rem", fontFamily: "system-ui, sans-serif",
          }}>
            Plataforma para profesionales de la salud mental. Gestiona tus pacientes con claridad y precisión.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { icon: "👥", text: "Gestión integral de pacientes" },
              { icon: "📋", text: "Planes de hábitos personalizados" },
              { icon: "📊", text: "Seguimiento de adherencia" },
            ].map((item) => (
              <div key={item.text} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 1rem",
                background: "hsl(199, 89%, 14%)",
                borderRadius: "10px",
                border: "1px solid hsl(199, 60%, 28%)",
              }}>
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span style={{
                  fontSize: "0.85rem", color: "hsl(199, 20%, 80%)",
                  fontFamily: "system-ui, sans-serif",
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        background: "hsl(210, 20%, 98%)",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{
              fontSize: "1.75rem", fontWeight: "400",
              color: "hsl(215, 25%, 15%)", margin: "0 0 0.5rem",
              letterSpacing: "-0.02em",
            }}>
              Bienvenido de vuelta
            </h2>
            <p style={{
              fontSize: "0.9rem", color: "hsl(215, 15%, 47%)",
              fontFamily: "system-ui, sans-serif", margin: 0,
            }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            <div>
              <label style={{
                display: "block", fontSize: "0.8rem", fontWeight: "500",
                color: "hsl(215, 25%, 30%)", marginBottom: "0.4rem",
                fontFamily: "system-ui, sans-serif", letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                Correo electrónico
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="profesional@clinica.com"
                style={{
                  width: "100%", padding: "0.75rem 1rem",
                  border: errors.email ? "1px solid hsl(0, 72%, 51%)" : "1px solid hsl(214, 20%, 85%)",
                  borderRadius: "8px", fontSize: "0.95rem",
                  background: "white", color: "hsl(215, 25%, 15%)",
                  fontFamily: "system-ui, sans-serif",
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
              {errors.email && (
                <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "hsl(0, 72%, 51%)", fontFamily: "system-ui, sans-serif" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: "block", fontSize: "0.8rem", fontWeight: "500",
                color: "hsl(215, 25%, 30%)", marginBottom: "0.4rem",
                fontFamily: "system-ui, sans-serif", letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                Contraseña
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Tu contraseña"
                style={{
                  width: "100%", padding: "0.75rem 1rem",
                  border: errors.password ? "1px solid hsl(0, 72%, 51%)" : "1px solid hsl(214, 20%, 85%)",
                  borderRadius: "8px", fontSize: "0.95rem",
                  background: "white", color: "hsl(215, 25%, 15%)",
                  fontFamily: "system-ui, sans-serif",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              {errors.password && (
                <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "hsl(0, 72%, 51%)", fontFamily: "system-ui, sans-serif" }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", padding: "0.85rem",
                background: isLoading ? "hsl(199, 40%, 55%)" : "hsl(199, 89%, 38%)",
                color: "white", border: "none", borderRadius: "8px",
                fontSize: "0.95rem", fontWeight: "500", cursor: isLoading ? "not-allowed" : "pointer",
                fontFamily: "system-ui, sans-serif", marginTop: "0.5rem",
                transition: "background 0.2s",
              }}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <p style={{
            textAlign: "center", marginTop: "1.75rem",
            fontSize: "0.875rem", color: "hsl(215, 15%, 47%)",
            fontFamily: "system-ui, sans-serif",
          }}>
            ¿No tienes cuenta?{" "}
            <Link to="/register" style={{
              color: "hsl(199, 89%, 38%)", textDecoration: "none", fontWeight: "500",
            }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
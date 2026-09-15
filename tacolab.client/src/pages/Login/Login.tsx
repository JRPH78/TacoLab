import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { Grain } from "../../components/Grain";
import { NotebookGrid } from "../../components/NotebookGrid";
import { NEGRO, PAPEL } from "../../utilities/PaleteColors";

const ACCENT = "#3ECF6E";

const API_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7253";
// const API_URL = "https://192.168.1.5:7253";

interface LoginResponse {
  token: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    alert("URL API: " + API_URL);

    if (!username || !password) {
      setError("Completá usuario/email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      alert("res" + res.ok);

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Usuario o contraseña incorrectos.");
        }
        throw new Error("Ocurrió un error al iniciar sesión.");
      }

      const data: LoginResponse = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full selection:bg-[#3ECF6E]/30 selection:text-white overflow-hidden"
      style={{ backgroundColor: NEGRO, color: PAPEL, fontFamily: "'Inter', sans-serif" }}
    >
      {/* viñeta radial */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle at center, #1a1a17 0%, ${NEGRO} 70%)`,
        }}
      />

      {/* halo de color detrás del panel, típico de glass UI */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          top: "50%",
          left: "50%",
          width: 560,
          height: 560,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${ACCENT}26 0%, transparent 65%)`,
          filter: "blur(10px)",
        }}
      />

      <NotebookGrid />
      <Grain />

      {/* contenido del login */}
      <Box
        className="relative z-10"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 380,
            borderRadius: "20px",
            p: "1px", // hueco para el borde-gradiente
            background: `linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02) 40%, ${ACCENT}22 100%)`,
            boxShadow: "0 20px 60px -12px rgba(0,0,0,0.55)",
          }}
        >
          <Box
            sx={{
              borderRadius: "19px",
              p: 4,
              backgroundColor: "rgba(20,20,18,0.55)",
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 40px rgba(255,255,255,0.015)",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3.5 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${ACCENT}1A`,
                  border: `1px solid ${ACCENT}33`,
                  mb: 2,
                }}
              >
                <LockOutlined sx={{ color: ACCENT, fontSize: 22 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ color: PAPEL, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Iniciar sesión
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", mt: 0.5 }}>
                Ingresá tus credenciales para continuar
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  backgroundColor: "rgba(211,47,47,0.12)",
                  color: "#ff8a80",
                  border: "1px solid rgba(211,47,47,0.25)",
                  "& .MuiAlert-icon": { color: "#ff8a80" },
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Usuario o email"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              sx={textFieldSx}
            />

            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              sx={textFieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              disableElevation
              sx={{
                mt: 3,
                py: 1.25,
                borderRadius: "12px",
                backgroundColor: ACCENT,
                color: "#0a0a09",
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                boxShadow: `0 8px 20px -6px ${ACCENT}66`,
                transition: "background-color 150ms ease, transform 150ms ease",
                "&:hover": {
                  backgroundColor: "#34b85f",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": {
                  backgroundColor: `${ACCENT}55`,
                  color: "rgba(10,10,9,0.6)",
                },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#0a0a09" }} /> : "Ingresar"}
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: PAPEL,
    borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.02)",
    transition: "border-color 150ms ease",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
    "&.Mui-focused fieldset": { borderColor: "#3ECF6E", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.45)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3ECF6E" },
  // fix del autofill de Chrome/Edge que rompe el fondo glass
  "& input:-webkit-autofill": {
    WebkitTextFillColor: PAPEL,
    WebkitBoxShadow: "0 0 0 100px rgba(30,30,27,0.9) inset",
    caretColor: PAPEL,
    borderRadius: "10px",
    // truco para que no "salte" el color al hacer focus/hover tras autocompletar
    transition: "background-color 600000s 0s, color 600000s 0s",
  },
  "& input:-webkit-autofill:hover": {
    WebkitBoxShadow: "0 0 0 100px rgba(30,30,27,0.9) inset",
  },
  "& input:-webkit-autofill:focus": {
    WebkitBoxShadow: "0 0 0 100px rgba(30,30,27,0.9) inset",
  },
};

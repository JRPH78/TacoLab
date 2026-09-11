// import { Grain } from "../../components/Grain";
// import { NotebookGrid } from "../../components/NotebookGrid";
// import { NEGRO, PAPEL } from "../../utilities/PaleteColors";
// export default function Login() {
//   return (
//     <div
//       className="relative min-h-screen w-full selection:bg-[#3ECF6E]/30 selection:text-white"
//       style={{ backgroundColor: NEGRO, color: PAPEL, fontFamily: "'Inter', sans-serif" }}
//     >
//       {/* <IntroSequence visible={introVisible} /> */}

//       {/* viñeta radial */}
//       <div
//         className="pointer-events-none fixed inset-0 z-0"
//         style={{
//           background: `radial-gradient(circle at center, #1a1a17 0%, ${NEGRO} 70%)`,
//         }}
//       />
//       <NotebookGrid />
//       <Grain />
//       {/* <CornerFrame /> */}
//     </div>
//   );
// }
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
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

// Ajustá esto a tu configuración real (env, api client, etc.)
const API_URL = import.meta.env.VITE_API_URL ?? "https://localhost:5001";

interface LoginResponse {
  token: string;
  // agregá acá lo que tu back devuelva (expiresIn, user, etc.)
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
    console.log(username, password);

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

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Usuario o contraseña incorrectos.");
        }
        throw new Error("Ocurrió un error al iniciar sesión.");
      }

      const data: LoginResponse = await res.json();

      // Guardá el JWT. Si tu API usa cookies httpOnly, sacá esto
      // y usá credentials: "include" arriba en el fetch.
      localStorage.setItem("token", data.token);

      navigate("/dashboard"); // cambiá por tu ruta post-login
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full selection:bg-[#3ECF6E]/30 selection:text-white"
      style={{ backgroundColor: NEGRO, color: PAPEL, fontFamily: "'Inter', sans-serif" }}
    >
      {/* viñeta radial */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle at center, #1a1a17 0%, ${NEGRO} 70%)`,
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
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 380,
            p: 4,
            borderRadius: 3,
            backgroundColor: "rgba(26,26,23,0.75)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${ACCENT}22`,
                mb: 1.5,
              }}
            >
              <LockOutlined sx={{ color: ACCENT }} />
            </Box>
            <Typography variant="h6" sx={{ color: PAPEL, fontWeight: 600 }}>
              Iniciar sesión
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
              Ingresá tus credenciales para continuar
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
                      sx={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
            sx={{
              mt: 3,
              py: 1.2,
              backgroundColor: ACCENT,
              color: "#0a0a09",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { backgroundColor: "#34b85f" },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#0a0a09" }} /> : "Ingresar"}
          </Button>
        </Paper>
      </Box>
    </div>
  );
}

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: PAPEL,
    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
    "&.Mui-focused fieldset": { borderColor: ACCENT },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
  "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
};

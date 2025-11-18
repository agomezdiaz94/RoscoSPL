import React, { useState, useEffect, useRef } from "react";
import "../styles/Rosco.css";
import preguntasData from "../data/preguntas.json";

export default function Rosco() {
  const [nombre, setNombre] = useState("");
  const [inicio, setInicio] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuesta, setRespuesta] = useState("");
  const [estadoLetras, setEstadoLetras] = useState({});
  const [tiempo, setTiempo] = useState(20);
  const [finalizado, setFinalizado] = useState(false);

  const timerRef = useRef(null);

  const correctoSound = useRef(null);
  const incorrectoSound = useRef(null);
  const pasapalabraSound = useRef(null);

  useEffect(() => {
    correctoSound.current = new Audio("/sounds/correcto.mp3");
    incorrectoSound.current = new Audio("/sounds/incorrecto.mp3");
    pasapalabraSound.current = new Audio("/sounds/pasapalabra.mp3");
  }, []);

  // Cargar 1 pregunta aleatoria por letra
  useEffect(() => {
    if (!preguntasData) return;

    const seleccion = preguntasData.map((item) => {
      const rnd = Math.floor(Math.random() * item.questions.length);
      return {
        letter: item.letter,
        question: item.questions[rnd].question,
        answer: item.questions[rnd].answer,
      };
    });

    seleccion.sort((a, b) =>
      a.letter.localeCompare(b.letter, "es", { sensitivity: "base" })
    );

    setPreguntas(seleccion);
    setIndicePregunta(0);
  }, []);

  const getPendientes = (estado) =>
    preguntas.filter(
      (p) => !estado[p.letter] || estado[p.letter] === "pasapalabra"
    );

  const reiniciarTemporizador = () => {
    clearInterval(timerRef.current);
    setTiempo(20);
    timerRef.current = setInterval(() => {
      setTiempo((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);

          try {
            incorrectoSound.current.currentTime = 0;
            incorrectoSound.current.play();
          } catch {}

          marcarIncorrectaPorTiempo();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!inicio || finalizado || preguntas.length === 0) return;

    reiniciarTemporizador();

    return () => clearInterval(timerRef.current);
  }, [indicePregunta, inicio, finalizado, preguntas.length]);

  const marcarIncorrectaPorTiempo = () => {
    const letra = preguntas[indicePregunta]?.letter;
    if (!letra) return;

    setEstadoLetras((prev) => {
      const nuevo = { ...prev, [letra]: "incorrecta" };
      avanzarConEstado(nuevo);
      return nuevo;
    });
  };

  const avanzarConEstado = (estado) => {
    const pendientes = getPendientes(estado);

    if (pendientes.length === 0) {
      clearInterval(timerRef.current);
      setFinalizado(true);
      return;
    }

    const n = preguntas.length;

    for (let offset = 1; offset <= n; offset++) {
      const nextIndex = (indicePregunta + offset) % n;
      const letra = preguntas[nextIndex].letter;

      if (!estado[letra] || estado[letra] === "pasapalabra") {
        setIndicePregunta(nextIndex);
        return;
      }
    }

    setFinalizado(true);
  };

  const manejarRespuesta = (tipo) => {
    const actual = preguntas[indicePregunta];
    if (!actual) return;

    const letra = actual.letter;

    if (tipo === "pasapalabra") {
      try {
        pasapalabraSound.current.currentTime = 0;
        pasapalabraSound.current.play();
      } catch {}

      setEstadoLetras((prev) => {
        const nuevo = { ...prev, [letra]: "pasapalabra" };
        avanzarConEstado(nuevo);
        return nuevo;
      });
      setRespuesta("");
      return;
    }

    const esCorrecta =
      respuesta.trim().toLowerCase() === actual.answer.toLowerCase();

    if (esCorrecta) {
      try {
        correctoSound.current.currentTime = 0;
        correctoSound.current.play();
      } catch {}
    } else {
      try {
        incorrectoSound.current.currentTime = 0;
        incorrectoSound.current.play();
      } catch {}
    }

    const nuevoEstado = {
      ...estadoLetras,
      [letra]: esCorrecta ? "correcta" : "incorrecta",
    };

    setEstadoLetras(nuevoEstado);
    setRespuesta("");

    avanzarConEstado(nuevoEstado);
  };

  // PROTECCIÓN: mientras preguntas está vacío
  if (inicio && preguntas.length === 0 && !finalizado) {
    return (
      <div className="pantalla-cargando">
        <h2>Cargando preguntas...</h2>
      </div>
    );
  }

  if (!inicio) {
    return (
      <div className="pantalla-inicio">
        <img src="/logo2.png" className="logo-left" alt="logo2" />
        <img src="/logo.png" className="logo-right" alt="logo" />

        <h1 className="titulo-inicio">Juego del Rosco</h1>

        <input
          className="input-nombre"
          placeholder="Ingresa tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button
          className="btn-iniciar"
          onClick={() => {
            if (nombre.trim() === "") return;
            setInicio(true);
            setTimeout(() => reiniciarTemporizador(), 50);
          }}
        >
          Comenzar
        </button>
      </div>
    );
  }

  if (finalizado) {
    const correctas = Object.values(estadoLetras).filter(
      (v) => v === "correcta"
    ).length;
    const incorrectas = Object.values(estadoLetras).filter(
      (v) => v === "incorrecta"
    ).length;

    return (
      <div className="pantalla-final">
        <img src="/logo2.png" className="logo-left" alt="logo2" />
        <img src="/logo.png" className="logo-right" alt="logo" />

        <h1>¡Fin del Juego!</h1>
        <h2>{nombre}, resultados:</h2>

        <p>
          Correctas: <span className="verde">{correctas}</span>
        </p>
        <p>
          Incorrectas: <span className="rojo">{incorrectas}</span>
        </p>
        <p>Total letras: {preguntas.length}</p>

        <button className="btn-reiniciar" onClick={() => window.location.reload()}>
          Volver a jugar
        </button>
      </div>
    );
  }

  return (
    <div className="contenedor-juego">
      <img src="/logo2.png" className="logo-left" alt="logo2" />
      <img src="/logo.png" className="logo-right" alt="logo" />

      <h2 className="timer">⏳ {tiempo}s</h2>

      <div className="rosco" aria-hidden>
        {preguntas.length > 0 &&
          preguntas.map((p, i) => {
            const ang = (i / preguntas.length) * 2 * Math.PI - Math.PI / 2;
            const x = 150 + 120 * Math.cos(ang);
            const y = 150 + 120 * Math.sin(ang);
            const clase = estadoLetras[p.letter] || "";

            return (
              <div
                key={p.letter}
                className={`letra ${clase}`}
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                {p.letter}
              </div>
            );
          })}
      </div>

      <div className="pregunta-box">
        <h3>Letra: {preguntas[indicePregunta]?.letter}</h3>
        <p className="pregunta-texto">{preguntas[indicePregunta]?.question}</p>

        <input
          className="input-respuesta"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          placeholder="Escribe tu respuesta"
        />

        <div className="botones">
          <button className="btn-responder" onClick={() => manejarRespuesta("responder")}>
            Responder
          </button>
          <button className="btn-pasa"          onClick={() => manejarRespuesta("pasapalabra")}>
            Pasapalabra
          </button>
        </div>
      </div>
    </div>
  );
}

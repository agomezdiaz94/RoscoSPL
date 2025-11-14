import React, { useState, useEffect, useRef } from "react";
import "../styles/Rosco.css";
import preguntasData from "../data/preguntas.json";

import logo from "../assets/logo.png";     
import logo2 from "../assets/logo2.png";   

const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Rosco() {
  const [preguntas, setPreguntas] = useState([]);
  const [current, setCurrent] = useState(0);
  const [respuesta, setRespuesta] = useState("");
  const [estadoLetras, setEstadoLetras] = useState({});
  const [jugador, setJugador] = useState("");
  const [jugadorListo, setJugadorListo] = useState(false);

  const audioCorrecto = useRef(null);
  const audioIncorrecto = useRef(null);
  const audioPasapalabra = useRef(null);

  useEffect(() => {
    // Selecciona una pregunta aleatoria por letra al iniciar
    const juego = preguntasData.map((item) => {
      const random = Math.floor(Math.random() * item.preguntas.length);
      return {
        ...item,
        pregunta: item.preguntas[random].pregunta,
        respuesta: item.preguntas[random].respuesta.toLowerCase().trim(),
      };
    });
    setPreguntas(juego);
  }, []);

  const iniciarJuego = () => {
    // Reinicia estados
    const juego = preguntasData.map((item) => {
      const random = Math.floor(Math.random() * item.preguntas.length);
      return {
        ...item,
        pregunta: item.preguntas[random].pregunta,
        respuesta: item.preguntas[random].respuesta.toLowerCase().trim(),
      };
    });
    setPreguntas(juego);
    setEstadoLetras({});
    setCurrent(0);
    setRespuesta("");
  };

  const handleResponder = () => {
    const correcta = preguntas[current].respuesta;
    const userRes = respuesta.toLowerCase().trim();

    let nuevoEstado = { ...estadoLetras };

    if (userRes === correcta) {
      nuevoEstado[preguntas[current].letra] = "correcto";
      audioCorrecto.current.play();
    } else {
      nuevoEstado[preguntas[current].letra] = "incorrecto";
      audioIncorrecto.current.play();
    }

    setEstadoLetras(nuevoEstado);
    avanzar();
  };

  const handlePasapalabra = () => {
    let nuevoEstado = { ...estadoLetras };
    nuevoEstado[preguntas[current].letra] = "pasapalabra";

    setEstadoLetras(nuevoEstado);
    audioPasapalabra.current.play();
    avanzar();
  };

  const avanzar = () => {
    setRespuesta("");

    let next = current + 1;
    const total = preguntas.length;

    // Buscar siguiente letra pendiente
    let vueltas = 0;
    while (vueltas < total) {
      const letra = preguntas[next % total].letra;
      if (!estadoLetras[letra] || estadoLetras[letra] === "pasapalabra") {
        setCurrent(next % total);
        return;
      }
      next++;
      vueltas++;
    }

    // Si no hay letras pendientes
    alert("¡Juego terminado!");
  };

  if (!preguntas.length) return <div>Cargando...</div>;

  if (!jugadorListo) {
    return (
      <div className="nombre-container">
        <h2>Ingrese su nombre</h2>
        <input
          type="text"
          placeholder="Nombre..."
          value={jugador}
          onChange={(e) => setJugador(e.target.value)}
        />
        <button
          onClick={() => {
            if (jugador.trim()) {
              setJugadorListo(true);
              iniciarJuego();
            }
          }}
          className="btn-nombre"
        >
          Comenzar
        </button>
      </div>
    );
  }

  return (
    <div className="rosco-container">
      {/* LOGOS */}
      <div className="logos-container">
        <img src={logo2} className="logo-izq" alt="Logo izquierdo" />
        <img src={logo} className="logo-der" alt="Logo derecho" />
      </div>

      {/* ROSCO */}
      <div className="rosco">
        {letras.map((letra, index) => {
          const angle = (index / letras.length) * 2 * Math.PI;
          const radius = 180;

          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          const estado = estadoLetras[letra];

          return (
            <div
              key={letra}
              className={`letra ${estado || ""} ${
                preguntas[current].letra === letra ? "actual" : ""
              }`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
            >
              {letra}
            </div>
          );
        })}
      </div>

      {/* PANEL DE PREGUNTA */}
      <div className="panel-pregunta">
        <h2>Letra: {preguntas[current].letra}</h2>
        <p>{preguntas[current].pregunta}</p>

        <input
          type="text"
          placeholder="Respuesta…"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
        />

        <div className="botones">
          <button className="btn-responder" onClick={handleResponder}>
            Responder
          </button>

          <button className="btn-pasa" onClick={handlePasapalabra}>
            Pasapalabra
          </button>
        </div>
      </div>

      {/* Audios */}
      <audio ref={audioCorrecto} src="/sounds/correcto.mp3" />
      <audio ref={audioIncorrecto} src="/sounds/incorrecto.mp3" />
      <audio ref={audioPasapalabra} src="/sounds/pasapalabra.mp3" />
    </div>
  );
}

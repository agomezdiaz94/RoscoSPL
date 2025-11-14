import React, { useState, useEffect } from "react";
import "./Rosco.css";
import preguntasData from "../data/preguntas.json";
import logo from "../assets/logo.png";

const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Rosco() {
  const [nombre, setNombre] = useState("");
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuesta, setRespuesta] = useState("");

  const sonidoCorrecto = new Audio("/sounds/correcto.mp3");
  const sonidoIncorrecto = new Audio("/sounds/incorrecto.mp3");
  const sonidoPasapalabra = new Audio("/sounds/pasapalabra.mp3");

  const iniciarJuego = () => {
    if (nombre.trim() !== "") {
      setJuegoIniciado(true);
    }
  };

  const responder = () => {
    const correcta = preguntasData[preguntaActual].respuesta.toLowerCase();
    const respUser = respuesta.toLowerCase();

    if (respUser === correcta) {
      sonidoCorrecto.play();
    } else if (respUser === "pasapalabra") {
      sonidoPasapalabra.play();
    } else {
      sonidoIncorrecto.play();
    }

    setRespuesta("");
    setPreguntaActual((prev) => (prev + 1) % preguntasData.length);
  };

  return (
    <div className="rosco-container">
      <img src={logo} alt="Logo" className="logo" />

      {!juegoIniciado ? (
        <div className="inicio">
          <h2>Ingresa tu nombre para comenzar</h2>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button onClick={iniciarJuego}>Comenzar</button>
        </div>
      ) : (
        <div className="rosco-juego">
          <div className="rosco">
            {letras.map((letra, i) => (
              <div
                key={i}
                className={`letra ${i === preguntaActual ? "activa" : ""}`}
              >
                {letra}
              </div>
            ))}
          </div>

          <div className="pregunta">
            <h3>Letra: {letras[preguntaActual]}</h3>
            <p>{preguntasData[preguntaActual].pregunta}</p>

            <input
              type="text"
              placeholder="Respuesta"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
            />

            <button onClick={responder}>Responder</button>
          </div>
        </div>
      )}
    </div>
  );
}

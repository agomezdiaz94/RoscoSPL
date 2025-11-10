
import React, { useEffect, useRef, useState } from "react";
import logo from "./assets/logo-spl.png";

// Full QUESTIONS object A-Z (3 per letter)
const QUESTIONS = {
  A: [
    { q: "Equipo que protege la cabeza en obra.", a: "casco" },
    { q: "Señal que indica acceso para peatones: color habitual.", a: "azul" },
    { q: "Acción preventiva: antes de subir a una escalera debes...", a: "asegurarla" }
  ],
  B: [
    { q: "Elemento reflectante que mejora visibilidad en la noche.", a: "chaleco" },
    { q: "Tipo de riesgo por exposición prolongada al sol.", a: "golpe de calor" },
    { q: "Verificar ____ de una herramienta antes de usarla.", a: "estado" }
  ],
  C: [
    { q: "Líquido usado para apagar fuegos clase A, B o C según tipo.", a: "agua" },
    { q: "Instrumento para medir concentración de gases.", a: "detector" },
    { q: "Zona delimitada para riesgos: se coloca cinta de ____.", a: "precaucion" }
  ],
  D: [
    { q: "Señal que indica obligación: forma y color.", a: "circulo azul" },
    { q: "Acción: detener maquinaria antes de realizar mantenimiento: lema '______ y bloquear'", a: "parar" },
    { q: "Tipo de fuego producido por materiales eléctricos.", a: "electrico" }
  ],
  E: [
    { q: "Equipo para respirar en atmósferas contaminadas.", a: "mascara" },
    { q: "Elemento que protege los ojos.", a: "gafas" },
    { q: "Debes realizar ____ de riesgos antes de la tarea.", a: "evaluacion" }
  ],
  F: [
    { q: "Dispositivo para apagar incendios: común en oficinas.", a: "extintor" },
    { q: "Sustancia que aumenta el riesgo de incendio: es inflamable.", a: "gasolina" },
    { q: "Acción para reducir incendios: mantener ____ ordenado.", a: "almacen" }
  ],
  G: [
    { q: "Protección para las manos contra cortes y químicos.", a: "guantes" },
    { q: "Objeto obligatorio en obra: reflectante y de seguridad.", a: "chaleco" },
    { q: "Área donde se guardan materiales peligrosos: debe ser ____.", a: "ventilada" }
  ],
  H: [
    { q: "La 'H' en HSE significa...", a: "health" },
    { q: "Acción ante vertido: usar material absorbente y ____.", a: "contener" },
    { q: "Prevención en alturas: usar arnés y punto de ____.", a: "anclaje" }
  ],
  I: [
    { q: "Instrumento para levantar cargas: ej. grúa o ____.", a: "polea" },
    { q: "Señal que indica información: color habitual.", a: "azul" },
    { q: "Antes de iniciar una máquina, realiza la ____ de seguridad.", a: "inspeccion" }
  ],
  J: [
    { q: "Elemento que evita resbalones en superficies: suela ____.", a: "antideslizante" },
    { q: "Cuando hay ruido excesivo debes usar ____ auditivo.", a: "protector" },
    { q: "Plan que indica qué hacer en caso de emergencia: plan de ____.", a: "evacuacion" }
  ],
  K: [
    { q: "Letra con pocas palabras en español: '____' (ej. palabra en inglés usada en seguridad).", a: "kit" },
    { q: "Equipo de primeros auxilios: botiquín o ____ médico.", a: "kit" },
    { q: "Elemento de protección que protege rodillas: ____ pads.", a: "rodilleras" }
  ],
  L: [
    { q: "Documento que describe procedimientos y riesgos: manual o ____.", a: "procedimiento" },
    { q: "Cuando hay olor a gas: no prender fuego y ____ al servicio.", a: "reportar" },
    { q: "Señal que indica peligro: suele ser de color ____.", a: "amarillo" }
  ],
  M: [
    { q: "Acción para levantar peso: doblar las ___.", a: "rodillas" },
    { q: "Equipo que protege la boca y nariz de polvo.", a: "mascarilla" },
    { q: "Prevención básica: mantener ____ y orden en el área.", a: "limpieza" }
  ],
  N: [
    { q: "Señal que prohíbe: forma y color usual.", a: "circulo rojo" },
    { q: "Cuando hay materiales peligrosos, consulta la Hojas de ____ (MSDS en inglés).", a: "seguridad" },
    { q: "Proceso para reducir riesgos: capacitación o ____.", a: "entrenamiento" }
  ],
  O: [
    { q: "Dispositivo que evita caídas por escaleras: baranda u ____.", a: "pasamanos" },
    { q: "Zona de trabajo con mucho polvo requiere ____ especial.", a: "ventilacion" },
    { q: "Equipo fluorescente para señalizar: cinta ____.", a: "reflectante" }
  ],
  P: [
    { q: "Procedimiento para informar un accidente: parte de ____.", a: "accidente" },
    { q: "Elemento que protege los pies: ____ de seguridad.", a: "calzado" },
    { q: "Si algo es peligroso, lo debes ____ inmediatamente.", a: "reportar" }
  ],
  Q: [
    { q: "En química, sustancia que quema: es ____.", a: "combustible" },
    { q: "Para manipular productos químicos, usar ____ de protección.", a: "guantes" },
    { q: "Área que requiere señalización: zona de ____.", a: "riesgo" }
  ],
  R: [
    { q: "Lugar para evacuar personas: punto de ____.", a: "reunion" },
    { q: "Medida para reducir riesgos: realizar ____ periódicas.", a: "revisiones" },
    { q: "Protección para la vista en soldadura: máscara o ____.", a: "pantalla" }
  ],
  S: [
    { q: "Señal que indica salida de emergencia: color habitual.", a: "verde" },
    { q: "Objeto que protege la espalda al levantar: faja o ____.", a: "cinturon" },
    { q: "Sistema que evita incendios en cocina: campana y ____.", a: "extintor" }
  ],
  T: [
    { q: "Antes de usar una herramienta eléctrica, desconéctala y haz ____.", a: "inspeccion" },
    { q: "Elemento que evita tropiezos: mantener cables ____.", a: "ordenados" },
    { q: "Al cargar un trabajador, se debe verificar su ____ física.", a: "aptitud" }
  ],
  U: [
    { q: "Equipo universal para primeros auxilios: botiquín o ____.", a: "kit" },
    { q: "Al trabajar con alturas, usar arnés y ____ de seguridad.", a: "anclaje" },
    { q: "Cuando algo es inseguro, se coloca fuera de servicio: etiqueta ___-____.", a: "no usar" }
  ],
  V: [
    { q: "Elemento que controla temperatura en ambientes: sistema de ____.", a: "ventilacion" },
    { q: "Señal que advierte peligro: color ____.", a: "amarillo" },
    { q: "Medida para ruido: evaluar niveles con un sonómetro o ____.", a: "dosimetro" }
  ],
  W: [
    { q: "Letra W usada en siglas internacionales: puede representar 'work' en ____.", a: "safety" },
    { q: "Una palabra en seguridad: 'walk' as in 'look before you walk' -> mirar antes de ____.", a: "caminar" },
    { q: "Equipo usado en laboratorio: bata y ____ protectora.", a: "gafa" }
  ],
  X: [
    { q: "Símbolo que se usa para marcar peligro: eje con una X -> 'no'.", a: "no" },
    { q: "En etiquetas, X puede indicar sustancia tóxica: manejar con ____.", a: "cuidado" },
    { q: "Elemento de protección para pies: calzado con punta de ____.", a: "acero" }
  ],
  Y: [
    { q: "Nexo para decir que algo causa otro: 'y' -> en seguridad, 'señal y ___'.", a: "accion" },
    { q: "Si hay riesgo, informa a tu ____ o supervisor.", a: "jefe" },
    { q: "Cuando trabajas con corriente, usa herramientas ____.", a: "aisladas" }
  ],
  Z: [
    { q: "Zona donde se prohíbe fumar: zona ____.", a: "libre" },
    { q: "Elemento que protege del frío en exterior: ropa ____.", a: "termica" },
    { q: "Acción: revisar y ____ el equipo antes de usarlo.", a: "probar" }
  ]
};

const LETTERS = Object.keys(QUESTIONS);

function playTone(type = "ok") {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    if (type === "ok") o.frequency.value = 880;
    if (type === "wrong") o.frequency.value = 220;
    if (type === "pass") o.frequency.value = 440;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.stop(ctx.currentTime + 0.55);
  } catch (e) {
    console.warn("Audio not available:", e);
  }
}

export default function App() {
  const [player, setPlayer] = useState(localStorage.getItem("rosco_name") || "");
  const [started, setStarted] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [statusByLetter, setStatusByLetter] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const init = {};
    LETTERS.forEach(l => init[l] = 'pending');
    setStatusByLetter(init);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  async function toggleCamera() {
    if (cameraOn) {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraOn(false);
    } else {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }
        setCameraOn(true);
      } catch (e) {
        alert('No se pudo acceder a la cámara. Revisa permisos y que la página use HTTPS.');
        console.error(e);
      }
    }
  }

  function pickQuestionAtIndex(idx) {
    setCurrentLetterIndex(idx);
    const letter = LETTERS[idx];
    const pool = QUESTIONS[letter] || [];
    if (pool.length === 0) {
      setCurrentQuestion({ q: "Sin pregunta", a: "" });
      return;
    }
    const pick = Math.floor(Math.random() * pool.length);
    setCurrentQuestion({ ...pool[pick], letter });
  }

  function startGame() {
    if (!player) { alert("Ingresa tu nombre antes de iniciar."); return; }
    localStorage.setItem("rosco_name", player);
    setStarted(true);
    pickQuestionAtIndex(0);
    try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); ctx.resume(); } catch(e) {}
  }

  function handleResponse(type) {
    const letter = LETTERS[currentLetterIndex];
    const newStatus = { ...statusByLetter };
    if (type === 'ok') { newStatus[letter] = 'correct'; setScore(s=>s+1); playTone('ok'); }
    else if (type === 'wrong') { newStatus[letter] = 'wrong'; playTone('wrong'); }
    else { newStatus[letter] = 'pass'; playTone('pass'); }
    setStatusByLetter(newStatus);
    const next = findNextPending(currentLetterIndex);
    if (next === -1) { endGame(); } else { pickQuestionAtIndex(next); setCurrentLetterIndex(next); }
  }

  function findNextPending(startIdx) {
    for (let i=1;i<=LETTERS.length;i++){
      const idx = (startIdx + i) % LETTERS.length;
      if (statusByLetter[LETTERS[idx]] === 'pending') return idx;
    }
    return -1;
  }

  function endGame() {
    setStarted(false);
    const board = JSON.parse(localStorage.getItem('rosco_board') || '[]');
    board.push({ name: player, score, date: new Date().toISOString() });
    board.sort((a,b)=>b.score-a.score);
    localStorage.setItem('rosco_board', JSON.stringify(board.slice(0,50)));
    alert(`Juego terminado. Puntaje: ${score}`);
  }

  function renderLettersCircle(){
    const radius = 150;
    const center = 220;
    return LETTERS.map((L,i)=>{
      const angle = (i/LETTERS.length)*Math.PI*2 - Math.PI/2;
      const x = center + Math.cos(angle)*radius;
      const y = center + Math.sin(angle)*radius;
      const status = statusByLetter[L] || 'pending';
      const color = status === 'pending' ? '#ddd' : status === 'correct' ? '#22c55e' : status === 'wrong' ? '#ef4444' : '#f59e0b';
      return (
        <div key={L} onClick={()=>{ if(!started){ pickQuestionAtIndex(i); setCurrentLetterIndex(i); }}} style={{position:'absolute', left:x-18, top:y-18, width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:color, color:'#111', fontWeight:700, cursor:'pointer'}}>{L}</div>
      );
    });
  }

  return (
    <div style={{minHeight:'100vh', padding:20}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h1 style={{fontSize:22, color:'#fff'}}>ROSCO SPL - Sociedad Punta de Lobos</h1>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <img src={logo} alt="SPL Logo" style={{width:96, height:48, objectFit:'contain'}} />
          </div>
        </header>

        <main style={{display:'flex', gap:16}}>
          <section style={{flex:'0 0 460px', background:'#071028', padding:12, borderRadius:8}}>
            <div style={{position:'relative', width:440, height:440, margin:'0 auto'}}>
              <div style={{position:'absolute', left:0, top:0, width:'100%', height:'100%', borderRadius:'50%', background:'rgba(255,255,255,0.02)'}} />
              {renderLettersCircle()}
              <div style={{position:'absolute', left:220-90, top:220-90, width:180, height:180, borderRadius:'50%', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', background:'#111'}}>
                {cameraOn ? <video ref={videoRef} playsInline muted style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{color:'#9ca3af'}}>Cámara</div>}
              </div>
            </div>
          </section>

          <section style={{flex:1, background:'#071028', padding:16, borderRadius:8}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
              <div>
                <input placeholder="Tu nombre" value={player} onChange={e=>setPlayer(e.target.value)} style={{padding:8, borderRadius:6}} />
                <button onClick={startGame} style={{marginLeft:8, padding:'8px 12px', borderRadius:6, background:'#16a34a', color:'#fff'}}>Iniciar Rosco</button>
                <button onClick={()=>{ setStarted(false); setScore(0); const init={}; LETTERS.forEach(l=>init[l]='pending'); setStatusByLetter(init); }} style={{marginLeft:8, padding:'8px 12px', borderRadius:6, background:'#374151', color:'#fff'}}>Reiniciar</button>
              </div>
              <div>
                <button onClick={toggleCamera} style={{padding:'8px 12px', borderRadius:6, background:'#2563eb', color:'#fff'}}>{cameraOn ? 'Apagar cámara' : 'Encender cámara'}</button>
              </div>
            </div>

            <div style={{background:'#021026', padding:12, borderRadius:8}}>
              <h2 style={{margin:0}}>Pregunta</h2>
              <p style={{minHeight:48, marginTop:8}}>{currentQuestion ? currentQuestion.q : 'Presiona Iniciar Rosco para comenzar o haz clic en una letra.'}</p>

              <div style={{display:'flex', gap:8, marginTop:12}}>
                <button disabled={!started} onClick={()=>handleResponse('ok')} style={{flex:1, padding:10, borderRadius:6, background:'#10b981'}}>Correcto</button>
                <button disabled={!started} onClick={()=>handleResponse('pass')} style={{flex:1, padding:10, borderRadius:6, background:'#f59e0b'}}>Pasapalabra</button>
                <button disabled={!started} onClick={()=>handleResponse('wrong')} style={{flex:1, padding:10, borderRadius:6, background:'#ef4444'}}>Incorrecto</button>
              </div>

              <div style={{marginTop:14}}>
                <strong>Puntaje:</strong> {score}
              </div>

              <div style={{marginTop:12}}>
                <strong>Leaderboard local:</strong>
                <ol>
                  {JSON.parse(localStorage.getItem('rosco_board') || '[]').slice(0,6).map((r,i)=>(<li key={i}>{r.name} — {r.score}</li>))}
                </ol>
              </div>

            </div>
          </section>
        </main>

        <footer style={{marginTop:16, color:'#9ca3af'}}>Deploy en localhost (http://localhost:5173). Para usar cámara en otros dispositivos, despliega en Netlify/Vercel/Firebase (HTTPS).</footer>
      </div>
    </div>
  );
}

/* global webkitSpeechRecognition */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "./hooks"; // Ruta del archivo
import start_sound from "../start_sound.mp3";
import end_sound from "../end_sound.mp3";
export const FloatingMenu = ({ title, customStyle = {} }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false); // Estado para la animación

  useEffect(() => {
    // Posiciona el menú en la esquina inferior derecha al cargar
    const initialX = window.innerWidth - 320; // Ancho del menú (ajusta según diseño)
    const initialY = window.innerHeight - 200; // Alto del menú desde abajo
    setPosition({ x: initialX, y: initialY });

    // Retrasa el estado para activar la animación
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`floating-menu ${isLoaded ? "loaded" : ""}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        position: "absolute",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        padding: "16px",
        cursor: isDragging ? "grabbing" : "grab",
        transition: "transform 0.3s ease, opacity 0.3s ease", // Animación de pop-up
        transform: isLoaded ? "scale(1)" : "scale(0.5)",
        opacity: isLoaded ? 1 : 0,
        ...customStyle,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Detiene el arrastre si el ratón sale del área
    >
      <div className="menu-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 style={{ margin: 0 }}>{title}</h4>
        <button
          onClick={handleClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ✖
        </button>
      </div>
      <div className="menu-content">
        <p style={{ margin: 0 }}>Este es un menú flotante con animación.</p>
      </div>
    </div>
  );
};

export const VoiceRecognition = ({ onCommandDetected }) => {
  useEffect(() => {
    console.log("Inicializando reconocimiento de voz...");

    // Verificar si el navegador soporta Web Speech API
    if (!("webkitSpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Google Chrome.");
      return;
    }

    // Crear una instancia de reconocimiento de voz
    const recognitionInstance = new webkitSpeechRecognition();
    recognitionInstance.lang = "en-US"; // Idioma español
    recognitionInstance.continuous = true; // Escucha continua
    recognitionInstance.interimResults = false; // Solo resultados finales
    // Pre-cargar el sonido para evitar retrasos
    const activationSound = new Audio(start_sound);
    activationSound.load();
    // Manejar los resultados del reconocimiento de voz
    recognitionInstance.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("Voz:", transcript);

      const keywords = ["ok class", "okay class"]; // Palabras clave a detectar

      // Detectar palabras clave y ejecutar acciones
      if (keywords.some(keyword => transcript.toLowerCase().includes(keyword))) {
        console.log("Palabra clave detectada: Activando comando.");

        // Reproducir sonido solo si hay interacción previa
        activationSound.play().catch((error) => {
          console.warn("No se pudo reproducir el sonido:", error);
        });

        onCommandDetected(transcript); // Llama a la función pasada como prop
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
    };

    recognitionInstance.onend = () => {
      console.log("Reconocimiento finalizado. Reiniciando...");
      recognitionInstance.start(); // Reinicia automáticamente la escucha
    };

    // Iniciar el reconocimiento de voz
    recognitionInstance.start();

    // Limpiar la instancia al desmontar el componente
    return () => {
      recognitionInstance.stop();
      recognitionInstance.onresult = null;
      recognitionInstance.onerror = null;
      recognitionInstance.onend = null;
    };
  }, [onCommandDetected]);

  return null; // Este componente no necesita renderizar nada
};
export const TopMenu = ({
    userInitial,
    isSidebarOpen,
    setIsSidebarOpen,
    setShowModal,
    state,
    classId,
    fetchStudents
})=>{
// profile menu
const [userMenuOpen, setUserMenuOpen] = useState(false);
const menuRef = useRef(null); // Referencia al menú desplegable
useClickOutside(menuRef, () => setUserMenuOpen(false));
    //logout
const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

//ChatWithAI Ai chat
const [inputValue, setInputValue] = useState(""); // Texto ingresado por el usuario
const [placeholderText, setPlaceholderText] = useState("En qué te puedo ayudar"); // Texto del placeholder
const [isFocused, setIsFocused] = useState(false); // Indica si el input está enfocado
const [isLoading, setIsLoading] = useState(false); // Indicador de carga

const fetchResponse = async (userMessage) => {
  try {
    setIsLoading(true);
    // Llamada al backend
    const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`, // Asegúrate de que este token es válido
        },
        body: JSON.stringify({ message: userMessage, state: state, class_id: classId }),
    });
  
    if (!response.ok) {
      throw new Error("Error al comunicarse con el servidor");
    }

    const data = await response.json();
        // Actualizar fetchStudents si es necesario
    if (data.update_required) {
      await fetchStudents();
    }
    // Muestra la respuesta de la IA en el placeholder
    setPlaceholderText(data.response || "Sin respuesta");
  } catch (error) {
    console.error("Error al obtener la respuesta:", error);
    setPlaceholderText("Lo siento, ocurrió un error al procesar tu solicitud."); // Muestra error en el placeholder
  } finally {
    setIsLoading(false); // Termina la carga
  }
};

const handleKeyPress = async (e) => {
  if (e.key === "Enter" && inputValue.trim() !== "") {
    const userMessage = inputValue;

    // Limpia el input y actualiza el placeholder
    setInputValue(""); // Limpia el cuadro de texto
    setPlaceholderText(""); // Muestra que está procesando
    setIsFocused(false); // Cierra el placeholder

    await fetchResponse(userMessage); // Llama a la IA para obtener respuesta
  }

  
};
// audio chat
const [isRecording, setIsRecording] = useState(false); // Estado para indicar si se está grabando
const [recorder, setRecorder] = useState(null); // MediaRecorder instance

// Función para manejar la grabación de audio
const handleRecordAudio = async () => {
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      const audioChunks = [];
      const silenceDuration = 3000; // Duración del silencio en ms (3 segundos)
      let silenceTimer = null; // Temporizador para detectar silencio
      const endSound = new Audio(end_sound);

      // Asegúrate de cargar el sonido de fin
      endSound.addEventListener("canplaythrough", () => {
        console.log("End sound cargado correctamente.");
      });

      endSound.addEventListener("error", (e) => {
        console.error("Error al cargar el sonido de fin de conversación:", e);
      });

      // Configuración de Web Audio API para detección de silencio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      mediaStreamSource.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // Función para detener la grabación
      const stopRecording = async () => {
        console.log("Silencio detectado. Deteniendo grabación...");
        if (mediaRecorder.state === "inactive") {
          console.warn("Grabación ya detenida.");
          return;
        }

        setIsRecording(false); // Actualiza el estado para el botón
        mediaRecorder.stop();
        clearTimeout(silenceTimer);

        try {
          // Reproduce el sonido de fin si está pausado
          if (endSound.paused) {
            endSound.currentTime = 0;
            await endSound.play();
            console.log("Sonido de fin reproducido correctamente.");
          }
        } catch (error) {
          console.error("Error al reproducir el sonido de fin de conversación:", error);
        }
      };

      // Función para monitorear el silencio
      const monitorSilence = () => {
        analyser.getByteFrequencyData(dataArray);

        const averageVolume =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

        if (averageVolume < 10) {
          if (!silenceTimer) {
            silenceTimer = setTimeout(stopRecording, silenceDuration);
          }
        } else {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }

        requestAnimationFrame(monitorSilence);
      };

      // Configuración de MediaRecorder
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
        console.log("Data available");
      };

      mediaRecorder.onstop = async () => {
        clearTimeout(silenceTimer);

        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.mp3");
        formData.append("class_id", classId);
        formData.append("state", state);

        setIsLoading(true);
        try {
          const response = await fetch("http://localhost:8000/api/chat/audio", {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });

          if (!response.ok) {
            throw new Error("Error al enviar el audio");
          }

          const data = await response.json();

          if (data.update_required) {
            await fetchStudents();
          }
          setPlaceholderText(data.response || "Sin respuesta");
        } catch (error) {
          console.error("Error al enviar el audio:", error);
          setPlaceholderText("Error al procesar el audio.");
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start(1000); // Inicia la grabación
      monitorSilence(); // Comienza a monitorear el silencio
      setRecorder(mediaRecorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error al iniciar la grabación:", error);
      setPlaceholderText("No se pudo iniciar la grabación.");
    }
  } else {
    recorder.stop(); // Detener grabación manualmente
    setIsRecording(false);
  }
};
return(
    <div className="fixed w-full z-20 bg-white shadow-md px-6 py-4 flex items-center justify-between">
    <div className="flex items-center">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <span className="material-icons text-2xl">menu</span>
      </button>
      <h2 className="text-2xl font-bold text-gray-800 ml-4">nextClass_</h2>
    </div>
     {/* Chat */}
    <div className="flex items-center bg-gray-100 text-gray-400 rounded-full px-4 py-2 w-full max-w-4xl mx-auto shadow-lg justify-between">
      {/* Botón de acción izquierda */}
      <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700">
        <span className="material-icons text-xl">add</span>
      </button>

      {/* Cuadro de texto con animación mientras espera */}
      <div className="relative w-full mx-4">
        {isLoading ? (
          // Muestra el círculo animado cuando isLoading es true
          <div className="flex justify-center items-center">
            <div className="bg-gray-800 rounded-full blink w-3 h-3"></div>
          </div>
        ) : (
          // Muestra el input cuando no está cargando
          <input
            type="text"
            placeholder={isFocused ? "" : placeholderText} // Si está enfocado, no muestra placeholder
            className="input-with-placeholder w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none px-2 py-2 border-none focus:ring-0 focus:ring-offset-0"
            value={inputValue}
            onFocus={() => setIsFocused(true)} // Elimina el placeholder cuando el input está enfocado
            onBlur={() => setIsFocused(false)} // Muestra el placeholder cuando el input pierde el foco
            onChange={(e) => setInputValue(e.target.value)} // Actualiza el texto ingresado
            onKeyDown={handleKeyPress} // Escucha la tecla Enter
          />
        )}
      </div>

      {/* Contenedor para íconos alineados a la derecha */}
      <div className="flex items-center space-x-4">
        {/* Ícono de micrófono */}
          <button
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              isRecording ? "bg-red-500" : "hover:bg-gray-700"
            }`}
            onClick={handleRecordAudio}
          >
            <span className="material-icons text-xl">{isRecording ? "stop" : "mic"}</span>
          </button>
        {/* Reconocimiento de voz */}
            <VoiceRecognition
            onCommandDetected={handleRecordAudio}
            ></VoiceRecognition>
        {/* Ícono de auriculares */}
{/*         <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700">
          <span className="material-icons text-xl">headphones</span>
        </button> */}
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setShowModal(true)}
        className="w-12 h-12 flex items-center justify-center rounded-full text-gray-600 hover:text-blue-500 hover:bg-gray-200 transition-colors duration-200"
      >
        <span className="material-icons text-4xl">add</span>
      </button>
      
      <div className="relative">
        <button className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full focus:outline-none hover:bg-blue-600"
          onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <span className="text-lg font-bold">{userInitial}</span>
        </button>
        {userMenuOpen && (
          <div ref={menuRef} className="absolute top-12 right-0 bg-white shadow-lg rounded-lg py-2 w-48">
            <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
              Profile
            </button>
            <button onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
              Logout
            </button>
          </div>
        )}  
      </div>
    </div>
  </div>

);
}



export const Sidebar = ({ isSidebarOpen, currentPage }) => {
  const navigate = useNavigate(); // Hook for navigation
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const getMenuItems = () => {
    switch (currentPage) {
      case "Home":
        return [
          { icon: "home", label: "Inicio", route: "/" },
          { icon: "calendar_today", label: "Programación", route: "/calendar" },
          { icon: "class", label: "Clases impartidas", route: "/classes" },
          { icon: "settings", label: "Ajustes", route: "/settings" },
        ];
      case "ClassMenu":
        return [
          {
            icon: "insert_chart",
            label: "Cuaderno del Profesor",
            isDropdown: true,
            dropdownItems: [
              { icon: "show_chart", label: "Evaluación", route: "/evaluation" },
              {
                icon: "calendar_today",
                label: "Programación",
                route: "/class-calendar",
              },
            ],
          },
          {
            icon: "book",
            label: "Cuaderno del alumno",
            isDropdown: true,
            dropdownItems: [
              { icon: "menu_book", label: "Libro", route: "class-book" },
              { icon: "check_circle", label: "Actividades", route: "/activities" },
            ],
          },
          { icon: "person_add", label: "Añadir estudiante", route: "/add-student" },
          { icon: "settings", label: "Ajustes", route: "/class-settings" },
        ];
      case "settings":
        return [
          { icon: "settings", label: "Configuración general", route: "/general" },
          { icon: "lock", label: "Privacidad", route: "/privacy" },
          { icon: "notifications", label: "Notificaciones", route: "/notifications" },
        ];
      default:
        return [
          { icon: "home", label: "Inicio", route: "/" },
          { icon: "help", label: "Ayuda", route: "/help" },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-0"
      } bg-white shadow-lg transition-all duration-300 fixed h-full z-10 overflow-hidden`}
    >
      <nav className="mt-6">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="relative">
              {/* Main menu item */}
              <div
                className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer ${
                  item.isDropdown ? "justify-between" : ""
                }`}
                onClick={() => (item.isDropdown ? toggleDropdown() : navigate(item.route))}
              >
                <div className="flex items-center">
                  <span className="material-icons text-gray-600 mr-3">
                    {item.icon}
                  </span>
                  <span className="text-gray-800">{item.label}</span>
                </div>
                {item.isDropdown && (
                  <span className="material-icons text-gray-500">
                    {isDropdownOpen ? "expand_less" : "expand_more"}
                  </span>
                )}
              </div>

              {/* Dropdown menu */}
              {item.isDropdown && isDropdownOpen && (
                <ul className="pl-8 bg-gray-50">
                  {item.dropdownItems.map((dropdownItem, subIndex) => (
                    <li
                      key={subIndex}
                      className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(dropdownItem.route)}
                    >
                      <span className="material-icons text-gray-600 mr-3">
                        {dropdownItem.icon}
                      </span>
                      <span className="text-gray-800">{dropdownItem.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

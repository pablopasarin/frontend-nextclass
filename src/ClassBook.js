import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopMenu, Sidebar } from "./utils/components";
import { useNavigate } from "react-router-dom";
import { getUserDetailsFromToken } from "./utils/auth";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const API_URL = process.env.REACT_APP_API_URL;


const MarkdownContainer = () => {
  const [contentBlocks, setContentBlocks] = useState([
    { id: 1, text: "# Bienvenidos al Cuaderno de Clase" },
    {
      id: 2,
      text: "Este cuaderno contiene información clave sobre las asignaturas.",
    },
    {
      id: 3,
      text: "## Matemáticas\nEcuación en línea: $E = mc^2$",
    },
    {
      id: 4,
      text: "```javascript\n// Código de ejemplo\nconst suma = (a, b) => a + b;\nconsole.log(suma(2, 3)); // 5\n```",
    },
    {
      id: 5,
      text: "### Notas Importantes\n- Usa la fórmula: $\\int_a^b f(x) dx = F(b) - F(a)$.\n- **Recuerda siempre practicar!**",
    },
  ]);

  const [editingBlockId, setEditingBlockId] = useState(null);

  const handleBlockClick = (id) => {
    setEditingBlockId(id);
  };

  const handleBlur = () => {
    setEditingBlockId(null);
  };

  const handleChange = (id, value) => {
    setContentBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, text: value } : block
      )
    );
  };

  return (
    <div className="p-4 bg-gray-100 text-gray-900 min-h-screen space-y-4">
      {contentBlocks.map((block) => (
        <div
          key={block.id}
          className={`relative p-4 rounded-lg ${
            editingBlockId === block.id
              ? "markdown-editor bg-white border-l-4 border-blue-500"
              : "markdown-viewer bg-white"
          }`}
          onClick={() => handleBlockClick(block.id)}
        >
          {editingBlockId === block.id ? (
            <textarea
              autoFocus
              value={block.text}
              onChange={(e) => handleChange(block.id, e.target.value)}
              onBlur={handleBlur}
              className="w-full h-auto border-none p-2 resize-none outline-none bg-transparent font-mono"
              rows={block.text.split("\n").length || 3}
            />
          ) : (
                <ReactMarkdown
                children={block.text}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                className="prose"
                />
          )}
        </div>
      ))}
    </div>
  );
};








const ClassBook = () => {

   

    const { classId } = useParams(); // Obtiene el ID de la clase desde la URL
    const [classDetails, setClassDetails] = useState(null);
  
    const navigate = useNavigate();
    const userDetails = getUserDetailsFromToken();
  
    const userName = userDetails.username;
    const userId = userDetails.user_id;
    const isTeacher = userDetails.is_teacher;
    //for TopMenu
    const userInitial = userName.charAt(0).toUpperCase();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar el menú lateral
    const [showModal, setShowModal] = useState(false);
  
  // load modal
  const [newStudentName, setNewStudentName] = useState(""); // Almacenar el nombre y apellidos del estudiante
  const [newStudentEmail, setNewStudentEmail] = useState(""); // Almacenar el correo electrónico del estudiante
  
const handleAddStudent = async () => {
      // Validar que los campos no estén vacíos
      if (newStudentName.trim() === "" || newStudentEmail.trim() === "") {
        alert("Por favor, completa todos los campos.");
        return;
      }
    
      // Crear el objeto del estudiante
      const newStudent = {
        name: newStudentName,
        email: newStudentEmail,
      };
    
      try {
        // Llamada al backend para guardar el estudiante
        const response = await fetch(`${API_URL}/students/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        });
    
        if (!response.ok) {
          throw new Error("Error al añadir el estudiante.");
        }
    
        // Si el estudiante se añade correctamente
        alert("Estudiante añadido con éxito.");
        handleCancel(); // Cierra el modal y resetea el formulario
      } catch (error) {
        console.error("Error al añadir el estudiante:", error);
        alert("Error al añadir el estudiante. Por favor, inténtalo de nuevo.");
      }
    };
  
const handleCancel = () => {
      setShowModal(false); // Cierra el modal
      setNewStudentName(""); // Limpia el nombre
      setNewStudentEmail(""); // Limpia el correo electrónico
    };
  
  
    useEffect(() => {
      const fetchClassDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/classes/${classId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
          if (!response.ok) {
            throw new Error("Error fetching class details");
          }
          const data = await response.json();
          setClassDetails(data); // Guarda los detalles de la clase en el estado
        } catch (error) {
          console.error(error.message);
        }
      };
  
      fetchClassDetails();
    }, [classId]);
    if (!classDetails) {
      return (
          <div class="text-center">
      <div role="status">
          <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span class="sr-only">Loading...</span>
      </div>
  </div>
      ); // Muestra un estado de carga mientras se obtiene la información
    }   
  
  
    return (
  <div className="h-screen bg-gray-100 w-full">
        {/* Top Menu */}
        <TopMenu
    userInitial={userInitial}
    isSidebarOpen={isSidebarOpen}
    setIsSidebarOpen={setIsSidebarOpen}
    setShowModal={setShowModal}
  />
  <div className="flex pt-16">
  
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} currentPage="ClassBook" />
          {/* bookcourse */}
          <div
            className={`flex-grow p-6 mt-4 bg-gray-100 overflow-auto transition-all duration-300 ${
              isSidebarOpen ? "ml-64" : "ml-0"
            }`}
          >
            <MarkdownContainer />
          </div>
  </div>
      {/* Modal */}
       {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Añadir alumno a la clase</h2>
              <div className="mb-4">
                <label htmlFor="className" className="block text-gray-700 font-medium">
                  Nombre y apellidos
                </label>
                <input
                  type="text"
                  id="studentName"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ej. Pedro Pérez Gómez"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="className" className="block text-gray-700 font-medium">
                  Correo electrónico
                </label>
                <input
                  type="text"
                  id="studentEmail"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ej. pedro.perez@gmail.com"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCancel}
                  className="mr-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddStudent}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        )}
  </div>
  
  
     
    );
  };
  
  export default ClassBook;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopMenu, Sidebar } from "./utils/components";
import { useNavigate } from "react-router-dom";
import { getUserDetailsFromToken } from "./utils/auth";
import ProductTable from "./ProductTable";

const API_URL = process.env.REACT_APP_API_URL; // Fallback a local



const ClassMenu = () => {
  const [newStudents, setNewStudents] = useState([]);

  const { classId } = useParams(); // Obtiene el ID de la clase desde la URL
  const [classData, setClassData] = useState(null);

  const navigate = useNavigate();
  const userDetails = getUserDetailsFromToken();

  const userName = userDetails.username;
  const userId = userDetails.user_id;
  const isTeacher = userDetails.is_teacher;
  //for TopMenu
  const userInitial = userName.charAt(0).toUpperCase();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar el menú lateral
  const [showModal, setShowModal] = useState(false);

//fetch students
const [students, setStudents] = useState([]);

// Función para obtener estudiantes matriculados
const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_URL}/students/${classId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener los estudiantes");
    }
    const data = await response.json();
    setStudents(data.students || []);
    console.log("fetchstudents", data.students)
  } catch (error) {
    console.error("Error al cargar los estudiantes:", error);
  }
};
const fetchClassData = async () => {
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
    setClassData(data); // Guarda los detalles de la clase en el estado
  } catch (error) {
    console.error(error.message);
  }
};

// Llama a `fetchStudents` al cargar el componente
useEffect(() => {
  fetchClassData();
  fetchStudents();

}, [classId]);


// load modal
const [newStudentName, setNewStudentName] = useState(""); // Almacenar el nombre y apellidos del estudiante
const [newStudentEmail, setNewStudentEmail] = useState(""); // Almacenar el correo electrónico del estudiante
const handleAddStudent = async () => {
  // Validar campos vacíos
  if (newStudentName.trim() === "" || newStudentEmail.trim() === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Verificar si el nombre o correo ya existen
  const isDuplicate = students.some(
    (student) =>
      student.name.toLowerCase() === newStudentName.toLowerCase() ||
      student.email.toLowerCase() === newStudentEmail.toLowerCase()
  );

  if (isDuplicate) {
    alert("El nombre o correo electrónico ya existe en esta clase.");
    return;
  }

  // Crear objeto del estudiante
  const newStudent = {
    name: newStudentName,
    email: newStudentEmail,
    class_id: classId,
  };
  try {
    const response = await fetch(`${API_URL}/students/students/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(newStudent),
    });

    if (!response.ok) {
      throw new Error("Error al añadir el estudiante.");
    }

    handleCancel(); // Cierra el modal y resetea los campos
    fetchStudents(); // Actualiza la lista de estudiantes
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

  const [useTableInput, setUseTableInput] = useState(false);
  const [studentTableData, setStudentTableData] = useState('');
  const handleAddStudentsFromTable = async () => {
    const validStudents = newStudents.filter(
      (student) =>
        student?.name?.trim() !== "" && student?.email?.trim() !== ""
    );
  
    // Convertir class_id a un número entero
    const studentsWithClassId = validStudents.map((student) => ({
      ...student,
      class_id: parseInt(classId, 10), // Asegurarte de que sea un número entero
    }));
  
    console.log("Datos enviados al backend:", { students: studentsWithClassId });
  
    if (studentsWithClassId.length === 0) {
      alert("No hay estudiantes válidos para añadir. Verifica los campos.");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/students/students/bulk_add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ students: studentsWithClassId }),
      });
  
      if (!response.ok) {
        throw new Error("Error al añadir los estudiantes.");
      }
  
      alert("Estudiantes añadidos con éxito.");
      setNewStudents([]);
      handleCancel();
      fetchStudents();
    } catch (error) {
      console.error("Error al añadir los estudiantes:", error);
      alert("Error al añadir los estudiantes. Por favor, inténtalo de nuevo.");
    }
  };
  useEffect(() => {


  }, [classId]);


  if (!classData) {
    return (
        <div className="text-center">
    <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
</div>
    ); // Muestra un estado de carga mientras se obtiene la información
  }

  // tabla estudiantes 


  const handleEnterNavigation = (e, rowIndex, colIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
  
      // Obtiene el contenido de la celda actual
      const cellContent = e.target.textContent.trim();
  
      // Limpia el contenido de la celda actual antes de actualizar el estado
      e.target.textContent = "";
  
      // Actualiza el estado con el contenido de la celda actual
      setNewStudents((prev) => {
        const updatedStudents = [...prev];
  
        // Si estamos actualizando una fila existente
        if (rowIndex < updatedStudents.length) {
          if (colIndex === 0) {
            updatedStudents[rowIndex].name = cellContent;
          } else {
            updatedStudents[rowIndex].email = cellContent;
          }
        } else {
          // Solo crea una nueva fila si no existe una vacía
          if (
            !updatedStudents.some(
              (student) => student.name.trim() === "" && student.email.trim() === ""
            )
          ) {
            updatedStudents.push(
              colIndex === 0
                ? { name: cellContent, email: "" }
                : { name: "", email: cellContent }
            );
          }
        }
  
        return updatedStudents;
      });
  
      // Mueve el foco a la celda correspondiente en la nueva fila
      const table = e.target.closest("table");
      const cells = table.querySelectorAll("td[contenteditable='true']");
      const currentIndex = Array.from(cells).indexOf(e.target);
      let nextIndex = currentIndex + 2; // Salta a la celda de la siguiente fila
  
      // Cambia el foco a la siguiente celda si existe
      setTimeout(() => {
        cells[nextIndex]?.focus();
      }, 0);
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
  
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text");
  
    // Procesar datos pegados: dividir en filas y columnas
    const rows = pastedData
      .trim()
      .split("\n") // Dividir en filas por líneas nuevas
      .map((row) => row.split("\t").map((cell) => cell.trim())); // Dividir en columnas por tabulación
  
    const newStudentData = rows.map(([name = "", email = ""]) => ({ name, email }));
  
    setNewStudents((prev) => [...prev, ...newStudentData]); // Añadir las nuevas filas al estado
  };
  return (
<div className="h-screen bg-gray-100 w-full">
      {/* Top Menu */}
      <TopMenu
  userInitial={userInitial}
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
  setShowModal={setShowModal}
  state={"in_class"}
  classId={classId}
  fetchStudents={fetchStudents}
/>
<div className="flex pt-16">

    {/* Sidebar */}
    <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} currentPage="ClassMenu" />
        {/* students table */}
        <div
          className={`flex-grow p-6 mt-4 bg-gray-100 overflow-auto transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
        
        {isTeacher ? (
            <ProductTable
                students={students}
                categories={classData?.categories}
            />
        ) : (
            <div className="text-center text-gray-700">
                <h2>No tienes permiso para acceder a esta vista.</h2>
            </div>
        )}
        </div>

</div>
    {/* Modal */}
{/* Modal */}
{showModal && (
  <div className="fixed z-500 inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
  style={{
    zIndex: 9999, // Z-index alto para estar encima
  }}
  >
    <div className="bg-white p-6 rounded-lg shadow-lg w-[40rem]">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Añadir alumno a la clase</h2>



      {useTableInput ? (
        // Tabla estilo Excel con slider para agregar alumnos
<div className="overflow-auto max-h-96">
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr>
        <th className="border border-gray-300 p-2 text-left">Nombre</th>
        <th className="border border-gray-300 p-2 text-left">Correo Electrónico</th>
      </tr>
    </thead>
    <tbody>
      {newStudents.map((student, index) => (
        <tr key={index}>
          <td
            className="border border-gray-300 p-2"
            contentEditable
            suppressContentEditableWarning
            onKeyDown={(e) => handleEnterNavigation(e, index, 0)}
          >
            {student.name}
          </td>
          <td
            className="border border-gray-300 p-2"
            contentEditable
            suppressContentEditableWarning
            onKeyDown={(e) => handleEnterNavigation(e, index, 1)}
          >
            {student.email}
          </td>
        </tr>
      ))}
      {/* Fila vacía para añadir más datos */}
      <tr>
        <td
          className="border border-gray-300 p-2"
          contentEditable
          suppressContentEditableWarning
          onPaste={handlePaste} // Nuevo manejador de pegado
          onKeyDown={(e) => handleEnterNavigation(e, newStudents.length, 0)}
        ></td>
        <td
          className="border border-gray-300 p-2"
          contentEditable
          suppressContentEditableWarning
          onPaste={handlePaste} // Nuevo manejador de pegado
          onKeyDown={(e) => handleEnterNavigation(e, newStudents.length, 1)}
        ></td>
      </tr>
    </tbody>
  </table>
  <p className="text-sm text-gray-600 mt-2">
    Pega los datos desde Excel (asegúrate de copiar dos columnas: Nombre y Correo Electrónico).
  </p>
</div>
      ) : (
        // Campos individuales para añadir un alumno
        <>
          <div className="mb-4">
            <label htmlFor="studentName" className="block text-gray-700 font-medium">
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
            <label htmlFor="studentEmail" className="block text-gray-700 font-medium">
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
        </>
      )}
      {/* Checkbox para habilitar la tabla */}
      <div className="mb-4">
        <label className="flex items-center text-gray-700 font-medium">
          <input
            type="checkbox"
            checked={useTableInput}
            onChange={(e) => {
              setUseTableInput(e.target.checked);
              setNewStudents([]); // Limpia la tabla al cambiar el modo
            }}
            className="mr-2"
          />
          Añadir múltiples alumnos
        </label>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleCancel}
          className="mr-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={useTableInput ? handleAddStudentsFromTable : handleAddStudent}
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

export default ClassMenu;
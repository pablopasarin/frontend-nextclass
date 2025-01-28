import React, { useRef,useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/animation.css";
import { getUserDetailsFromToken } from "./utils/auth";
import { TopMenu, Sidebar } from "./utils/components";



const API_URL = process.env.REACT_APP_API_URL; // Fallback a local


const SettingsModal = ({ isVisible, onClose, onSave, classDetails }) => {

  console.log("token",localStorage.getItem("access_token"));

  const [activeTab, setActiveTab] = useState("General"); // Estado para la pestaña activa
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState({
    categories: [],
    challenges: [], // Inicializamos categories como un array vacío
    name: "",
    academic_year: "",
    group: "",
    subject: "",
    subcategories: [],
    is_invitation_code_enabled: false,
  });  
  const [originalAvailableChallenges, setOriginalAvailableChallenges] = useState([]);
 // Cargar datos al abrir el modal
  useEffect(() => {
    setOriginalAvailableChallenges(availableChallenges);
      const fetchClassDetails = async () => {
        if (isVisible && classDetails.id) {
          setLoading(true);
          try {
            const response = await fetch(`${API_URL}/classes/${classDetails.id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            });
  
            if (!response.ok) {
              throw new Error("Error al obtener los detalles de la clase.");
            }
  
            const data = await response.json();
            if (!data.challenges) {
              data.challenges = [];
            }
            if (!data.items) {
              data.items = [];
            }
            if (!data.categories || data.categories.length === 0) {
              data.categories = [
                { id: null, name: "Comportamiento", weight: 25, subcategories: [] },
                { id: null, name: "Participación", weight: 25, subcategories: [] },
                { id: null, name: "Pruebas", weight: 25, subcategories: [] },
                { id: null, name: "Tareas", weight: 25, subcategories: [] },
              ];
            } else {
              data.categories = data.categories.map((category) => ({
                ...category,
                subcategories: category.subcategories || [],
              }));
            }
            setClassData(data);
            console.log(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
      };
  
      fetchClassDetails();
    }, [isVisible, classDetails.id]);
  
    // Guardar cambios
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      if (totalweight !== 100) {
        alert("El total de los porcentajes debe ser 100%.");
        setIsSaving(false); // Asegúrate de que el estado se restablezca
        return; // Detén la ejecución aquí
      }
      setAvailableChallenges(originalAvailableChallenges); // Restaurar desafíos disponibles
      setIsSaving(true); // Establece el estado en true solo después de validar
      console.log("payload",classData);
      try {
        const response = await fetch(
          `${API_URL}/classes/user/update_class/${classDetails.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(classData),
          }
        );
    
        if (!response.ok) {
          throw new Error("Error al guardar los cambios.");
        }
    
        const updatedClass = await response.json();
        console.log("updated",updatedClass);
        onSave(updatedClass);
        onClose();
      } catch (error) {
        console.error(error);
        alert(error.message || "Error al guardar los cambios.");
      } finally {
        setIsSaving(false); // Restablece el estado en cualquier caso
      }
    };
  
    // Cancelar y cerrar modal
    const handleCancel = () => {
      setAvailableChallenges(originalAvailableChallenges); // Restaurar desafíos disponibles
      onClose();
  };
  
  const handleChange = (field, value) => {
    setClassData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCategoryChange = (index, field, value) => {
    setClassData((prevData) => ({
      ...prevData,
      categories: prevData.categories.map((category, i) =>
        i === index ? { ...category, [field]: value } : category
      ),
    }));
  };
  
  const handleAddCategory = () => {
    setClassData((prevData) => ({
      ...prevData,
      categories: [...prevData.categories, { id: null, name: "", weight: 0 }],
    }));
  };
  
  const handleRemoveCategory = (index) => {
    setClassData((prevData) => ({
      ...prevData,
      categories: prevData.categories.filter((_, i) => i !== index),
    }));
  };

  
  const handleAddChallenge = () => {
    const challengeToAdd = availableChallenges.find(
      (challenge) => challenge.name === selectedChallenge
    );
  
    if (challengeToAdd) {
      // Añadir el desafío al estado de `classData.challenges`
      setClassData((prevData) => ({
        ...prevData,
        challenges: [...prevData.challenges, { ...challengeToAdd, id: null }],
      }));

      // Eliminar el desafío de la lista de `availableChallenges`
      setAvailableChallenges((prevChallenges) =>
        prevChallenges.filter((challenge) => challenge.name !== selectedChallenge)
      );
  
      // Restablecer el desafío seleccionado
      setSelectedChallenge("");
    }
  };
  
  const handleRemoveChallenge = (index) => {
    setClassData((prevData) => ({
      ...prevData,
      challenges: prevData.challenges.filter((_, i) => i !== index),
    }));
  };
  
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    expirationTime: "",
    uses: "",
    icon: "",
  });

const [isIconPickerVisible, setIsIconPickerVisible] = useState(false);
const [currentItemIndex, setCurrentItemIndex] = useState(null);

const availableIcons = ["⚔️", "🛡️", "💎", "🍎", "🔥", "🌟", "💰", "🎯"];


  
const handleItemChange = (index, field, value) => {
  setClassData((prevData) => ({
    ...prevData,
    items: prevData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ),
  }));
};
  
const handleRemoveItem = (index) => {
  setClassData((prevData) => ({
    ...prevData,
    items: prevData.items.filter((_, i) => i !== index),
  }));
};
  
const handleAddItem = () => {
    setClassData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { ...newItem, id: null }],
    }));
    setNewItem({
      name: "",
      description: "",
      price: "",
      expirationTime: "",
      uses: "",
      icon: "",
    });
  };

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleIconSelect = (icon) => {
    if (isEditModalVisible) {
      // If editing, update the `editItem` state
      setEditItem({ ...editItem, icon });
    } else {
      // If adding a new item, update the `newItem` state
      setNewItem({ ...newItem, icon });
    }
    setIsIconPickerVisible(false); // Close the icon picker
  };
  
  const handleEditItem = (index) => {
    setEditItem({ ...classData.items[index], index }); // Load the selected item's data into the edit modal
    setIsEditModalVisible(true); // Open the edit modal
  };
  

  const [availableChallenges, setAvailableChallenges] = useState([
    { name: "Desafío 3", description: "Simulacro de examen." },
    { name: "Desafío 4", description: "Competencia de equipos en trigonometría." },
    { name: "Desafío 4", description: "Competencia de equipos en trigonometría." },
    { name: "Desafío 5", description: "Competencia de equipos en trigonometría." },
    { name: "Desafío 6", description: "Competencia de equipos en trigonometría." },
    { name: "Desafío 7", description: "Competencia de equipos en trigonometría." },
    { name: "Desafío 8", description: "Competencia de equipos en trigonometría." },

  ]);

  const [selectedChallenge, setSelectedChallenge] = useState("");



  



  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  const handleEditCategory = (index) => {
    const selectedCategory = classData.categories[index];
    setEditingIndex(index); // Índice de la categoría seleccionada
    setSubcategories(selectedCategory.subcategories || []); // Subcategorías de la categoría
    setIsEditing(true); // Abre el modal
  };

  const handleAddSubcategory = () => {
    setSubcategories((prev) => [...prev, { name: "", weight: 0 }]);
  };
  
  const handleSubcategoryChange = (index, key, value) => {
    setSubcategories((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };
  
  const handleRemoveSubcategory = (index) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(null);
  };
  const totalweight = classData.categories.reduce(
    (sum, category) => sum + category.weight, 0
  );

  const totalSubcategoryWeight = subcategories.reduce((sum, sub) => sum + sub.weight, 0);

  const isSaveDisabled =
  totalweight !== 100 || // Validación de categorías
  classData.categories.some((category) => !category.name?.trim()) || // Nombre de categorías vacío
  (subcategories.length > 0 && // Solo valida subcategorías si existen
    (subcategories.some((subcategory) => !subcategory.name?.trim()) || // Nombre de subcategorías vacío
     totalSubcategoryWeight !== 100)); // Pesos de subcategorías no suman 100

  const handleSaveEdit = () => {
      if (!isSaveDisabled) {
        setClassData((prevData) => {
          const updatedCategories = [...prevData.categories];
          updatedCategories[editingIndex] = {
            ...updatedCategories[editingIndex],
            subcategories: subcategories.map((sub) => ({
              ...sub,
              id: sub.id || null, // Asegúrate de que el ID sea nulo para nuevas subcategorías
            })),
          };
          console.log("subcat",updatedCategories);
          return { ...prevData, categories: updatedCategories };
        });
        setIsEditing(false);
        setEditingIndex(null);
      }
  };
  


  if (!isVisible) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <>
          
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Detalles de la clase</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de la clase (obligatorio)
                </label>
                <input
                  type="text"
                  value={classData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Año académico
                </label>
                <input
                  type="text"
                  value={classData.academic_year}
                  onChange={(e) => handleChange("academic_year", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Clase
                </label>
                <input
                  type="text"
                  value={classData.group}
                  onChange={(e) => handleChange("group", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Materia
                </label>
                <input
                  type="text"
                  value={classData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>
          </section>

        <section className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Códigos de invitación</h3>
        <div className="bg-gray-100 rounded-lg p-4">
          {/* Toggle */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Gestionar códigos de invitación
              </p>
              <p className="text-sm text-gray-500">
                Permite a cualquier usuario con el enlace o el código unirse a la clase. 
              </p>
            </div>

              <label class="inline-flex items-center cursor-pointer">
                <input
                id="invitation-toggle"
                checked={classData.is_invitation_code_enabled}
                onChange={(e) =>
                  handleChange("is_invitation_code_enabled", e.target.checked) // Usar `checked` para obtener el estado booleano
                }
                type="checkbox" value="" class="sr-only peer"></input>
                <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {classData?.is_invitation_code_enabled ? "Activado" : "Desactivado"}
                </span>
              </label>

          </div>

          {/* Invitation Details */}
          {classData?.is_invitation_code_enabled  && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlace de invitación
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={classData.invitation_link}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-200"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(classData.invitation_link)}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Copiar
                </button>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de clase
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={classData.invitation_code}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-200"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(classData.invitation_code)}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Copiar
                </button>
              </div>
            </>
          )}
        </div>
      </section>
          </>

        );
      case "Evaluación":
        return (
<section className="mb-6">
  <h3 className="text-lg font-semibold mb-4">Categorías</h3>
  <div className="space-y-4">
    {classData.categories.map((category, index) => (
      <div key={index} className="flex items-center space-x-4">
        <input
          type="text"
          value={category.name}
          placeholder={`Categoría ${index + 1}`}
          onChange={(e) => handleCategoryChange(index, "name", e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg p-2"
        />
                <span>%</span>
        <input
          type="text"
          value={category.weight}
          placeholder=""
          onChange={(e) => {
            const value = e.target.value;
            handleCategoryChange(index, "weight", value === "" ? "" : parseInt(value, 10));
          }}
          className="w-12 border border-gray-300 rounded-lg p-2"
        /> 
        <div className="flex flex-col items-start space-y-2">
       
          <button
            onClick={() => handleEditCategory(index)}
            className="text-blue-600 hover:underline disabled:opacity-50 disabled:text-gray-700 disabled:cursor-not-allowed"
            disabled={totalweight !== 100 || !category.name?.trim()} 
          >
            <span>Editar</span>
          </button>
        {classData.categories.length > 1 && (
          <button
            onClick={() => handleRemoveCategory(index)}
            className="text-red-600 hover:underline"
          >
            <span className="">Eliminar</span>
          </button>
        )}
      </div>
      </div>
    ))}
  </div>

  <div className="flex items-center justify-between mt-4">
    <button
      onClick={handleAddCategory}
      className="text-blue-600 hover:underline"
    >
      Añadir categoría
    </button>
    <p
      className={`text-sm font-medium ${
        totalweight === 100
          ? "text-green-600"
          : "text-red-600"
      }`}
    >
      {totalweight === 100
        ? ""
        : `El total de los porcentajes es ${totalweight}%, debe ser 100%`}
    </p>
  </div>
    {/* Modal para editar categoría y añadir subcategorías */}
    {isEditing && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        Subcategorías de {classData.categories[editingIndex]?.name}
      </h2>

      {/* Lista de subcategorías */}
      <div className="mb-4">
        <h3 className="text-gray-700 font-medium">Subcategorías</h3>
        {subcategories.map((subcategory, i) => (
          <div key={i} className="flex items-center space-x-4 mt-2">
            <input
              type="text"
              value={subcategory.name}
              placeholder="Subcategoría"
              onChange={(e) =>
                handleSubcategoryChange(i, "name", e.target.value)
              }
              className="flex-grow border border-gray-300 rounded-lg p-2"
            />
            <span>%</span>
            <input
              type="text"
              value={subcategory.weight}
              placeholder="%"
              onChange={(e) =>
                handleSubcategoryChange(
                  i,
                  "weight",
                  e.target.value ? parseFloat(e.target.value) : ""
                )
              }
              className="w-12 border border-gray-300 rounded-lg p-2"
            />
            <button
              onClick={() => handleRemoveSubcategory(i)}
              className="text-red-600 hover:underline"
            >
              X
            </button>
          </div>
        ))}
        <button
          onClick={handleAddSubcategory}
          className="text-blue-600 hover:underline mt-2"
        >
          Añadir subcategoría
        </button>
      </div>

      {/* Botones de guardar y cancelar */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleCancelEdit}
          className="mr-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveEdit}
          disabled={isSaveDisabled} // Deshabilita si `isSaveDisabled` es true
          className={`px-4 py-2 rounded-lg ${
            isSaveDisabled
              ? "opacity-50 bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}
</section>
        );
      case "Desafíos":
        return (
<section className="mb-6">
  <div className="space-y-4">
  <div className="max-h-96 overflow-y-auto space-y-4 p-4">
    {classData.challenges.map((challenge, index) => (
      <div key={index} className="border border-gray-300 rounded-lg p-4">
        <h4 className="text-md font-bold">{challenge.name}</h4>
        <p className="text-sm text-gray-600">{challenge.description}</p>
        <button
          onClick={() => handleRemoveChallenge(index)}
          className="text-red-600 hover:underline mt-2"
        >
          Eliminar
        </button>
      </div>
    ))}
  </div>
</div>
  {/* Añadir desafío */}
  <div className="mt-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Añadir desafío
    </label>
    <div className="flex items-center space-x-4">
      <select
    value={selectedChallenge}
    onChange={(e) => setSelectedChallenge(e.target.value)}
    className="flex-grow border border-gray-300 rounded-lg p-2"
  >
    <option value="">Seleccionar desafío</option>
    {availableChallenges
      .filter(
        (availableChallenge) =>
          !classData.challenges.some(
            (challenge) => challenge.name === availableChallenge.name
          )
      )
      .map((availableChallenge, index) => (
        <option key={index} value={availableChallenge.name}>
          {availableChallenge.name}
        </option>
      ))}
  </select>
      <button
        onClick={handleAddChallenge}
        disabled={!selectedChallenge}
        className={`px-4 py-2 rounded-lg ${
          selectedChallenge
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Añadir
      </button>
    </div>
  </div>
</section>
        );
      case "Ítems":
      return (
        <>
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Items</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {classData.items.map((item, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-md font-bold">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-500">
                        Precio: {item.price || "N/A"} | 
                        Tiempo de expiración: {item.expirationEnabled ? `${item.expirationTime} días` : "No activado"} | 
                        Usos: {item.uses || "N/A"} | 
                        Icono: {item.icon || "No seleccionado"}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEditItem(index)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
        
              {/* Añadir nuevo ítem */}
              <div className="mt-6">
                <h4 className="text-md font-bold mb-4">Añadir nuevo ítem</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre (obligatorio)</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Nombre del ítem"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <input
                      type="text"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Descripción"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      placeholder="Precio"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tiempo de expiración (días)</label>
                    <input
                      type="number"
                      value={newItem.expirationTime}
                      onChange={(e) =>
                        setNewItem({ ...newItem, expirationTime: e.target.value })
                      }
                      placeholder="Tiempo"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nº de usos</label>
                    <input
                      type="number"
                      value={newItem.uses}
                      onChange={(e) => setNewItem({ ...newItem, uses: e.target.value })}
                      placeholder="Usos"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Icono</label>
                      <button
                        onClick={() => {
                          setCurrentItemIndex(null);
                          setIsIconPickerVisible(true);
                        }}
                        className="border border-gray-300 rounded-lg p-2 w-full flex items-center justify-center"
                        required
                      >
                        {newItem.icon || "Seleccionar icono"}
                      </button>
                  </div>
                </div>
                <button
                  onClick={handleAddItem}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4 disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:bg-gray-300 disabled:text-gray-700"
                  disabled={!newItem.name || !newItem.price || !newItem.icon}
                >
                  Añadir
                </button>
              </div>
            </section>
            
            {isEditModalVisible && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
      <h3 className="text-lg font-semibold mb-4">Editar Ítem</h3>
      {/* Formulario para editar ítem */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={editItem.description}
            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="flex items-center space-x-2">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            value={editItem.price}
            onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Icono</label>
          <button
            onClick={() => setIsIconPickerVisible(true)}
            className="text-blue-600 hover:underline"
            required
          >
            {editItem.icon || "Seleccionar icono"}
            
          </button>
        </div>
        
        </div>

        <div className="flex items-center space-x-2">
        <div >
          <label className="block text-sm font-medium text-gray-700">Tiempo de expiración</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editItem.expirationEnabled}
              class = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) =>
                setEditItem({ ...editItem, expirationEnabled: e.target.checked })
              }
            />
            <input
              type="number"
              value={editItem.expirationTime}
              disabled={!editItem.expirationEnabled}
              onChange={(e) =>
                setEditItem({ ...editItem, expirationTime: e.target.value })
              }
              className={`border border-gray-300 rounded-lg p-2 ${
                editItem.expirationEnabled ? "" : "bg-gray-200 cursor-not-allowed"
              }`}
            />
          </div>
        </div>
          <div>
          <label className="block text-sm font-medium text-gray-700">Nº de usos</label>
        <div className="flex items-center space-x-2">
        <input
              type="checkbox"
              checked={editItem.usesEnabled}
              class = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) =>
                setEditItem({ ...editItem, usesEnabled: e.target.checked })
              }
            />
          <input
            type="number"
            value={editItem.uses}
            onChange={(e) => setEditItem({ ...editItem, uses: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

          </div>
        </div>
       
      </div>
                  {/* Botones de Guardar y Cancelar para editar ítem */}
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => setIsEditModalVisible(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        // Validar que el nombre no esté vacío
                        if (!editItem.name.trim()) {
                          alert("El nombre del ítem es obligatorio.");
                          return;
                        }

                        // Actualizar el ítem editado en classData
                        setClassData((prevData) => ({
                          ...prevData,
                          items: prevData.items.map((item, index) =>
                            index === editItem.index ? editItem : item
                          ),
                        }));
                        setIsEditModalVisible(false);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:bg-gray-300 disabled:text-gray-700"
                      disabled={!editItem.name || !editItem.price || !editItem.icon}
                    >
                      Guardar
                    </button>
                  </div>
    </div>
  </div>
)}
            {isIconPickerVisible && (
              <div className="fixed inset-0 z-[1050] bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Seleccionar Icono</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {availableIcons.map((icon, index) => (
                      <button
                        key={index}
                        onClick={() => handleIconSelect(icon)}
                        className="text-2xl p-2 hover:bg-gray-200 rounded-lg"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsIconPickerVisible(false)}
                    className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
</>
      );
      default:
        return null;
    }
  };


  return (
    <div
    className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
    role="dialog"
    aria-modal="true"
  >
    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div className="flex space-x-4">
          {["General", "Evaluación", "Desafíos", "Ítems"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <span className="material-icons">close</span>
        </button>
      </div>

      {/* Contenido de las pestañas */}
      {renderTabContent()}

      {/* Footer */}
      <div className="flex justify-end border-t pt-4">
        <button
        onClick={handleCancel}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 mr-2"
      >
        Cancelar
      </button>
      <button
        onClick={handleSave}
        className={`px-4 py-2 rounded-lg ${
          isSaveDisabled
            ? "opacity-50 bg-gray-300 text-gray-700 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        disabled={isSaveDisabled}
      >
        Guardar
      </button>
      </div>
    </div>
  </div>
  );
};


const DeleteModal = ({ isVisible, onClose, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deleteModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          {/* Modal Content */}
          <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>

          <p className="mb-4 text-gray-500 dark:text-gray-300 text-center">
            Todos los datos de esta clase se perderán. 
          </p>
          <p className="mb-4 text-gray-500 dark:text-gray-300 text-center text-bold">
            ¿Estás seguro?
          </p>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancelar
            </button>
            <button
              onClick={onConfirm}
              className="py-2 px-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-900"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const userDetails = getUserDetailsFromToken();

  const userName = userDetails.username;
  const userId = userDetails.user_id;
  const isTeacher = userDetails.is_teacher;
  //for TopMenu
  const userInitial = userName.charAt(0).toUpperCase();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar el menú lateral
  const [showModal, setShowModal] = useState(false);

  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);


  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [currentClassDetails, setCurrentClassDetails] = useState({});
  
  const openSettingsModal = (classItem) => {
    setCurrentClassDetails(classItem); // Set the current class details
    setIsSettingsModalVisible(true); // Show the modal
  };
  
  const closeSettingsModal = () => {
    setIsSettingsModalVisible(false); // Hide the modal
  };
  
  const saveClassSettings = (updatedDetails) => {
    // Update the class details in your state
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === updatedDetails.id ? { ...cls, ...updatedDetails } : cls
      )
    );
    closeSettingsModal();
  };
  const handleDelete = async (classId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/");
      }
  
      // Call the delete endpoint
      const response = await fetch(`${API_URL}/classes/user/delete_class/${classId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al eliminar la clase: ${errorMessage}`);
      }
  
      // Update the state to remove the class
      setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== classId));
      setDeleteModalVisible(false); // Close the modal
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al eliminar la clase.");
    }
  };



// load modal

const handleAddClass = async () => {
  if (!isTeacher || newClassName.trim() === "") {
    alert("Por favor, ingresa un nombre para la clase.");
    return;
  }

  // Check if the class name already exists
  const classExists = classes.some((cls) => cls.name.toLowerCase() === newClassName.trim().toLowerCase());
  if (classExists) {
    alert("Una clase con este nombre ya existe. Por favor, elige otro nombre.");
    return;
  }

  const newClass = {
    name: newClassName,
    description: "", // Cambia si tienes un campo de descripción
  };

  const createdClass = await createClassInDatabase(newClass);

  if (createdClass) {
    // Actualiza el estado local con la nueva clase
    setClasses([...classes, { id: createdClass.id, name: newClassName }]); // Use the ID from the backend response
    setShowModal(false); // Cierra el modal
    setNewClassName(""); // Limpia el input
  } else {
    alert("Error al crear la clase. Por favor, inténtalo de nuevo.");
  }
};


  const handleCancel = () => {
    setShowModal(false);
    setNewClassName("");
  };
  // load a teacher/student class
  const fetchUserClasses = async () => {
    if (!userId) {
      console.error("User ID not found in token");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/classes/user/classes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener las clases");
      }
  
      const data = await response.json(); // Asegúrate de que la respuesta sea un array de clases
      setClasses(data); // Actualiza el estado con las clases obtenidas
    } catch (error) {
      console.error("Error al cargar las clases:", error.message);
    }
  };

  // Llamar a `fetchUserClasses` cuando el componente se monta
  useEffect(() => {
    fetchUserClasses();
  }, []);
  const createClassInDatabase = async (newClass) => {
    try {
      // Get the token from localStorage (or any secure storage mechanism you're using)
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/");
      }
  
      // Make the API call to create a new class
      const response = await fetch(`${API_URL}/classes/user/create_class`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
        body: JSON.stringify(newClass),
      });
  
      // Check if the response is not OK
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the server error message
        throw new Error(`Error al guardar la clase en la base de datos: ${errorMessage}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
      console.log("Clase creada en la base de datos:", data);
  
      return data; // Return the created class data
    } catch (error) {
      console.error("Error:", error);
      return null; // Return null in case of an error
    }
  };

 // classmenu
const handleOpenClass = (classId) => {
    navigate(`/class/${classId}`);
};
  

  return (
    <div className="h-screen bg-gray-100">
      {/* Top Menu */}
      <TopMenu
        userInitial={userInitial}
        isSidebarOpen={isSidebarOpen}
        state = {"in_dashboard"}
        classId={null}
        setIsSidebarOpen={setIsSidebarOpen}
        setShowModal={setShowModal}
      />
      

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} currentPage={"Home"} />
        {/* Floating Menu */}

        {/* Renderizar clases */}
        <div
          className={`flex-grow p-6 mt-4 bg-gray-100 overflow-auto transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{classItem.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md light:bg-gray-700 light:text-blue-400 border border-blue-100 light:border-blue-500">
                      Nuevo
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md light:bg-gray-700 light:text-green-400 border border-green-100 light:border-green-500">
                      10 aprueban
                    </span>
                    <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md light:bg-gray-700 light:text-red-400 border border-red-100 light:border-red-500">
                      10 suspenden
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-100 px-4 py-2">
                    <button onClick={() => handleOpenClass(classItem.id)} className="text-blue-500 hover:underline">Abrir</button>
                    <div className="flex justify-between">
                    <button onClick={() => {
                      setDeleteModalVisible(true)
                      setCurrentClassDetails(classItem);
                    }} 
                      className="material-icons text-gray-400 hover:text-red-400 hover:bg-gray-200 rounded-full p-1">delete</button>
                    <button className="material-icons text-gray-400 hover:text-blue-400 hover:bg-gray-200 rounded-full p-1"
                      onClick={() => {
                        setCurrentClassDetails(classItem);
                        setIsSettingsModalVisible(true);
                      }}>
                        settings
                    </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tienes clases asignadas.</p>
            )}
          </div>
        </div>
      </div>
{/* delete modal */}
        <DeleteModal
        isVisible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => handleDelete(currentClassDetails.id)}
        />      
        {/* settings modal */}
        <SettingsModal
          isVisible={isSettingsModalVisible}
          onClose={closeSettingsModal}
          onSave={saveClassSettings}
          classDetails={currentClassDetails}
        />
        {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Crear nueva clase</h2>
            <div className="mb-4">
              <label htmlFor="className" className="block text-gray-700 font-medium">
                Nombre de la clase
              </label>
              <input
                type="text"
                id="className"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Ej. Matemáticas 2º ESO"
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
                onClick={handleAddClass}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
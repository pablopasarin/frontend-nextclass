import React, { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "react-apexcharts";
import { evaluate } from "mathjs"; // Install mathjs for safe formula evaluation
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
  } from "chart.js";
import { Carousel } from "flowbite-react";
import { AcademicCapIcon, FlagIcon, CalendarIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import * as XLSX from "xlsx";

 
const BadgeCollection = () => {
  const badges = [
    { name: "Mount Everest", icon: <FlagIcon className="w-8 h-8 text-blue-500" /> },
    { name: "Watchtower", icon: <ShieldCheckIcon className="w-8 h-8 text-purple-500" /> },
    { name: "7-Day Stretch", icon: <CalendarIcon className="w-8 h-8 text-green-500" /> },
    { name: "Weekend Warrior", icon: <AcademicCapIcon className="w-8 h-8 text-red-500" /> },
  ];

  const slides = [

<div className="flex h-full items-center justify-center bg-white dark:bg-gray-700 dark:text-white">
      <div className="grid grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {badge.icon}
            </div>
            <span className="text-sm mt-2">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>,
    <div className="flex h-full items-center justify-center bg-white dark:bg-gray-700 dark:text-white">
      Slide 2
    </div>,
    <div className="flex h-full items-center justify-center bg-white dark:bg-gray-700 dark:text-white">
      Slide 3
    </div>,
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  return (

    <div className="relative w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 z-0">
    {/* Carousel Wrapper */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${
              index === activeIndex ? "block" : "hidden"
            } duration-700 ease-in-out`}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Custom Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            type="button"
            className={`w-3 h-3 rounded-full ${
              activeIndex === index ? "bg-orange-500" : "bg-gray-300"
            }`}
            aria-label={`Slide ${index + 1}`}
            aria-current={activeIndex === index}
          ></button>
        ))}
      </div>
    </div>
  );
};

const RadarChart = ({ statistics, data }) => {
  console.log("categoryData", data);
  console.log("statistics", statistics);

  // Normaliza las claves en statistics para garantizar coincidencias
  const normalizeKey = (key) => key.toLowerCase();

  const maxValues = Object.entries(statistics.categoryMinMax).reduce(
    (acc, [key, value]) => {
      acc[normalizeKey(key)] = value;
      return acc;
    },
    {}
  );

  // Calcular los porcentajes respecto al valor máximo en cada categoría
  const seriesData = data.map((entry) => {
    const normalizedCategory = normalizeKey(entry.category); // Normalizar la categoría
    const maxForCategory = maxValues[normalizedCategory]?.max ?? 1; // Evitar divisiones por 0
    const grade = entry.grade ?? 0;
    return (grade / maxForCategory) * 100; // Calcula el porcentaje
  });

  // Mapear categorías a números
  const categoryMapping = data.map((entry, index) => ({
    number: index + 1,
    category: entry.category,
  }));

  const categoryLabels = categoryMapping.map((entry) => entry.number); // Números como etiquetas

  const options = {
    chart: {
      type: "radar",
      toolbar: {
        show: false, // Ocultar barra de herramientas
      },
    },
    stroke: {
      width: 2, // Grosor de la línea
    },
    fill: {
      opacity: 0.3, // Opacidad de las áreas
    },
    tooltip: {
      shared: true, // Tooltip para múltiples series
      intersect: false,
    },
    xaxis: {
      categories: categoryLabels, // Etiquetas como números
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 400,
          colors: ["#333"], // Color de los labels
        },
      },
    },
    yaxis: {
      show: true, // Mostrar el eje Y
      tickAmount: 4,
      min: 0,
      max: 100, // Máximo valor
    },
  };

  const series = [
    {
      name: "Porcentaje respecto al máximo", // Nombre de la serie
      data: seriesData, // Porcentajes respecto al máximo
    },
  ];

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      {/* Leyenda personalizada */}
        <div className=" grid grid-cols-2 gap-4 text-black">
          <ul className="list-none text-sm ">
            {categoryMapping
              .slice(0, Math.ceil(categoryMapping.length / 2))
              .map((entry) => (
                <li key={entry.number} className="flex items-center">
                  <span className="mr-2 font-bold">{entry.number}:</span> {entry.category}
                </li>
              ))}
          </ul>
          <ul className="list-none text-sm">
            {categoryMapping
              .slice(Math.ceil(categoryMapping.length / 2))
              .map((entry) => (
                <li key={entry.number} className="flex items-center">
                  <span className="mr-2 font-bold">{entry.number}:</span> {entry.category}
                </li>
              ))}
          </ul>
        </div>
      
      <Chart
        options={options}
        series={series}
        type="radar"
        height={350} // Ajusta la altura al diseño
      />

    </div>
  );
};

const MultiChart = ({ categoryChartData, compositePercentages }) => {
  // Configuración del gráfico
  const options = {
    yaxis: {
      show: true, // Mostrar eje Y
      labels: {
        show: false,
        formatter: function (value) {
          return value; // Ajustar formato según necesidades
        },
      },
    },
    chart: {
      height: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2, // Ajusta el grosor de las líneas
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -26,
      },
    },
    xaxis: {
      categories: [], // Este será dinámico
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
  };

  // Transformar y sanitizar los datos de categoryChartData
  const safeCategoryChartData = Object.entries(categoryChartData || {}).reduce(
    (acc, [category, dataPoints]) => {
      // Asegúrate de que los datos estén ordenados y reemplaza nulos por 0
      acc[category] = (dataPoints || []).map((point) => ({
        date: point.date || "Sin fecha", // Fecha predeterminada
        value: point.value ?? 0, // Reemplaza null o undefined por 0
      })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordena por fecha
      return acc;
    },
    {}
  );

  // Si no hay datos, crear una categoría predeterminada con valores de 0
  if (Object.keys(safeCategoryChartData).length === 0) {
    safeCategoryChartData["Default"] = [{ date: "Sin fecha", value: 0 }];
  }

  // Crear las series para el gráfico
  const series = Object.entries(safeCategoryChartData).map(([category, dataPoints]) => ({
    name: category,
    data: dataPoints.map((point) => point.value),
  }));

  // Ajustar las categorías en el eje X según las fechas ordenadas en los datos
  options.xaxis.categories = safeCategoryChartData[Object.keys(safeCategoryChartData)[0]].map(
    (point) => point.date
  );

  // Calcular el cambio porcentual total
  const totalPercentageChange = (compositePercentages || []).reduce((acc, item) => {
    return acc + parseFloat(item.percentage_change || 0);
  }, 0);

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            Progreso
          </h5>
        </div>
        <div
          className={`flex items-center px-2.5 py-0.5 text-base font-semibold text-center ${
            totalPercentageChange > 0
              ? "text-green-500"
              : totalPercentageChange < 0
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {totalPercentageChange}%
          <svg
            className="w-3 h-3 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                totalPercentageChange > 0
                  ? "M5 13V1m0 0L1 5m4-4 4 4" // Flecha hacia arriba
                  : totalPercentageChange < 0
                  ? "M5 1v12m0 0L9 9m-4 4L1 9" // Flecha hacia abajo
                  : "M1 7h8" // Línea horizontal para el caso 0
              }
            />
          </svg>
        </div>
      </div>
      <div>
        <Chart
          options={options}
          series={series}
          type="area"
          height={250}
          width={300}
        />
      </div>
    </div>
  );
};
  //for row charts
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);


const DynamicColumn = ({ label,colDef, students, filters, setFilters, handleSort, setDynamicColumnValues }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [formula, setFormula] = useState(filters[colDef.key]?.formula || "");
    const [rangeFilter, setRangeFilter] = useState({
      from: filters[colDef.key]?.range?.from || "",
      to: filters[colDef.key]?.range?.to || "",
    });
    const dropdownRef = useRef(null);
  
    // Toggle dropdown visibility
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
  
    // Compute values based on the formula
    const computeValues = () => {
      try {
        console.log("Formula input:", formula);
    
        const computedValues = students.map((student) => {
          // Normalizar los datos del estudiante
          const studentData = Object.keys(student).reduce((acc, key) => {
            acc[key] = student[key] ?? 0; // Si es null o undefined, usa 0
            return acc;
          }, {});
    
          // Aplanar las categorías de `grades` en `studentData`
          student.grades.forEach((grade) => {
            const normalizedCategory = grade.category.replace(/ /g, "_"); // Normalizar el nombre de la categoría
            studentData[normalizedCategory] = grade.grade ?? 0; // Asignar el valor de la nota o 0 si es null/undefined
          });
    
          console.log("Normalized student data:", studentData);
    
          // Generar y ejecutar la función dinámica
          const funcCode = `with (student) { return ${formula}; }`;
          console.log("Generated function code:", funcCode);
    
          const func = new Function("student", funcCode);
    
          try {
            const result = func(studentData);
            console.log("Computed value for student:", result);
            return result;
          } catch (error) {
            console.error("Error evaluating formula for student:", student, error);
            return "Error"; // Valor por defecto en caso de error
          }
        });
    
        console.log("Final computed values:", computedValues);
    
        setDynamicColumnValues(computedValues); // Actualiza el estado en el componente padre
      } catch (error) {
        console.error("Unexpected error during computation:", error);
      }
    };
  
    // Apply the filter
    const applyFilter = () => {
      const { from, to } = rangeFilter;
  
      // Compute values based on the formula
      computeValues();
  
      // Update filters in parent
      setFilters((prev) => ({
        ...prev,
        [colDef.key]: {
          formula: formula || "",
          range: {
            from: from || null,
            to: to || null,
          },
        },
      }));
  
      setIsDropdownOpen(false);
    };
  
    // Handle range input changes
    const handleRangeChange = (e) => {
      const { name, value } = e.target;
      setRangeFilter((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : "",
      }));
    };
  
    useEffect(() => {
      if (isDropdownOpen) {
        document.addEventListener("mousedown", closeDropdown);
      } else {
        document.removeEventListener("mousedown", closeDropdown);
      }
  
      return () => {
        document.removeEventListener("mousedown", closeDropdown);
      };
    }, [isDropdownOpen]);
  
    return (
      <th className="px-4 py-3 relative z-50">
        <div className="flex justify-between items-center">
          {label}
          <div className="relative flex items-center">
            {/* Sort Button */}
            <button
              onClick={() => handleSort(colDef.key)}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <svg
                className={`w-4 h-4 transition-transform`}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
              </svg>
            </button>
  
            {/* Dropdown Button */}
            <button onClick={toggleDropdown} className="text-gray-600 hover:text-gray-900 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M6 12h12m-9 6h6" />
              </svg>
            </button>
  
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute font-normal left-0 top-6 bg-white border rounded-lg shadow-lg mt-1 p-3 w-64 z-50"
              >
                {/* Formula Input */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Formula:
                  </label>
                  <input
                    type="text"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    placeholder="e.g., comportamiento + participacion"
                    className="block w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
  
                {/* Range Filters */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    From:
                  </label>
                  <input
                    type="number"
                    name="from"
                    value={rangeFilter.from}
                    onChange={handleRangeChange}
                    placeholder="Min value"
                    className="block w-full p-2 mb-2 border border-gray-300 rounded-md text-gray-900"
                  />
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    To:
                  </label>
                  <input
                    type="number"
                    name="to"
                    value={rangeFilter.to}
                    onChange={handleRangeChange}
                    placeholder="Max value"
                    className="block w-full p-2 mb-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
  
                {/* Apply Filter Button */}
                <button
                  onClick={applyFilter}
                  className="block w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      </th>
    );
  };


const IntegerColumn = ({ label,colDef, filters, setFilters, sortConfig, handleSort, updateFilter }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [rangeFilter, setRangeFilter] = useState({
      from: filters[colDef.key]?.from || "",
      to: filters[colDef.key]?.to || "",
    });
  
    // Handle range filter changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      const updatedRange = { ...rangeFilter, [name]: value ? parseFloat(value) : "" };
      setRangeFilter(updatedRange);
    };
  
    // Apply the range filter
// Apply the range filter
const applyFilter = () => {
    // Call updateFilter to notify the parent of the updated filter
    const { from, to } = rangeFilter;

    // If no value is provided, remove the filter
    if (from === "" && to === "") {
      updateFilter(colDef.key, null); // Remove the filter for this column
    } else {
      updateFilter(colDef.key, { from: from || null, to: to || null }); // Apply the filter
    }

    setIsDropdownOpen(false);
  };
  
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
  
    useEffect(() => {
      if (isDropdownOpen) {
        document.addEventListener("mousedown", closeDropdown);
      } else {
        document.removeEventListener("mousedown", closeDropdown);
      }
  
      return () => {
        document.removeEventListener("mousedown", closeDropdown);
      };
    }, [isDropdownOpen]);
return (
<th className="px-4 py-3 relative">
      <div className="flex justify-between items-center">
        {label}
        <div className="relative flex items-center">
          {/* Sort Button */}
          <button
            onClick={() => handleSort(colDef.key)}
            className="text-gray-600 hover:text-gray-900 p-1"
          >
            <svg
              className={`w-4 h-4 ${
                sortConfig.key === colDef.key && sortConfig.direction === "desc"
                  ? "rotate-180"
                  : ""
              } transition-transform`}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
            </svg>
          </button>

          {/* Dropdown Button */}
          <button onClick={toggleDropdown} className="text-gray-600 hover:text-gray-900 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M6 12h12m-9 6h6" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute font-normal left-0 top-6 bg-white border rounded-lg shadow-lg mt-1 p-3 w-64 z-50"
            >
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  From:
                </label>
                <input
                  type="number"
                  name="from"
                  value={rangeFilter.from}
                  onChange={handleInputChange}
                  placeholder="Min value"
                  className="block w-full p-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  To:
                </label>
                <input
                  type="number"
                  name="to"
                  value={rangeFilter.to}
                  onChange={handleInputChange}
                  placeholder="Max value"
                  className="block w-full p-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <button
                onClick={applyFilter}
                className="block w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </th>
);
};


const StringColumn = ({ label,colDef, students, filters, setFilters, sortConfig, handleSort }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamically handle checkbox changes based on colDef.key
  const handleCheckboxChange = (value) => {
    setFilters((prev) => {
      const currentFilter = prev[colDef.key] || [];
      const isSelected = currentFilter.includes(value);

      if (isSelected) {
        return {
          ...prev,
          [colDef.key]: currentFilter.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [colDef.key]: [...currentFilter, value],
        };
      }
    });
  };

  const handleSelectAll = () => {
    const currentFilter = filters[colDef.key] || [];
    const filteredOptions = getFilteredOptions();

    if (currentFilter.length === filteredOptions.length) {
      setFilters((prev) => ({
        ...prev,
        [colDef.key]: [],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [colDef.key]: [...filteredOptions],
      }));
    }
  };

  const getFilteredOptions = () => {
    return [...new Set(students.map((student) => student.name))].filter((option) =>
      option.toLowerCase().includes(searchQuery)
    );
  };

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", closeDropdown);
    } else {
      document.removeEventListener("mousedown", closeDropdown);
    }

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, [isDropdownOpen]);

  const filteredOptions = getFilteredOptions();

  return (
    <th className="px-4 py-3 relative">
      <div className="flex justify-between items-center">
        {label}
        <div className="relative flex items-center">
          {/* Sort Button */}
          <button
            onClick={() => handleSort(colDef.key)}
            className="text-gray-600 hover:text-gray-900 p-1"
          >
            <svg
              className={`w-4 h-4 ${
                sortConfig.key === colDef.key && sortConfig.direction === "desc"
                  ? "rotate-180"
                  : ""
              } transition-transform`}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
            </svg>
          </button>

          {/* Dropdown Button */}
          <button onClick={toggleDropdown} className="text-gray-600 hover:text-gray-900 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M6 12h12m-9 6h6" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute font-normal left-0 top-6 bg-white border rounded-lg shadow-lg mt-1 p-3 w-64 z-50"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="block w-full p-2 mb-2 border border-gray-300 rounded-md text-gray-900"
              />
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="select_all"
                  checked={filters[colDef.key]?.length === filteredOptions.length}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <label htmlFor="select_all" className="text-gray-700">
                  Select All
                </label>
              </div>
              <div className="max-h-40">
                {filteredOptions.map((option) => (
                  <div key={option} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={option}
                      checked={filters[colDef.key]?.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="mr-2"
                    />
                    <label htmlFor={option} className="text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </th>
  );
};

const transformChartData = (chartData) => {
  return {
    labels: chartData.map((entry) => entry.date), // Fechas como etiquetas en el eje X
    datasets: [
      {
        label: "Total por fecha", // Nombre del dataset
        data: chartData.map((entry) => entry.total), // Valores en el eje Y
        borderColor: "#60a5fa", // Color de la línea
        backgroundColor: "rgba(96, 165, 250, 0.2)", // Relleno debajo de la línea
        borderWidth: 2,
        pointRadius: 0, // Sin puntos
        tension: 0.3, // Curvas suaves
      },
    ],
  };
};

const chartConfig = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: { display: false }, // Hide X-axis
      y: { display: false }, // Hide Y-axis
    },
    plugins: {
      legend: { display: false }, // Hide legend
      tooltip: { enabled: true, }, // Disable tooltips
    },
  };



const ObjectColumn = ({label, colDef, filters, setFilters, students, sortConfig, handleSort }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [rangeFilter, setRangeFilter] = useState({
      from: filters[colDef.key]?.range?.from || "",
      to: filters[colDef.key]?.range?.to || "",
    });
    const [selectedKeys, setSelectedKeys] = useState(filters[colDef.key]?.keys || []);
    const dropdownRef = useRef(null);
  
    // Extract unique keys from the objects in the column
    const objectKeys = [
      ...new Set(students.flatMap((student) => Object.keys(student[colDef.key] || {}))),
    ];
  
    // Filter keys based on the search query
    const filteredKeys = objectKeys.filter((key) =>
      key.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Toggle dropdown visibility
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
  
    // Handle range input changes
    const handleRangeChange = (e) => {
      const { name, value } = e.target;

      setRangeFilter((prev) => ({
        ...prev,
        [name]: value === "" ? null : parseFloat(value), // Asegúrate de que "0" no se convierte en null
      }));
    };
  
    // Handle checkbox selection for object keys
    const handleCheckboxChange = (key) => {
      const newSelectedKeys = selectedKeys.includes(key)
        ? selectedKeys.filter((selectedKey) => selectedKey !== key)
        : [...selectedKeys, key];
      setSelectedKeys(newSelectedKeys);
    };

    const applyFilter = () => {
      const { from, to } = rangeFilter;
    
      if (!objectKeys.length) {
        setFilters((prev) => ({
          ...prev,
          [colDef.key]: {
            keys: [],
            range: { from: from !== "" ? from : null, to: to !== "" ? to : null }          },
        }));
      } else if (selectedKeys.length > 0) {
        setFilters((prev) => ({
          ...prev,
          [colDef.key]: {
            keys: selectedKeys,
            range: { from: from !== "" ? from : null, to: to !== "" ? to : null }          },
        }));
      } else {
        setFilters((prev) => {
          const { [colDef.key]: _, ...remainingFilters } = prev;
          return remainingFilters;
        });
      }
    
      setIsDropdownOpen(false);
    };
    useEffect(() => {
      if (isDropdownOpen) {
        document.addEventListener("mousedown", closeDropdown);
      } else {
        document.removeEventListener("mousedown", closeDropdown);
      }
  
      return () => {
        document.removeEventListener("mousedown", closeDropdown);
      };
    }, [isDropdownOpen]);
  
    return (
      <th className="px-4 py-3 relative z-50">
        <div className="flex justify-between items-center">
          {label}
          <div className="relative flex items-center">
            {/* Sort Button */}
            <button
              onClick={() => handleSort(colDef.key)}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <svg
                className={`w-4 h-4 ${
                  sortConfig.key === colDef.key && sortConfig.direction === "desc"
                    ? "rotate-180"
                    : ""
                } transition-transform`}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
              </svg>
            </button>
  
            {/* Dropdown Button */}
            <button onClick={toggleDropdown} className="text-gray-600 hover:text-gray-900 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M6 12h12m-9 6h6" />
              </svg>
            </button>
  
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute font-normal left-0 top-6 bg-white border rounded-lg shadow-lg mt-1 p-3 w-64 z-50"
              >
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search keys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full p-2 mb-2 border border-gray-300 rounded-md text-gray-900"
                />
  
                {/* Checkbox List for Object Keys */}
                <div className="max-h-40 overflow-y-auto">
                  {filteredKeys.map((key) => (
                    <div key={key} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={key}
                        checked={selectedKeys.includes(key)}
                        onChange={() => handleCheckboxChange(key)}
                        className="mr-2 text-gray-900"
                      />
                      <label htmlFor={key} className="text-gray-700">
                        {key}
                      </label>
                    </div>
                  ))}
                </div>
  
                {/* Range Filters */}
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">From:</label>
                  <input
                    type="number"
                    name="from"
                    value={rangeFilter.from}
                    onChange={handleRangeChange}
                    placeholder="Min value"
                    className="block w-full p-2 mb-2 border border-gray-300 rounded-md text-gray-900"
                  />
                  <label className="block text-gray-700 text-sm font-medium mb-1">To:</label>
                  <input
                    type="number"
                    name="to"
                    value={rangeFilter.to}
                    onChange={handleRangeChange}
                    placeholder="Max value"
                    className="block w-full p-2 mb-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
  
                {/* Apply Filter Button */}
                <button
                  onClick={applyFilter}
                  className="block w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      </th>
    );
  };

const exportToExcel = (data, columns, filename) => {
    const formattedData = data.map((student) => {
      const result = { "Alumno": student.name }; // Agregar el nombre del estudiante
      columns.forEach((col) => {
        if (col.type === "ObjectColumn") {
          result[col.label] =
            student[col.key] !== undefined ? student[col.key] : "-";
        } else if (col.type === "DynamicColumn") {
          result[col.label] = student[col.key] || "-";
        } else {
          result[col.label] = student[col.key] !== undefined ? student[col.key] : "-";
        }
      });
      return result;
    });
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };
const StudentTable = ({students, categories}) => {

    const [expandedRow, setExpandedRow] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: "alumno", direction: "asc" });
    const [dynamicColumnValues, setDynamicColumnValues] = useState([]);


    const dynamicCols = categories.map((category) => ({
      id: category.id,
      type: "ObjectColumn",
      key: category.name.toLowerCase().replace(/ /g, "_"), // Crear una key basada en el nombre de la categoría
      label: category.name,
    }));
    const baseColsDef = [
      { id: 1, type: "StringColumn", key: "name", label: "Alumno" },
      { id: 2, type: "ChartColumn", key: "puntuacion", label: "Puntuación" },
      { id: 3, type: "DynamicColumn", key: "formula", label: "Fórmula" },
    ];
  
    // Combinar columnas base con las columnas dinámicas
    const colsDef = [...baseColsDef, ...dynamicCols];

 
    const initialFilters = colsDef.reduce((acc, col) => {
        if (col.type === "StringColumn") {
          acc[col.key] = []; // Array for multiple string filters
        } else if (col.type === "IntegerColumn") {
          acc[col.key] = { from: null, to: null }; // Object for numeric range filters
        }
        return acc;
      }, {});
      
    const [filters, setFilters] = useState(initialFilters);



const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

 const handleSort = (key) => {
  setSortConfig((prev) => ({
    key,
    direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
  }));
};

const normalizeKey = (name) => name.toLowerCase().replace(/ /g, "_");

const transformedStudents = students.map((student) => {
  const categoryData = categories.reduce((acc, category) => {
    const categoryKey = normalizeKey(category.name);
    acc[categoryKey] =
      student.grades.find((grade) => grade.category === category.name)?.grade ?? null;
    return acc;
  }, {});

  const dateCategoryLastScores = {};
  const dateCategoryScores = {};
  student.grade_history.forEach((entry) => {
    const date = new Date(entry.timestamp).toISOString().split("T")[0]; // Usar solo la fecha
    const category = entry.category; // Usar la categoría para identificar

    if (!dateCategoryLastScores[date]) {
      dateCategoryLastScores[date] = {};
    }
    if (!dateCategoryScores[date]) {
      dateCategoryScores[date] = {};
    }
    if (!dateCategoryScores[date][category]) {
      dateCategoryScores[date][category] = []; // Inicializa como un array
    }

    // Agrega la entrada actual al array de la categoría
    dateCategoryScores[date][category].push(entry);

    // Si ya existe un registro para esta categoría en esta fecha, verifica el más reciente
    if (
      !dateCategoryLastScores[date][category] ||
      new Date(entry.timestamp) > new Date(dateCategoryLastScores[date][category].timestamp)
    ) {
      dateCategoryLastScores[date][category] = entry;
    }
  });

  // Sumar las puntuaciones más recientes por categoría para cada fecha
  const dateScores = Object.entries(dateCategoryLastScores).reduce((acc, [date, categories]) => {
    acc[date] = Object.values(categories).reduce((total, categoryEntry) => {
      return total + (categoryEntry.current_grade ?? 0);
    }, 0);
    return acc;
  }, {});

  // Crear un nuevo chartData agrupado por categoría
  const categoryChartData = Object.entries(dateCategoryScores).reduce((acc, [date, categories]) => {
    Object.entries(categories).forEach(([category, entries]) => {
      if (!acc[category]) {
        acc[category] = [];
      }

      // Agregar un punto para la categoría y la fecha
      const latestEntry = entries.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
      );

      acc[category].push({
        date,
        value: latestEntry.current_grade ?? 0,
      });
    });

    return acc;
  }, {});

  // Convertir dateScores a un array de objetos ordenados por fecha
  const chartData = Object.entries(dateScores)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // compositepercentage
  const calculateCompositePercentage = (filterType) => {
    const now = new Date();
    let startDate;

    if (filterType === "1D") {
      startDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    } else if (filterType === "1S") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (filterType === "1M") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (filterType === "1T") {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (filterType === "Máx") {
      startDate = new Date(0);
    }

    const filteredEntries = Object.entries(dateCategoryScores)
      .filter(([date]) => new Date(date) >= startDate)
      .flatMap(([_, categories]) => Object.values(categories));
    console.log("filteredEntries", filteredEntries);

    const categoryCompositeValues = {};
    const flattenedEntries = filteredEntries.flat();

    flattenedEntries.forEach((entry) => {
      const { category, percentage_change } = entry;

      if (!categoryCompositeValues[category]) {
        categoryCompositeValues[category] = 1;
      }

      if (percentage_change >= 0) {
        categoryCompositeValues[category] *= 1 + percentage_change / 100;
      } else {
        categoryCompositeValues[category] *= 1 - Math.abs(percentage_change) / 100;
      }
    });
    console.log("categoryCompositeValues", categoryCompositeValues);
    // Convertir los valores compuestos en porcentajes y estructurarlos en un array
    return Object.entries(categoryCompositeValues).map(([category, value]) => ({
      category,
      percentage_change: ((value - 1) * 100).toFixed(2),
    }));
  };

  const compositePercentages = {
    "1D": calculateCompositePercentage("1D"),
    "1S": calculateCompositePercentage("1S"),
    "1M": calculateCompositePercentage("1M"),
    "1T": calculateCompositePercentage("1T"),
    "Máx": calculateCompositePercentage("Máx"),
  };
  return { ...student, ...categoryData, chartData, categoryChartData, compositePercentages };
});
const calculateCategoryStatistics = (students) => {
  const categoryTotals = {}; // Suma de las notas por categoría
  const categoryMinMax = {}; // Mínima y máxima por categoría
  let totalSum = 0; // Suma total de todas las categorías

  students.forEach((student) => {
    Object.entries(student).forEach(([key, value]) => {
      // Ignorar claves que no son categorías
      if (typeof value === "number" || value === null || value === undefined) {
        const normalizedValue = value ?? 0; // Convertir `null` o `undefined` en 0

        // Sumar notas por categoría
        if (!categoryTotals[key]) {
          categoryTotals[key] = 0;
        }
        categoryTotals[key] += normalizedValue;

        // Calcular el mínimo y máximo por categoría
        if (!categoryMinMax[key]) {
          categoryMinMax[key] = { min: normalizedValue, max: normalizedValue };
        } else {
          categoryMinMax[key].min = Math.min(categoryMinMax[key].min, normalizedValue);
          categoryMinMax[key].max = Math.max(categoryMinMax[key].max, normalizedValue);
        }

        // Sumar al total general
        totalSum += normalizedValue;
      }
    });
  });

  return {
    categoryTotals,
    totalSum,
    categoryMinMax,
  };
};

// Usar la función con `transformedStudents`
const statistics = calculateCategoryStatistics(transformedStudents);

const filteredStudents = transformedStudents
  .filter((student, index) => {
    return colsDef.every((col) => {
      const filter = filters[col.key];
      const value =
        col.type === "DynamicColumn" && Array.isArray(dynamicColumnValues)
          ? dynamicColumnValues[index] // Use computed dynamic values
          : student[col.key];

      if (col.type === "StringColumn") {
        // For StringColumn, check if the value matches any selected filter
        return !filter || filter.length === 0 || filter.includes(value);
      } else if (col.type === "IntegerColumn") {
        // For IntegerColumn, check if the value falls within the range
        if (!filter) return true; // No filter applied for this column
        const { from, to } = filter;
        return (
          (from === null || value >= from) &&
          (to === null || value <= to)
        );
      } else if (col.type === "ObjectColumn") {
        // For ObjectColumn, check keys and range
        if (!filter) return true; // No filter applied
        const { keys, range } = filter || {};
        const { from, to } = filter?.range || {};
        console.log("Filter keys:", keys, "Range:", range, "Value:", value);

        // Si no hay claves seleccionadas, aplica solo el rango
        if (!keys || keys.length === 0) {
          return (
            value !== null &&
            value !== undefined &&
            (from === null || value >= from) &&
            (to === null || value <= to)
          );
        }
      
        // Si hay claves seleccionadas, verifica que al menos una cumpla el rango
        return keys.some((key) => {
          const keyValue = value?.[key];
          console.log("Key:", key, "Value:", keyValue);
          // Validar que el valor no sea nulo, indefinido o negativo antes de aplicar el rango
          if (keyValue === undefined || keyValue === null || keyValue < 0) {
              return false;
          }
          
          return (
              (from === null || keyValue >= from) &&
              (to === null || keyValue <= to)
          );
      });
      } else if (col.type === "DynamicColumn") {
        // For DynamicColumn, check if the computed value falls within the range
        if (!filter || !filter.range) return true; // No filter applied
        const { from, to } = filter.range;
        return (
          (from === null || value >= from) &&
          (to === null || value <= to)
        );
      }

      // Default: pass through for unsupported column types
      return true;
    });
  })
  .sort((a, b) => {
    if (!sortConfig || !sortConfig.key) return 0; // No sorting applied
  
    const col = colsDef.find((col) => col.key === sortConfig.key);
    if (!col) return 0;
    const multiplier = sortConfig.direction === "asc" ? 1 : -1;
  
    // Obtener los valores a comparar para `a` y `b`
    const aValue =
      col.type === "DynamicColumn" && Array.isArray(dynamicColumnValues)
        ? dynamicColumnValues[transformedStudents.indexOf(a)] // Computed dynamic values
        : a[sortConfig.key] ?? null; // Handle undefined or null values
    const bValue =
      col.type === "DynamicColumn" && Array.isArray(dynamicColumnValues)
        ? dynamicColumnValues[transformedStudents.indexOf(b)] // Computed dynamic values
        : b[sortConfig.key] ?? null; // Handle undefined or null values
  
    if (col.type === "StringColumn") {
      // Sort by string values
      if (aValue === null || bValue === null) return 0; // Avoid errors on null values
      return aValue.localeCompare(bValue) * multiplier;
    } else if (col.type === "IntegerColumn" || col.type === "DynamicColumn") {
      // Sort by numeric values
      const numA = aValue ?? 0; // Treat null/undefined as 0
      const numB = bValue ?? 0; // Treat null/undefined as 0
      return (numA - numB) * multiplier;
    } else if (col.type === "ObjectColumn") {
      const keys = filters[col.key]?.keys ?? [];

      if (keys.length === 0) {
        // If no keys are selected, sort by the main value
        return (aValue - bValue) * multiplier;
      }

      // Otherwise, sort using the first selected key
      const selectedKey = keys[0];
      const aObjValue = aValue?.[selectedKey] ?? null; // Handle undefined or null
      const bObjValue = bValue?.[selectedKey] ?? null; // Handle undefined or null

      if (aObjValue === null || bObjValue === null) return 0; // Avoid errors
      return (aObjValue - bObjValue) * multiplier; // Numeric comparison
    }

    return 0; // Default for unsupported column types
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => {
      // Check if the value is empty or invalid based on its type
      const shouldRemoveFilter =
        value === null ||
        (Array.isArray(value) && value.length === 0) || // Empty array for StringColumn
        (typeof value === "object" &&
          (!value.from && !value.to)); // No range values for IntegerColumn or ObjectColumn
  
      if (shouldRemoveFilter) {
        // Remove the filter by excluding the key
        const { [key]: _, ...remainingFilters } = prev;
        return remainingFilters;
      }
  
      // Apply the filter
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  const [selected, setSelected] = useState("1D");

  const buttons = ["1D", "1S", "1M", "1T", "Máx"];


  // Actualiza `compositePercentage` automáticamente cuando `selected` es "1D"
  useEffect(() => {
    if (selected === "1D") {
    
    }
  }, [selected]); // Escucha cambios en `selected`
// descarga info
const handleDownload = () => {
  exportToExcel(filteredStudents, colsDef, "Lista_Estudiantes");
};

  return (
    <div className="p-4 bg-gray-100 text-gray-900 min-h-screen ">
      <h1 className="text-2xl font-bold mb-6">Evaluación</h1>
{/* Filters */}
<div className="bg-[#0f0f1f] text-white inline-flex space-x-2 p-2 rounded-t-lg">
      {buttons.map((button) => (
        <button
          key={button}
          onClick={() => setSelected(button)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            selected === button
              ? "bg-white shadow border border-gray-300 text-black"
              : "text-white hover:text-black"
          }`}
        >
          {button}
        </button>
      ))}
    </div>
{/* table */}
      <div className="">
        <table className="bg-white rounded-lg shadow-lg table-auto w-full text-sm text-left text-white ">
          <thead>
            <tr className="bg-dark">
            <th className="px-4 py-3 relative w-1"></th>

               {colsDef.map((col) => {
                  if (col.type === "StringColumn") {
                    return (
                      <StringColumn
                        key={col.id}
                        students={students}
                        colDef={col}
                        sortConfig={sortConfig}
                        handleSort={handleSort}
                        filters={filters}
                        setFilters={setFilters}
                        label={col.label}
                      />
                    );
                  } else if (col.type === "IntegerColumn") {
                    return (
                      <IntegerColumn
                        key={col.id}
                        colDef={col}
                        filters={filters}
                        setFilters={setFilters}
                        sortConfig={sortConfig}
                        handleSort={handleSort}
                        updateFilter={updateFilter}
                        label={col.label}
                      />
                    );
                  } else if (col.type === "ObjectColumn") {
                    return (
                      <ObjectColumn
                        key={col.id}
                        colDef={col}
                        students={students}
                        filters={filters}
                        setFilters={setFilters}
                        sortConfig={sortConfig}
                        handleSort={handleSort}
                        label={col.label}
                      />
                    );
                  } else if (col.type === "ChartColumn") {
                    return (
                      <th key={col.id} className="px-4 py-3">
                        {col.label}
                      </th>
                    );
                  } else if (col.type === "DynamicColumn") {
                    return (
                      <DynamicColumn
                        key={col.id}
                        colDef={col}
                        students={students}
                        filters={filters}
                        setFilters={setFilters}
                        handleSort={handleSort}
                        setDynamicColumnValues={setDynamicColumnValues}
                        label={col.label}
                      />
                    );
                  } else {
                    return (
                      <th key={col.id} className="px-4 py-3">
                        {col.label}
                      </th>
                    );
                  }
                })}

            </tr>
          </thead>
          <tbody> 
            {filteredStudents.map((student, index) => {
                console.log("Rendering student:", student)
                return (
              <React.Fragment key={student.id}>
                <tr className="hover:bg-gray-100">
                  {/* Expand Row Button */}
                  <td className="px-4 py-3 text-black">
                    <button onClick={() => toggleRow(student.id)}>
                      {expandedRow === student.id ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 12.707a1 1 0 011.414 0L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </td>
                 {/* Render columns dynamically */}
                  {colsDef.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.type === "ObjectColumn" ? (
                        // Manejar ObjectColumn específicamente
                        (() => {
                          const gradeEntry = student.grades.find(
                            (grade) => grade?.category.toLowerCase().replace(/ /g, "_") === col.key
                          );
                          if (!gradeEntry) {
                            return <div className="text-sm text-gray-700">-</div>; // Si no hay datos para la columna
                          }
                        
                          if (gradeEntry.subcategories?.length > 0) {
                            // Mostrar subcategorías si existen
                            return gradeEntry.subcategories.map((subcategory, i) => (
                              <div
                                key={i}
                                className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                              >
                                {subcategory.subcategory}: {subcategory.grade ?? "-"}
                              </div>
                            ));
                          } else {

                            const comp = student.compositePercentages[selected].filter(
                              (entry) => entry?.category.toLowerCase().replace(/ /g, "_") === col.key
                            );
                            const percentage_change = comp[0]?.percentage_change;
                            console.log("comp:", comp);
                            return (
                              <div
                                className={`flex items-center justify-center text-sm ${
                                  percentage_change > 0
                                    ? "text-green-500 dark:text-green-400"
                                    : percentage_change < 0
                                    ? "text-red-500 dark:text-red-400"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {/* Triángulo que indica cambio (solo para positivo o negativo) */}
                                {percentage_change !== 0 && percentage_change !== null && percentage_change !== undefined && (
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d={percentage_change > 0 ? "M5 15h10l-5-10z" : "M5 5h10l-5 10z"}
                                    ></path>
                                  </svg>
                                )}

                                {/* Porcentaje de cambio */}
                                <span
                                  className={`text-xs font-medium ${
                                    percentage_change > 0
                                      ? "text-green-500"
                                      : percentage_change < 0
                                      ? "text-red-500"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {percentage_change !== undefined
                                    ? `${percentage_change}%`
                                    : ""}
                                </span>

                                {/* Nota */}
                                <span
                                  className={`ml-2 px-2.5 py-0.5 rounded text-xs font-medium ${
                                    percentage_change > 0
                                      ? "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300"
                                      : percentage_change < 0
                                      ? "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300"
                                      : "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300"
                                  }`}
                                >
                                  {gradeEntry.grade ?? "0"}
                                </span>
                              </div>
                            );
                          }
                        })()
                      ) : col.type === "ChartColumn" ? (
                        <div style={{ width: '100px', height: '30px', overflow: 'hidden' }}>

                        <Line data={transformChartData(student.chartData)} options={chartConfig}
                        />
                       </div>

                      ) : col.type === "StringColumn" ? (
                        <div className="text-sm text-gray-700">{student.name}</div>
                      ) : col.type === "DynamicColumn" ? (
                        // Mostrar el valor calculado o un fallback si no está disponible
                        <div className="text-sm text-gray-700">
                          {dynamicColumnValues[index] !== undefined ? dynamicColumnValues[index] : "-"}
                        </div>
                      ) : (
                        // Fallback genérico para cualquier otro tipo de columna
                        <div className="text-sm text-gray-700">NaN</div>
                      )
          
                    }
                    </td>
                  ))}

                </tr>
                  {/* Expanded row */}
                    {expandedRow === student.id && (
                      <tr>
                        <td colSpan={colsDef.length + 1} className="bg-gray-100 p-4">
                          <div className="flex gap-2 justify-center">
                            <MultiChart categoryChartData={student.categoryChartData} compositePercentages={student.compositePercentages[selected]}/>                            
                            <RadarChart 
                            data = {student.grades}
                            statistics={statistics}
                            />
                            
                            
                            <BadgeCollection />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                  );
                })}

                    {/* old */}
{/*                   <td className="px-4 py-3">
                    <button onClick={() => toggleRow(student.id)}>
                      {expandedRow === student.id ? 
                      
                      (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 12.707a1 1 0 011.414 0L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
             ) : (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>)}

                    </button>
                  </td>
                  <td className="px-4 py-3">{student[col.key]}</td>
                  <td className="px-4 py-3">
                  <div class="flex items-center justify-left text-sm text-green-500 dark:text-green-400">
                    <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                        d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                        ></path>
                    </svg>
                    2.5%
                    <span
                    class="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                    >
                    {student[col.key]}
                    </span>
                    
                    </div>

                    </td>
                  <td className="px-4 py-3">
                  <div class="flex items-center justify-left text-sm text-green-500 dark:text-green-400">
                    <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                        d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                        ></path>
                    </svg>
                    2.5%
                    <span
                    class="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                    >
                    {student.participacion}
                    </span>
                    
                    </div>
                  </td>
                  <td className="px-4 py-3">
                  <div class="flex items-center justify-left text-sm text-green-500 dark:text-green-400">
                    <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                        d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                        ></path>
                    </svg>
                    4.5%
                    <span
                    class="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                    >
                    {student.tareas}
                    </span>
                    
                    </div>
                  </td>
                  <td className="px-4 py-3">
                  <div class="flex items-center justify-left text-sm text-green-500 dark:text-green-400">
                    <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                        d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                        ></path>
                    </svg>
                    2.5%
{/*                         {Object.entries(student.pruebas).map(([key, value], i) => (
                        <span
                            key={i}
                            className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                        >
                            {value}
                        </span>
                        ))} 
                    
                    </div>




                  </td>
                  <td className="px-4 py-3 w-10 ">
                  <div className="flex h-10 w-full ">
                   <Line
                      data={generateChartOptions(student.puntuacion)}
                      options={chartConfig}
                    /> 
                  </div>
                  </td>
                  <td className="px-4 py-3">
                  {dynamicColumnValues[students.findIndex((s) => s.id === student.id)] || "-"}                 </td>
                </tr>
                {expandedRow === student.id && (
                  <tr>
                    <td colSpan={colsDef.length+1} className="bg-gray-100 p-4">
                      <div className="flex gap-2 justify-center">
                      <MultiChart />
                      <RadarChart />  
                      <BadgeCollection />
                      </div>
                      
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}  */}

          </tbody>
        </table>
      </div>
      <button
        onClick={handleDownload}
        className="text-center text-sm text-gray-500 mt-4 block hover:underline"
        >
        Descargar tabla
      </button>
    </div>
  );
};

export default StudentTable;
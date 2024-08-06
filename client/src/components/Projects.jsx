// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { useEffect, useRef, useState } from "react";
// import Title from "./Title";
// import { Box, Button, Typography } from "@mui/material";
// import Link from "@mui/material/Link";

// const Projects = () => {
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const cacheRef = useRef({});
//   const columns = [
//     { field: 'proyecto_id', headerName: 'ID Proyecto', width: 150 },
//     { field: 'nombre_proyecto', headerName: 'Nombre del Proyecto', width: 300 },
//     { field: 'nombre_facultad', headerName: 'Nombre de la Facultad', width: 300 },
//     { field: 'nombre_parroquia', headerName: 'Parroquias', width: 300, renderCell: (params) => (
//         <Box>
//           {params.value.map((parroquia, index) => (
//             <Typography key={index} variant="body2">
//               {parroquia}
//             </Typography>
//           ))}
//         </Box>
//       )
//     },
//     { field: 'nombre_org_res_contraparte', headerName: 'Organización Contraparte', width: 300 },
//     { field: 'responsables_contraparte', headerName: 'Responsables Contraparte', width: 300, renderCell: (params) => (
//         <Box>
//           {params.value.map((responsable, index) => (
//             <Typography key={index} variant="body2">
//               {responsable}
//             </Typography>
//           ))}
//         </Box>
//       )
//     },
//     {
//       field: 'action',
//       headerName: 'Acciones',
//       width: 150,
//       renderCell: (params) => (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleOpenModal(params.row)}
//         >
//           Ver Detalles
//         </Button>
//       ),
//     },
//   ];

//   const handleOpenModal = (row) => {
//     if (cacheRef.current[row.proyecto_id]) {
//       setSelectedProject(cacheRef.current[row.proyecto_id]);
//       setIsModalOpen(true);
//     } else {
//       fetch(`http://localhost:3000/api/projects/all-info/${row.proyecto_id}`)
//         .then((response) => response.json())
//         .then((data) => {
//           cacheRef.current[row.proyecto_id] = data;
//           setSelectedProject(data);
//           setIsModalOpen(true);
//         })
//         .catch((error) =>
//           console.error("Error fetching project details:", error)
//         );
//     }
//   };

//   const handleCloseModal = () => {
//     setSelectedProject({});
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     fetch('http://localhost:3000/api/projects/all')
//       .then(response => response.json())
//       .then(data => {
//         const processedData = data.map((project, index) => {
//           const nombre_facultad = project.carreras_info
//             ? project.carreras_info.map(carrera => carrera.nombre_facultad).join(', ')
//             : '';
//           const nombre_parroquia = project.ubicaciones_info
//             ? project.ubicaciones_info.flatMap(ubicacion =>
//                 ubicacion.parroquias ? ubicacion.parroquias.map(parroquia => parroquia.nombre_parroquia) : []
//               )
//             : [];
//           const nombre_org_res_contraparte = project.org_res_contraparte
//             ? project.org_res_contraparte.map(org => org.nombre).join(', ')
//             : '';
//           const responsables_contraparte = project.org_res_contraparte
//             ? project.org_res_contraparte.flatMap(org =>
//                 org.responsables ? org.responsables.map(responsable => responsable.nombres) : []
//               )
//             : [];

//           return {
//             id: index, // Asignar un id único basado en el índice
//             proyecto_id: project.proyecto_info?.proyecto_id,
//             nombre_proyecto: project.proyecto_info?.nombre_proyecto,
//             nombre_facultad,
//             nombre_parroquia,
//             nombre_org_res_contraparte,
//             responsables_contraparte,
//           };
//         });
//         setProjects(processedData);
//       })
//       .catch(error => console.error('Error fetching projects: ', error));
//   }, []);

//   return (
//     <>
//       <Title>Proyectos</Title>
//       <DataGrid
//         columns={columns}
//         rows={projects}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 10 },
//           },
//         }}
//         pageSizeOptions={[10, 20]}
//         checkboxSelection
//         getRowHeight={() => 'auto'}
//         slots={{ toolbar: GridToolbar }}
//       />
//     </>
//   );
// };

// export default Projects;

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import Title from "./Title";
import { Button, Link } from "@mui/material";
import PropTypes from "prop-types";
import Modal from "../Modal";

// Componente ExpandableCell para manejar contenido expandible en celdas
const ExpandableCell = ({ value }) => {
  const [expanded, setExpanded] = useState(false);

  // Asegúrate de que el valor es una cadena, si no, utiliza una cadena vacía
  const displayValue = typeof value === "string" ? value : "";

  return (
    <div>
      {expanded ? displayValue : displayValue.slice(0, 70)}&nbsp;
      {displayValue.length > 70 && (
        <Link
          type="button"
          component="button"
          sx={{ fontSize: "inherit" }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "ver menos" : "ver más"}
        </Link>
      )}
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const cacheRef = useRef({});
  // Definición de las columnas, incluyendo las celdas expandibles
  const columns = [
    { field: "proyecto_id", headerName: "ID Proyecto", width: 100 },
    {
      field: "nombre_proyecto",
      headerName: "Nombre del Proyecto",
      width: 250,
      renderCell: (params) => <ExpandableCell value={params.value} />,
    },
    {
      field: "nombre_facultad",
      headerName: "Nombre de la Facultad",
      width: 300,
    },
    {
      field: "nombre_parroquia",
      headerName: "Parroquias",
      width: 200,
      renderCell: (params) => (
        <ExpandableCell value={params.value.join(", ")} />
      ),
    },
    {
      field: "nombre_org_res_contraparte",
      headerName: "Organización Contraparte",
      width: 300,
    },
    {
      field: "responsables_contraparte",
      headerName: "Responsables Contraparte",
      width: 300,
      renderCell: (params) => (
        <ExpandableCell value={params.value.join(", ")} />
      ),
    },
    {
      field: "action",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal(params.row)}
        >
          Ver Detalles
        </Button>
      ),
    },
  ];

  // Función de manejo de clics en los botones de acción
  const handleOpenModal = (row) => {
    if (cacheRef.current[row.proyecto_id]) {
      setSelectedProject(cacheRef.current[row.proyecto_id]);
      setIsModalOpen(true);
    } else {
      fetch(`http://localhost:3000/api/projects/all-info/${row.proyecto_id}`)
        .then((response) => response.json())
        .then((data) => {
          cacheRef.current[row.proyecto_id] = data;
          setSelectedProject(data);
          setIsModalOpen(true);
        })
        .catch((error) =>
          console.error("Error fetching project details: ", error)
        );
    }
  };

  const handleCloseModal = () => {
    setSelectedProject({});
    setIsModalOpen(false);
  };

  // Efecto para cargar datos desde la API
  useEffect(() => {
    fetch("http://localhost:3000/api/projects/all")
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.map((project, index) => {
          const nombre_facultad = project.carreras_info
            ? project.carreras_info
                .map((carrera) => carrera.nombre_facultad)
                .join(", ")
            : "";
          const nombre_parroquia = project.ubicaciones_info
            ? project.ubicaciones_info.flatMap((ubicacion) =>
                ubicacion.parroquias
                  ? ubicacion.parroquias.map(
                      (parroquia) => parroquia.nombre_parroquia
                    )
                  : []
              )
            : [];
          const nombre_org_res_contraparte = project.org_res_contraparte
            ? project.org_res_contraparte.map((org) => org.nombre).join(", ")
            : "";
          const responsables_contraparte = project.org_res_contraparte
            ? project.org_res_contraparte.flatMap((org) =>
                org.responsables
                  ? org.responsables.map((responsable) => responsable.nombres)
                  : []
              )
            : [];

          return {
            id: index, // Asignar un id único basado en el índice
            proyecto_id: project.proyecto_info?.proyecto_id,
            nombre_proyecto: project.proyecto_info?.nombre_proyecto,
            nombre_facultad,
            nombre_parroquia,
            nombre_org_res_contraparte,
            responsables_contraparte,
          };
        });
        setProjects(processedData);
      })
      .catch((error) => console.error("Error fetching projects: ", error));
  }, []);

  return (
    <>
      <Title>Proyectos</Title>
      <DataGrid
        columns={columns}
        rows={projects}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20]}
        checkboxSelection
        getRowHeight={() => "auto"}
        getEstimatedRowHeight={() => 100}
        slots={{ toolbar: GridToolbar }}
        sx={{
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
            py: 1,
          },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "15px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
        }}
      />

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <p>
            <strong>ID: </strong>
            {selectedProject?.proyecto_info.proyecto_id}
          </p>
          <p>
            <strong>Nombre del Programa: </strong>
            {selectedProject?.proyecto_info.nombre_programa
              ? selectedProject?.proyecto_info.nombre_programa
              : "No especificado"}
          </p>
          <p>
            <strong>Coordinador: </strong>
            {selectedProject?.proyecto_info.coordinador_programa
              ? selectedProject?.proyecto_info.coordinador_programa
              : "No especificado"}
          </p>
          <p>
            <strong>Nombre del Proyecto: </strong>
            {selectedProject?.proyecto_info.nombre_proyecto
              ? selectedProject?.proyecto_info.nombre_proyecto
              : "No especificado"}
          </p>
          <p>
            <strong>Objetivo General: </strong>
            {selectedProject?.proyecto_info.objetivo_general}
          </p>
          {/* FACULTADES Y CARRERAS */}
          <div
            className={`${
              selectedProject?.carreras_info ? "d-block" : "d-none"
            }`}
          >
            <h4>Facultades y Carreras</h4>
            <table>
              <thead>
                <tr>
                  <th>Nombre de la Facultad</th>
                  <th>Nombre de la Carrera</th>
                </tr>
              </thead>
              <tbody>
                {selectedProject?.carreras_info?.map((facultad) =>
                  facultad.carreras.map((carrera) => (
                    <tr key={carrera.id_carrera}>
                      {carrera.id_carrera ===
                      facultad.carreras[0].id_carrera ? (
                        <td rowSpan={facultad.carreras.length}>
                          {facultad.nombre_facultad}
                        </td>
                      ) : null}
                      <td>{carrera.nombre_carrera}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* UBICACIONES */}
          <div
            className={`${
              selectedProject?.ubicaciones_info?.length ? "d-block" : "d-none"
            }`}
          >
            <h4>Territorio</h4>
            <table>
              <thead>
                <tr>
                  <th>Cantón</th>
                  <th>Parroquia</th>
                </tr>
              </thead>
              <tbody>
                {selectedProject?.ubicaciones_info?.map((canton) =>
                  canton.parroquias.length > 0 ? (
                    canton.parroquias.map((parroquia, index) => (
                      <tr key={parroquia.id_parroquia}>
                        {index === 0 ? (
                          <td rowSpan={canton.parroquias.length}>
                            {canton.nombre_canton}
                          </td>
                        ) : null}
                        <td>{parroquia.nombre_parroquia}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={canton.id_canton}>
                      <td>{canton.nombre_canton}</td>
                      <td>No hay parroquias</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          {/* ORGANIZACION RESPONSABLE CONTRAPARTE */}
          <div
            className={`${
              selectedProject?.org_res_contraparte ? "d-block" : "d-none"
            }`}
          >
            <h4>Responsables Contraparte</h4>
            <table>
              <thead>
                <tr>
                  <th>Nombre de la Organización</th>
                  <th>Responsable</th>
                  <th>Cargo</th>
                  <th>Dirección</th>
                  <th>Teléfono Celular</th>
                  <th>Teléfono Convencional</th>
                  <th>Correo Electrónico</th>
                </tr>
              </thead>
              <tbody>
                {selectedProject?.org_res_contraparte?.map((org) =>
                  org.responsables.map((resp, index) => (
                    <tr key={resp.id_responsable_contraparte}>
                      {index === 0 ? (
                        <>
                          <td rowSpan={org.responsables.length}>
                            {org.nombre}
                          </td>
                          <td>{resp.nombres}</td>
                          <td>{resp.cargo}</td>
                          <td>{resp.direccion}</td>
                          <td>{resp.tlf_celular}</td>
                          <td>{resp.tlf_convencional}</td>
                          <td>{resp.correo_electronico}</td>
                        </>
                      ) : (
                        <tr key={resp.id_responsable_contraparte}>
                          <td>{resp.nombres}</td>
                          <td>{resp.cargo}</td>
                          <td>{resp.direccion}</td>
                          <td>{resp.tlf_celular}</td>
                          <td>{resp.tlf_convencional}</td>
                          <td>{resp.correo_electronico}</td>
                        </tr>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </>
  );
};

ExpandableCell.propTypes = {
  value: PropTypes.string,
};

export default Projects;

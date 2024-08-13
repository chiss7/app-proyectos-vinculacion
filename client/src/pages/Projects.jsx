import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Link } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import Modal from "../components/Modal";
import PltPrincipal from "../components/pltPrincipal";
import "../styles.css";
import axios from "axios";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

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
          {expanded ? "Ver menos" : "... Ver más"}
        </Link>
      )}
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const cacheRef = useRef({});

  const [isProyectsLoading, setIsProjectsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isProjectInfoLoading, setIsProjectInfoLoading] = useState(false);

  // Definición de las columnas, incluyendo las celdas expandibles
  const columns = [
    { field: "proyecto_id", headerName: "ID Proyecto", width: 100 },
    {
      field: "nombre_proyecto",
      headerName: "Nombre del Proyecto",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay nombre del proyecto"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "nombre_programa",
      headerName: "Nombre Programa",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay nombre programa"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "objetivo_general",
      headerName: "Objetivo General",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay Objetivo General"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "objetivos_especificos",
      headerName: "Objetivos Específicos",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay Objetivos Específicos"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "nombre_proceso_gestion",
      headerName: "Proceso Gestión",
      width: 250,
      renderCell: (params) => (
        <>{params.value === null ? "No hay duración" : params.value}</>
      ),
    },
    {
      field: "duracion",
      headerName: "Duración (meses)",
      width: 150,
      renderCell: (params) => (
        <>{params.value === null ? "No hay duración" : params.value}</>
      ),
    },
    {
      field: "presupuesto_por_mes",
      headerName: "Presupuesto por Semestre",
      width: 200,
      renderCell: (params) => (
        <>{params.value === null ? "No hay presupuesto" : params.value}</>
      ),
    },
    {
      field: "fecha_inicio",
      headerName: "Fecha de Inicio",
      width: 200,
      renderCell: (params) => (
        <>{params.value === null ? "No hay información" : params.value}</>
      ),
    },
    {
      field: "fecha_finalizacion",
      headerName: "Fecha de Finalización",
      width: 200,
      renderCell: (params) => (
        <>{params.value === null ? "No hay información" : params.value}</>
      ),
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
        <>
          {params.value.length > 0 ? (
            <ExpandableCell value={params.value.join(", ")} />
          ) : (
            "No hay parroquias"
          )}
        </>
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
        <>
          {params.value.length > 0 ? (
            <ExpandableCell value={params.value.join(", ")} />
          ) : (
            "No hay responsables contraparte"
          )}
        </>
      ),
    },
    {
      field: "cantidad_docentes",
      headerName: "Cantidad Docentes",
      width: 250,
      renderCell: (params) => (
        <>{params.value === null ? "No hay información" : params.value}</>
      ),
    },
    {
      field: "cantidad_estudiantes",
      headerName: "Cantidad Estudiantes",
      width: 250,
      renderCell: (params) => (
        <>{params.value === null ? "No hay información" : params.value}</>
      ),
    },
    {
      field: "beneficiarios_directos",
      headerName: "Beneficiarios Directos",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay beneficiarios directos"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "beneficiarios_indirectos",
      headerName: "Beneficiarios Indirectos",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay beneficiarios indirectos"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "antecedentes",
      headerName: "Antecedentes",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay antecedentes"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "metodologia",
      headerName: "Metodología",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay metodología"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "justificacion",
      headerName: "Justificacion",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay justificacion"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "problemas_a_resolver",
      headerName: "Problemas a resolver",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay problemas a resolver"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "diagnostico_comunitario",
      headerName: "Diagnóstico Comunitario",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No hay diagnóstico comunitario"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "elaborado_por",
      headerName: "Elaborado por",
      width: 250,
      renderCell: (params) => (
        <>{params.value === null ? "No hay información" : params.value}</>
      ),
    },
    {
      field: "aprobado_por",
      headerName: "Aprobado por",
      width: 250,
      renderCell: (params) => (
        <>{params.value === null ? "No hay información" : params.value}</>
      ),
    },
    {
      field: "fecha_entrega_informe",
      headerName: "Fecha de entrega del informe",
      width: 200,
      renderCell: (params) => (
        <>{params.value === null ? "No hay información" : params.value}</>
      ),
    },
    {
      field: "action",
      headerName: "Acciones",
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 2 }}>
          <LoadingButton
            loading={isProjectInfoLoading}
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal(params.row)}
          >
            Ver Detalles
          </LoadingButton>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOpenDeleteProjectModal(params.row)}
          >
            Borrar Proyecto
          </Button>
        </Box>
      ),
    },
  ];

  const handleOpenModal = (row) => {
    if (cacheRef.current[row.proyecto_id]) {
      setSelectedProject(cacheRef.current[row.proyecto_id]);
      setIsModalOpen(true);
    } else {
      setIsProjectInfoLoading(true);
      fetch(`http://localhost:3000/api/projects/all-info/${row.proyecto_id}`)
        .then((response) => response.json())
        .then((data) => {
          cacheRef.current[row.proyecto_id] = data;
          setSelectedProject(data);
          setIsModalOpen(true);
        })
        .catch((error) =>
          console.error("Error fetching project details: ", error)
        )
        .finally(() => setIsProjectInfoLoading(false));
    }
  };

  const handleCloseModal = () => {
    setSelectedProject({});
    setIsModalOpen(false);
  };

  const handleOpenDeleteProjectModal = (row) => {
    setSelectedProjectId(row.proyecto_id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteProject = async (id) => {
    try {
      setIsDeleteLoading(true);
      const res = await axios.delete(
        `http://localhost:3000/api/projects/${id}`
      );
      if (res.status === 204) {
        setProjects(projects.filter((project) => project.proyecto_id !== id));
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleCloseDeleteProjectModal = () => {
    setSelectedProjectId("");
    setIsDeleteModalOpen(false);
  };

  // Efecto para cargar datos desde la API
  useEffect(() => {
    setIsProjectsLoading(true);
    fetch("http://localhost:3000/api/projects/all")
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.map((project, index) => {
          const nombre_facultad = project.carreras_info
            ? project.carreras_info
                .map((facultad) => facultad.nombre_facultad)
                .join(", ")
            : "No hay facultad";
          const nombre_parroquia = project.ubicaciones_info
            ? project.ubicaciones_info.flatMap((canton) =>
                canton.parroquias
                  ? canton.parroquias.map(
                      (parroquia) => parroquia.nombre_parroquia
                    )
                  : ""
              )
            : [];
          const nombre_org_res_contraparte = Array.isArray(
            project.org_res_contraparte
          )
            ? project.org_res_contraparte.map((org) => org.nombre).join(", ")
            : "No hay organización contraparte";
          const responsables_contraparte = project.org_res_contraparte
            ? project.org_res_contraparte.flatMap((org) =>
                org.responsables
                  ? org.responsables.map((responsable) => responsable.nombres)
                  : []
              )
            : [];

          return {
            id: index, // Asignar un id único basado en el índice
            ...project?.proyecto_info,
            nombre_facultad,
            nombre_parroquia,
            nombre_org_res_contraparte,
            responsables_contraparte,
          };
        });
        console.log(processedData);
        setProjects(processedData);
      })
      .catch((error) => console.error("Error fetching projects: ", error))
      .finally(() => setIsProjectsLoading(false));
  }, []);

  return (
    <PltPrincipal>
      {isProyectsLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          columns={columns}
          rows={projects}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20, 30]}
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
      )}

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
            style={{
              display: selectedProject?.carreras_info ? "block" : "none",
            }}
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
            style={{
              display:
                selectedProject?.ubicaciones_info?.length > 0
                  ? "block"
                  : "none",
            }}
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
            style={{
              display: selectedProject?.org_res_contraparte ? "block" : "none",
            }}
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

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          onClose={handleCloseDeleteProjectModal}
          onConfirm={handleConfirmDeleteProject}
          projectId={selectedProjectId}
          loading={isDeleteLoading}
        />
      )}
    </PltPrincipal>
  );
};

ExpandableCell.propTypes = {
  value: PropTypes.string,
};

export default Projects;

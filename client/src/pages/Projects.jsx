import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "../components/Modal";
import PltPrincipal from "../components/pltPrincipal";
import "../styles.css";
import axios from "axios";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ProjectInfo from "../components/ProjectInfo";
import ExpandableCell from "../components/ExpandableCell";

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

  const columns = [
    { field: "proyecto_id", headerName: "ID Proyecto", width: 100 },
    {
      field: "nombre_proyecto",
      headerName: "Nombre del Proyecto",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No especificado"
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
            "No especificado"
          ) : (
            <ExpandableCell value={params.value} />
          )}
        </>
      ),
    },
    {
      field: "coordinador_programa",
      headerName: "Coordinador",
      width: 250,
      renderCell: (params) => (
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "objetivo_general",
      headerName: "Objetivo General",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No especificado"
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
            "No especificado"
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
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "duracion",
      headerName: "Duración (meses)",
      width: 150,
      renderCell: (params) => (
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "presupuesto_por_mes",
      headerName: "Presupuesto por Semestre",
      width: 200,
      renderCell: (params) => (
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "fecha_inicio",
      headerName: "Fecha de Inicio",
      width: 200,
      renderCell: (params) => (
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "fecha_finalizacion",
      headerName: "Fecha de Finalización",
      width: 200,
      renderCell: (params) => (
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "nombre_facultad",
      headerName: "Nombre de la Facultad",
      width: 300,
    },
    {
      field: "carreras",
      headerName: "Carreras",
      width: 200,
      renderCell: (params) => (
        <>
          {params.value.length > 0 ? (
            <ExpandableCell value={params.value.join(", ")} />
          ) : (
            "No especificado"
          )}
        </>
      ),
    },
    {
      field: "cantones",
      headerName: "Cantones",
      width: 200,
      renderCell: (params) => (
        <>
          <ExpandableCell value={params.value} />
        </>
      ),
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
            "No especificado"
          )}
        </>
      ),
    },
    {
      field: "responsables_uce",
      headerName: "Responsables Uce",
      width: 200,
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
          <ExpandableCell value={params.value} />
        </>
      ),
    },

    {
      field: "participantes",
      headerName: "Participantes",
      width: 400,
      renderCell: (params) => (
        <>
          {params.value.length > 0 ? (
            <ExpandableCell value={params.value.join(", ")} />
          ) : (
            "No especificado"
          )}
        </>
      ),
    },
    {
      field: "cantidad_docentes",
      headerName: "Cantidad Docentes",
      width: 250,
      renderCell: (params) => (
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "cantidad_estudiantes",
      headerName: "Cantidad Estudiantes",
      width: 250,
      renderCell: (params) => (
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "beneficiarios_directos",
      headerName: "Beneficiarios Directos",
      width: 250,
      renderCell: (params) => (
        <>
          {params.value === null ? (
            "No especificado"
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
            "No especificado"
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
            "No especificado"
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
            "No especificado"
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
            "No especificado"
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
            "No especificado"
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
            "No especificado"
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
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "aprobado_por",
      headerName: "Aprobado por",
      width: 250,
      renderCell: (params) => (
        <>{params.value === null ? "No especificado" : params.value}</>
      ),
    },
    {
      field: "fecha_entrega_informe",
      headerName: "Fecha de entrega del informe",
      width: 200,
      renderCell: (params) => (
        <>{params.value === null ? "No especificado" : params.value}</>
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

  useEffect(() => {
    setIsProjectsLoading(true);
    fetch("http://localhost:3000/api/projects/all")
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.map((project, index) => {
          const nombre_facultad = Array.isArray(project.carreras_info)
            ? project.carreras_info
                .map((facultad) => facultad.nombre_facultad)
                .join(", ")
            : "No especificado";

          const carreras = Array.isArray(project.carreras_info)
            ? project.carreras_info.flatMap((facultad) =>
                Array.isArray(facultad.carreras) && facultad.carreras.length > 0
                  ? facultad.carreras.map((carrera) => carrera.nombre_carrera)
                  : []
              )
            : [];

          const cantones = Array.isArray(project.ubicaciones_info)
            ? project.ubicaciones_info
                .map((canton) => canton.nombre_canton)
                .join(", ")
            : "No especificado";

          const nombre_parroquia = project.ubicaciones_info
            ? project.ubicaciones_info.flatMap((canton) =>
                Array.isArray(canton.parroquias) && canton.parroquias.length > 0
                  ? canton.parroquias.map(
                      (parroquia) => parroquia.nombre_parroquia
                    )
                  : []
              )
            : [];

          const nombre_org_res_contraparte = Array.isArray(
            project.org_res_contraparte
          )
            ? project.org_res_contraparte.map((org) => org.nombre).join(", ")
            : "No especificado";

          const responsables_contraparte = project.org_res_contraparte
            ? project.org_res_contraparte
                .map((org) => {
                  if (org.responsables && org.responsables.length > 0) {
                    return org.responsables
                      .map((responsable) => responsable.nombres)
                      .join(", ");
                  } else {
                    return "No especificado";
                  }
                })
                .join(", ")
            : "No especificado";

          project.proyecto_info.participantes =
            Array.isArray(project.proyecto_info.participantes) &&
            project.proyecto_info.participantes.length > 0
              ? project.proyecto_info.participantes.map(
                  (participante) =>
                    `${participante.nombres}: ${
                      participante.horas_asignadas
                        ? participante.horas_asignadas
                        : "No especifica"
                    } horas`
                )
              : [];

          project.proyecto_info.responsables_uce =
            Array.isArray(project.proyecto_info.responsables_uce) &&
            project.proyecto_info.responsables_uce.length > 0
              ? project.proyecto_info.responsables_uce
                  .map(
                    (responsable) => responsable.nombre && responsable.nombre
                  )
                  .join(", ")
              : "No especificado";

          return {
            id: index, // Asignar un id único basado en el índice
            ...project?.proyecto_info,
            nombre_facultad,
            carreras,
            cantones,
            nombre_parroquia,
            nombre_org_res_contraparte,
            responsables_contraparte,
          };
        });
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
          checkboxSelection
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
          <ProjectInfo selectedProject={selectedProject} />
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

export default Projects;

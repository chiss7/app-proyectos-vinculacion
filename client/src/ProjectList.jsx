import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;
  const cacheRef = useRef({});

  useEffect(() => {
    fetch("http://localhost:3000/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const handleOpenModal = (id) => {
    if (cacheRef.current[id]) {
      setSelectedProject(cacheRef.current[id]);
      setIsModalOpen(true);
    } else {
      fetch(`http://localhost:3000/api/projects/all-info/${id}`)
        .then((response) => response.json())
        .then((data) => {
          cacheRef.current[id] = data;
          setSelectedProject(data);
          setIsModalOpen(true);
        })
        .catch((error) =>
          console.error("Error fetching project details:", error)
        );
    }
  };

  const handleCloseModal = () => {
    setSelectedProject({});
    setIsModalOpen(false);
  };

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const currentProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Proyectos</h1>
      <table className="">
        <thead style={{ backgroundColor: "#d3e5f5" }}>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre Proyecto</th>
            <th scope="col">Coordinador</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.nombre_proyecto}</td>
              <td>{project.coordinador_programa}</td>
              <td>
                <button
                  className="btn"
                  style={{ backgroundColor: "#b9cde5", color: "#333" }}
                  onClick={() => handleOpenModal(project.id)}
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mt-4 mb-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn ${
              currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
            } mx-1`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

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
    </div>
  );
}

export default ProjectList;

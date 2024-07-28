import React, { useState, useEffect } from 'react';
import Modal from './Modal';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:3000/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
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
      <table className="table table-hover">
        <thead style={{ backgroundColor: '#d3e5f5' }}>
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
                  style={{ backgroundColor: '#b9cde5', color: '#333' }}
                  onClick={() => handleOpenModal(project)}
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <h2>Detalles del Proyecto</h2>
          <p><strong>ID:</strong> {selectedProject.id}</p>
          <p><strong>Nombre del Programa:</strong> {selectedProject.nombre_programa}</p>
          <p><strong>Coordinador:</strong> {selectedProject.coordinador_programa}</p>
          <p><strong>Nombre del Proyecto:</strong> {selectedProject.nombre_proyecto}</p>
          <p><strong>Objetivo General:</strong> {selectedProject.objetivo_general}</p>
          {/* Agrega más campos según sea necesario */}
          <button className="btn btn-secondary mt-2" onClick={handleCloseModal}>
            Cerrar
          </button>
        </Modal>
      )}
    </div>
  );
}

export default ProjectList;

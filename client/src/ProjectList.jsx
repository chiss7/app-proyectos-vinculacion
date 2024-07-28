import React, { useState, useEffect } from 'react';
import Modal from './Modal';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 project-title">Proyectos</h1>
      <table className="table table-hover project-table">
        <thead className="table-primary">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre Proyecto</th>
            <th scope="col">Coordinador</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.nombre_proyecto}</td>
              <td>{project.coordinador_programa}</td>
              <td>
                <button
                  className="btn btn-primary view-details-button"
                  onClick={() => handleOpenModal(project)}
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
  <Modal onClose={handleCloseModal}>
    <h2>Detalles del Proyecto</h2>
    <p><strong>ID:</strong> {selectedProject.id}</p>
    <p><strong>Nombre del Programa:</strong> {selectedProject.nombre_programa}</p>
    <p><strong>Coordinador:</strong> {selectedProject.coordinador_programa}</p>
    <p><strong>Nombre del Proyecto:</strong> {selectedProject.nombre_proyecto}</p>
    <p><strong>Objetivo General:</strong> {selectedProject.objetivo_general}</p>
  </Modal>
)}

    </div>
  );
}

export default ProjectList;

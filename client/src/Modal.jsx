import PropTypes from 'prop-types';
import { useEffect } from 'react';

function Modal({ children, onClose }) {
  useEffect(() => {
    // ocultar la barra de desplazamiento
    document.body.style.overflow = 'hidden';
    // Limpiar cuando el componente se desmonte
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog" role='document' style={{ maxWidth: '80%' }}>
        <div className="modal-content" style={{ maxWidth: '80%' }}>
          <div className="modal-header">
            <h3 className="modal-title">Detalles del Proyecto</h3>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-dark"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;

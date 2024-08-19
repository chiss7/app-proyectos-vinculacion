import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import PltPrincipal from "../components/pltPrincipal";
import "../styles.css";
import axios from 'axios';

const CreateProyectoForm = () => {
  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm({
    defaultValues: {
      facultades: [{ id_facultad: '', carreras: [] }]
    }
  });

  const [procesosGestion, setProcesosGestion] = useState([]);
  const [indicadoresImpacto, setIndicadoresImpacto] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [carrerasByFacultad, setCarrerasByFacultad] = useState({});

  // Manejo de arrays dinámicos
  const { fields: facultadesFields, append: appendFacultad, remove: removeFacultad } = useFieldArray({
    control,
    name: 'facultades'
  });

  // Observar los cambios en el campo de facultades
  const facultadesValues = useWatch({ control, name: 'facultades' });

  const selectedProvincia = watch('id_provincia');

  useEffect(() => {
    // Obtener datos para los selectores desde el backend
    const fetchProcesosGestion = async () => {
      const response = await axios.get('http://localhost:3000/api/projects/gestion');
      setProcesosGestion(response.data);
    };

    const fetchIndicadoresImpacto = async () => {
      const response = await axios.get('http://localhost:3000/api/projects/impacto');
      setIndicadoresImpacto(response.data);
    };

    const fetchData = async () => {
      try {
        const [facultadResponse, provinciaResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/projects/facultad'),
          axios.get('http://localhost:3000/api/projects/provincia'),
        ]);
        setFacultades(facultadResponse.data);
        setProvincias(provinciaResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProcesosGestion();
    fetchIndicadoresImpacto();
    fetchData();
  }, []);

  useEffect(() => {
    facultadesValues.forEach(async (facultad, index) => {
      if (facultad.id_facultad && !carrerasByFacultad[facultad.id_facultad]) {
        try {
          const response = await axios.get(`http://localhost:3000/api/projects/carrera/${facultad.id_facultad}`);
          setCarrerasByFacultad(prev => ({ ...prev, [facultad.id_facultad]: response.data }));
        } catch (error) {
          console.error('Error fetching carreras:', error);
        }
      }
    });
  }, [facultadesValues]);

  const handleFacultadChange = (index, value) => {
    setValue(`facultades.${index}.id_facultad`, value);
    if (value) {
      fetchCarreras(value, index);
    }
  };

  const fetchCarreras = async (facultadId, index) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/projects/carrera/${facultadId}`);
      setCarrerasByFacultad(prev => ({ ...prev, [facultadId]: response.data }));
    } catch (error) {
      console.error('Error fetching carreras:', error);
    }
  };

  const handleCarreraChange = (index, carreraIndex, value) => {
    const currentCarreras = facultadesValues[index]?.carreras || [];
    currentCarreras[carreraIndex] = value;
    setValue(`facultades.${index}.carreras`, currentCarreras);
  };

  const handleCarreraRemove = (index, carreraIndex) => {
    const currentCarreras = facultadesValues[index]?.carreras || [];
    currentCarreras.splice(carreraIndex, 1);
    setValue(`facultades.${index}.carreras`, currentCarreras);
  };

  useEffect(() => {
    const fetchCantones = async () => {
      if (selectedProvincia) {
        try {
          const response = await axios.get(`http://localhost:3000/api/projects/canton/${selectedProvincia}`);
          setCantones(response.data);
        } catch (error) {
          console.error('Error fetching cantones', error);
        }
      }
    };

    fetchCantones();
  }, [selectedProvincia]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/proyecto', data);
      console.log('Proyecto creado:', response.data);
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
    }
  };

  return (
    <PltPrincipal>
      <form onSubmit={handleSubmit(onSubmit)}>

        {facultadesFields.map((facultadField, index) => (
          <div key={facultadField.id}>
            <label>Facultad</label>
            <select
              {...register(`facultades.${index}.id_facultad`, { required: 'Este campo es obligatorio' })}
              onChange={(e) => handleFacultadChange(index, e.target.value)}
            >
              <option value="">Selecciona una facultad</option>
              {facultades.map(facultad => (
                <option key={facultad.id} value={facultad.id}>{facultad.nombre}</option>
              ))}
            </select>
            {errors.facultades?.[index]?.id_facultad && <span>{errors.facultades[index].id_facultad.message}</span>}

            <div>
              <label>Carreras</label>
              {facultadesValues[index]?.carreras?.map((carrera, carreraIndex) => (
                <div key={carreraIndex}>
                  <select
                    {...register(`facultades.${index}.carreras.${carreraIndex}`, { required: 'Este campo es obligatorio' })}
                    onChange={(e) => handleCarreraChange(index, carreraIndex, e.target.value)}
                  >
                    <option value="">Selecciona una carrera</option>
                    {carrerasByFacultad[facultadesValues[index]?.id_facultad]?.map(carrera => (
                      <option key={carrera.id} value={carrera.id}>{carrera.nombre}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleCarreraRemove(index, carreraIndex)}>
                    Eliminar Carrera
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const currentCarreras = facultadesValues[index]?.carreras || [];
                setValue(`facultades.${index}.carreras`, [...currentCarreras, '']);
              }}>
                Agregar Carrera
              </button>
            </div>

            <button type="button" onClick={() => removeFacultad(index)}>Eliminar Facultad</button>
          </div>
        ))}

        <button type="button" onClick={() => appendFacultad({ id_facultad: '', carreras: [] })}>
          Agregar Facultad
        </button>

        <div>
          <label>Nombre del Programa</label>
          <input type="text" {...register('nombre_programa', { required: true })} />
          {errors.nombre_programa && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Coordinador del Programa</label>
          <input type="text" {...register('coordinador_programa', { required: true })} />
          {errors.coordinador_programa && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Nombre del Proyecto</label>
          <input type="text" {...register('nombre_proyecto', { required: true })} />
          {errors.nombre_proyecto && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Nombre Corto del Proyecto</label>
          <input type="text" {...register('nombre_proyecto_corto', { required: true })} />
          {errors.nombre_proyecto_corto && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Objetivo General</label>
          <textarea {...register('objetivo_general', { required: true })} />
          {errors.objetivo_general && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Objetivos Específicos</label>
          <textarea {...register('objetivos_especificos', { required: true })} />
          {errors.objetivos_especificos && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Proceso de Gestión</label>
          <select {...register('id_proceso_gestion', { required: true })}>
            {procesosGestion.map(proceso => (
              <option key={proceso.id} value={proceso.id}>{proceso.nombre}</option>
            ))}
          </select>
          {errors.id_proceso_gestion && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Provincia</label>
          <select {...register('id_provincia', { required: 'Este campo es obligatorio' })}>
            <option value="">Selecciona una provincia</option>
            {provincias.map(provincia => (
              <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
            ))}
          </select>
          {errors.id_provincia && <span>{errors.id_provincia.message}</span>}
        </div>

        <div>
          <label>Canton</label>
          <select {...register('id_canton', { required: 'Este campo es obligatorio' })}>
            <option value="">Selecciona un cantón</option>
            {cantones.map(canton => (
              <option key={canton.id} value={canton.id}>{canton.nombre}</option>
            ))}
          </select>
          {errors.id_canton && <span>{errors.id_canton.message}</span>}
        </div>

        <div>
          <label>Indicador de Impacto</label>
          <select {...register('id_indicador_impacto', { required: true })}>
            {indicadoresImpacto.map(indicador => (
              <option key={indicador.id} value={indicador.id}>{indicador.nombre}</option>
            ))}
          </select>
          {errors.id_indicador_impacto && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Duración (meses)</label>
          <input type="number" {...register('duracion', { required: true })} />
          {errors.duracion && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Fecha de Inicio</label>
          <input type="date" {...register('fecha_inicio', { required: true })} />
          {errors.fecha_inicio && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Fecha de Finalización</label>
          <input type="date" {...register('fecha_finalizacion', { required: true })} />
          {errors.fecha_finalizacion && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Presupuesto por Año</label>
          <input type="number" step="0.01" {...register('presupuesto_por_ano', { required: true })} />
          {errors.presupuesto_por_ano && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Presupuesto por Mes</label>
          <input type="number" step="0.01" {...register('presupuesto_por_mes', { required: true })} />
          {errors.presupuesto_por_mes && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Presupuesto Total</label>
          <input type="number" step="0.01" {...register('presupuesto_total', { required: true })} />
          {errors.presupuesto_total && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Cantidad de Docentes</label>
          <input type="number" {...register('cantidad_docentes', { required: true })} />
          {errors.cantidad_docentes && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Cantidad de Estudiantes</label>
          <input type="number" {...register('cantidad_estudiantes', { required: true })} />
          {errors.cantidad_estudiantes && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Diagnóstico Comunitario</label>
          <textarea {...register('diagnostico_comunitario', { required: true })} />
          {errors.diagnostico_comunitario && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Antecedentes</label>
          <textarea {...register('antecedentes', { required: true })} />
          {errors.antecedentes && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Justificación</label>
          <textarea {...register('justificacion', { required: true })} />
          {errors.justificacion && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Metodología</label>
          <textarea {...register('metodologia', { required: true })} />
          {errors.metodologia && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Beneficiarios Directos</label>
          <textarea {...register('beneficiarios_directos', { required: true })} />
          {errors.beneficiarios_directos && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Beneficiarios Indirectos</label>
          <textarea {...register('beneficiarios_indirectos', { required: true })} />
          {errors.beneficiarios_indirectos && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Problemas a Resolver</label>
          <textarea {...register('problemas_a_resolver', { required: true })} />
          {errors.problemas_a_resolver && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Elaborado por</label>
          <input type="text" {...register('elaborado_por', { required: true })} />
          {errors.elaborado_por && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Aprobado por</label>
          <input type="text" {...register('aprobado_por', { required: true })} />
          {errors.aprobado_por && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Fecha de Entrega del Informe</label>
          <input type="date" {...register('fecha_entrega_informe', { required: true })} />
          {errors.fecha_entrega_informe && <span>Este campo es obligatorio</span>}
        </div>

        <div>
          <label>Observaciones</label>
          <textarea {...register('observaciones')} />
        </div>

        <button type="submit">Crear Proyecto</button>
      </form>
    </PltPrincipal>
  );
};

export default CreateProyectoForm;

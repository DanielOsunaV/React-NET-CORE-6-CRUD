import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {
  const baseUrl = "https://localhost:44379/api/gestores";
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [gestorSeleccionado, setGestorSeleccionado] = useState({
    id: '', 
    nombre: '', 
    lanzamiento: '', 
    desarrollador: ''
  })

  const handleChange = e => {
    const {name, value} = e.target;
    setGestorSeleccionado({
      ...gestorSeleccionado,
      [name]: value
    });
    console.log(gestorSeleccionado);
  }
  
  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar); 
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar); 
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar); 
  }

  const peticionGet = async() => {
    await axios.get(baseUrl)
    .then(res => {
      setData(res.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost = async() => {
    delete gestorSeleccionado.id;
    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento);
    await axios.post(baseUrl, gestorSeleccionado)
    .then(res => {
      setData(data.concat(res.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut = async() => {
    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento);
    await axios.put(baseUrl+"/"+gestorSeleccionado.id, gestorSeleccionado)
    .then(res => {
      var result = res.data;
      var dataAux = data;
      dataAux.map(gestor => {
        if(gestor.id === gestorSeleccionado.id){
          gestor.nombre = result.nombre;
          gestor.lanzamiento = result.lanzamiento;
          gestor.desarrollador = result.desarrollador;
        }
      })
      abrirCerrarModalEditar();
    }).catch(error => {
      console.log(error);
    })
  }

  const peticionDelete = async() => {
    await axios.delete(baseUrl+"/"+gestorSeleccionado.id)
    .then(res => {
      setData(data.filter(gestor => gestor.id !== res.data));
      abrirCerrarModalEliminar();
    }).catch(error => {
      console.log(error);
    })
  }

  const seleccionarGestor = (gestor, caso) => {
    setGestorSeleccionado(gestor);
    (caso ==="Editar") ?
    abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  }

  useEffect(() => {
    peticionGet();
  }, [])
  return (
    <div className="App">
      <br /><br />
      <button onClick={()=>abrirCerrarModalInsertar()} className='btn btn-success'>Insertar Nuevo Gestor</button>
      <br /><br />
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
          </tr>
        </thead>
        <tbody>
        {data.map(gestor => (
          <tr key={gestor.id}>
            <td>{gestor.id}</td>
            <td>{gestor.nombre}</td>
            <td>{gestor.lanzamiento}</td>
            <td>{gestor.desarrollador}</td>
            <td>
              <button className='btn btn-primary' onClick={()=>seleccionarGestor(gestor, "Editar")}>Editar</button> {" "}
              <button className='btn btn-danger' onClick={()=>seleccionarGestor(gestor, "Eliminar")}>Eliminar</button>
            </td>
          </tr>
        ))}
        </tbody>

      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Gestor de Base de Datos</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre: </label>
            <br />
            <input type='text' className='form-control' name='nombre' onChange={handleChange}/>
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input type='text' className='form-control' name='lanzamiento' onChange={handleChange}/>
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type='text' className='form-control' name='desarrollador' onChange={handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>peticionPost()}>Insertar</button>{" "}
          <button className='btn btn-danger' onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Gestor de Base de Datos</ModalHeader>
        <ModalBody>
          
          <div className='form-group'>
            <label>Id: </label>
            <br />
            <input type='text' className='form-control' readOnly value={gestorSeleccionado && gestorSeleccionado.id}/>
            <br />
            <label>Nombre: </label>
            <br />
            <input type='text' className='form-control' name='nombre' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.nombre}/>
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input type='text' className='form-control' name='lanzamiento' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.lanzamiento}/>
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type='text' className='form-control' name='desarrollador' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.desarrollador}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>peticionPut()}>Editar</button>{" "}
          <button className='btn btn-danger' onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      
      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Estas seguro de que deseas eliminar el registro "{gestorSeleccionado && gestorSeleccionado.nombre}" de la tabla de Gestores?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={()=>peticionDelete()}>
            Si
          </button>
          <button className='btn btn-secondary' onClick={()=>abrirCerrarModalEliminar()}>
            No
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;

const listaClientes=[];

const loadClientes= async()=>{
    try{

        const respuesta=await fetch('http://localhost:3000/clientes');

        if(!respuesta.ok){
           throw new Error('Error al cargar clientes. Estado: ',respuesta.status);
        }
        const clientes=await respuesta.json();
        listaClientes.push(...clientes);

    }catch(error){
        console.error("Error al cargar clientes",error.message);
    }
}


const guardarCliente= async(nuevoCliente)=>{
    try{

        const respuesta=await fetch('http://localhost:3000/clientes',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(nuevoCliente),
        });

        if(!respuesta.ok){
           throw new Error('Error al crear el cliente. Estado: ',respuesta.status);
        }
        const clienteCreado=await respuesta.json();
        
        console.log('Cliente creado:', clienteCreado);

    }catch(error){
        console.error("Error al cargar clientes",error.message);
    }
}

const cargarFormularioClientes=()=>{
      const clientesForm = document.getElementById('clientes-form');
      clientesForm.innerHTML = `
        <form>
            <label for="nombreCliente">Nombre del Cliente:</label>
            <input type="text" id="nombreCliente" required>
            <label for="edadCliente">Edad del Cliente:</label>
            <input type="number" id="edadCliente" required>
            <label for="emailCliente">Correo Electrónico del Cliente:</label>
            <input type="email" id="emailCliente" required>
            <button type="button" onclick="crearCliente()">Crear Cliente</button>
            <button type="button" onclick="mostrarListado()">Ver Listado de Clientes</button>
            <!-- Aquí se puede añadir más funcionalidad, como modificar y eliminar clientes -->
        </form>
    `;
    const listadoClientes = document.getElementById('listado-clientes');
    listadoClientes.style.display='none';
}

const crearCliente=()=>{
    const nombreInput=document.getElementById('nombreCliente');
    const edadInput=document.getElementById('edadCliente');
    const emailInput=document.getElementById('emailCliente');

    const nombre=nombreInput.value;
    const edad=edadInput.value;
    const email=emailInput.value;

    const nuevoCliente={
        id:listaClientes.length+1,
        nombre:nombre,
        edad: edad,
        email: email
    }

    listaClientes.push(nuevoCliente);
    guardarCliente(nuevoCliente);

    nombreInput.value='';
    edadInput.value='';
    emailInput.value='';

    alert('Cliente creado con éxito!');
    
    actulizarClientesEnFacturas();

    return nuevoCliente;

}

const mostrarListado= async ()=>{
    listaClientes.length=0;
    await loadClientes();
    const clientesForm = document.getElementById('clientes-form');
    const listadoClientes = document.getElementById('listado-clientes');
    
    clientesForm.style.display='none';
    listadoClientes.style.display='block';

    const ul=document.createElement('ul');

    for(const cliente of listaClientes){
        const li=document.createElement('li');
        li.textContent= `ID: ${cliente.id}, Nombre: ${cliente.nombre}, Edad: ${cliente.edad}, Email: ${cliente.email}`;
        ul.appendChild(li);
    }

    listadoClientes.innerHTML='';
    listadoClientes.appendChild(ul);

    const volverButton=document.createElement('button');
    volverButton.textContent='Volver al Formulario';
    volverButton.addEventListener('click',volverFormulario);
    listadoClientes.appendChild(volverButton);
    
}

const volverFormulario=()=>{
    const clientesForm=document.getElementById('clientes-form');
    const listadoClientes = document.getElementById('listado-clientes');

    listadoClientes.style.display='none';
    clientesForm.style.display='block';
    
}




console.log(listaClientes);
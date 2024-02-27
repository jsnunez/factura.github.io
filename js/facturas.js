const listaFacturas=[];
const loadfacturas= async()=>{
    try{
        
        const respuesta=await fetch('http://localhost:3000/facturas');

        if(!respuesta.ok){
           throw new Error('Error al cargar facturas. Estado: ',respuesta.status);
        }
        const facturas=await respuesta.json();
        listaFacturas.push(...facturas);

    }catch(error){
        console.error("Error al cargar facturas",error.message);
    }
    generarOptionsClientes();
    generarOptionsProductos();
}

const actulizarClientesEnFacturas=()=>{
    const clienteSelect=document.getElementById('clienteFactura');
    clienteSelect.innerHTML='';
    const opcionesClientes=generarOptionsClientes();
    clienteSelect.innerHTML=opcionesClientes;
}

const actulizarProductosEnFacturas=()=>{
    const productosSelect=document.getElementById('productosFactura');
    productosSelect.innerHTML='';
    const opcionesProductos=generarOptionsProductos();
    productosSelect.innerHTML=opcionesProductos;
}

const cargarFormularioFacturas=()=>{
    const facturasForm=document.getElementById('facturas-form');
    facturasForm.innerHTML = `
        <form>
            <label for="fechaFactura">Fecha de la Factura:</label>
            <input type="date" id="fechaFactura" required>
            
            <label for="clienteFactura">Cliente:</label>
            <select id="clienteFactura" required>
            </select>

            <label for="productosFactura">Productos:</label>
            <select id="productosFactura" multiple required>
      
            </select>

            <label for="cantidadProducto">Cantidad:</label>
            <input type="number" id="cantidadProducto" required>

            <button type="button" onclick="agregarItemFactura()">Agregar Item</button>

            <h3>Items de la Factura:</h3>
            <ul id="listado-items"></ul>

            <button type="button" onclick="crearFactura()">Crear Factura</button>
            <button type="button" onclick="mostrarListadoFacturas()">Ver Listado de Facturas</button>
        </form>
    `;
    generarOptionsClientes();
    const listaFacturas=document.getElementById('listado-facturas');
    listaFacturas.style.display='none';

}


const generarOptionsClientes=()=>{
    const clienteFactura=document.getElementById('clienteFactura');
    let options='';
    console.log(listaClientes)

    for(const cliente of listaClientes){
        console.log(cliente.id)
        options+=`<option value="${cliente.id}">${cliente.nombre}</option>`;
    }
    clienteFactura.innerHTML=options;


}

const generarOptionsProductos=()=>{
    const productosFactura=document.getElementById('productosFactura');
    let options='';
    

    for(const producto of listaProductos){
    
        options+=`<option value="${producto.codigo}">${producto.descripcion}</option>`;
    }
    productosFactura.innerHTML=options;


}

const agregarItemFactura=()=>{
     const productoSelect=document.getElementById('productosFactura');
     const cantidadInput=document.getElementById('cantidadProducto');
     const listadoItems=document.getElementById('listado-items');

     const selectedProductoIndex=productoSelect.selectedIndex;
     const cantidad=cantidadInput.value;
     
     if (selectedProductoIndex === -1 || !cantidad) {
        alert('Por favor, selecciona un producto y especifica la cantidad.');
        return;
     }

     const selectProducto=listaProductos[selectedProductoIndex];
     const subtotal=selectProducto.precio*cantidad;

     const li=document.createElement('li');
     li.textContent= `${selectProducto.descripcion} - Cantidad: ${cantidad} - Subtotal: ${subtotal} `;
     listadoItems.appendChild(li);

     productoSelect.selectedIndex=-1;
     cantidadInput.value='';

}

const crearFactura=()=>{
    const fechaInput=document.getElementById('fechaFactura');
    const clienteSelect=document.getElementById('clienteFactura');
    const listadoItems=document.getElementById('listado-items');

    const fecha=fechaInput.value;
    const clienteId=clienteSelect.value;
    const itemsFactura=[];
    let totalFactura=0;
    const idProdcuto=listaProductos.find(c=>c.producto===itemsFactura[0]);
console.log(idProdcuto);
    for(const li of listadoItems.getElementsByTagName('li')){
        itemsFactura.push(li.textContent);
        const cantidadMatch=li.textContent.match(/Cantidad: (\d+)/);
        const subtotalMatch=li.textContent.match(/Subtotal: (\d+)/);
      
        if(cantidadMatch && subtotalMatch){
            const cantidad=parseInt(cantidadMatch[1]);
            const subtotal=parseInt(subtotalMatch[1]);
            totalFactura+=subtotal;
        }

    }

    if(!fecha || !clienteId || itemsFactura.length===0){
        alert('Por favor, completa todos los campos y agrega al menos un item de la factura.');
        return;
    }

    const cliente=listaClientes.find(c=>c.id===parseInt(clienteId));

     
      const nuevaFactura = {
        id:String(listaFacturas.length+1) ,
        fecha: fecha,
        cliente: parseInt(clienteId),
        itemsfactura: itemsFactura,
        totalFactura: totalFactura 
    };

    guardarFactura(nuevaFactura);

    listaFacturas.push(nuevaFactura);

    console.log("Factura creada ", nuevaFactura);
    console.log("Listado de facturas:", listaFacturas);

    fechaInput.value='';
    clienteSelect.selectedIndex=0;
    listadoItems.innerHTML='';

    alert(`Factura creada con éxito! Total: ${totalFactura}`);

}
const guardarFactura= async(nuevoFactura)=>{
    try{

        const respuesta=await fetch('http://localhost:3000/facturas',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(nuevoFactura),
        });

        if(!respuesta.ok){
           throw new Error('Error al crear la factura. Estado: ',respuesta.status);
        }
        const facturaCreado=await respuesta.json();
        
        console.log('factura creada:', facturaCreado);

    }catch(error){
        console.error("Error al cargar factura",error.message);
    }
}

const mostrarListadoFacturas=()=>{
    const facturasForm = document.getElementById('facturas-form');
    const listadoFacturas = document.getElementById('listado-facturas');
    // Ocultar formulario de facturas
    facturasForm.style.display = 'none';

    // Mostrar listado de facturas
    listadoFacturas.style.display = 'block';

    // Crear una lista (ul) para mostrar las facturas
    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    ul.style.padding = '0';
    console.error(listaFacturas);
    // Recorrer la lista de facturas y agregar cada factura como un elemento de lista (li)
    for (const factura of listaFacturas) {
        console.error(factura);

        const li = document.createElement('li');
        li.style.marginBottom = '15px';
        li.style.borderBottom = '1px solid #ccc';
        li.style.paddingBottom = '10px';
        console.error(factura.fecha);
        // Comprobación para asegurarse de que factura.fecha es un objeto Date
       
        const fechaCliente = document.createElement('div');
        fechaCliente.style.fontWeight = 'bold';
        fechaCliente.textContent = `Fecha: ${factura.fecha}, Cliente: ${factura.cliente}, Total: ${factura.totalFactura}`;
        li.appendChild(fechaCliente);

        const itemsUl = document.createElement('ul');
        itemsUl.style.listStyleType = 'none';
        itemsUl.style.padding = '0';

        // Recorrer los items de la factura y agregar cada item como un elemento de lista (li)
        for (const item of factura.itemsfactura) {
            const itemLi = document.createElement('li');
            itemLi.textContent = `Producto: ${item.producto} cantidad: ${item.cantidad}`;
            itemsUl.appendChild(itemLi);
        }

        li.appendChild(itemsUl);
        ul.appendChild(li);
    }

    // Limpiar el contenido anterior del contenedor de listado de facturas
    listadoFacturas.innerHTML = '';

    // Agregar la lista al contenedor
    listadoFacturas.appendChild(ul);

    // Agregar botón para volver al formulario de facturas
    const volverButton = document.createElement('button');
    volverButton.textContent = 'Volver al Formulario de Facturas';
    volverButton.addEventListener('click', volverAlFormularioFacturas);
    listadoFacturas.appendChild(volverButton);

}

const volverAlFormularioFacturas=()=>{
    const facturasForm = document.getElementById('facturas-form');
    const listadoFacturas = document.getElementById('listado-facturas');

    // Ocultar listado de facturas
    listadoFacturas.style.display = 'none';

    // Mostrar formulario de facturas
    facturasForm.style.display = 'block';
   

}
// Configura AWS S3
AWS.config.update({
    accessKeyId: '********', 
    secretAccessKey: '**********',
    sessionToken: '*******************',
    region: 'us-east-1'
});

const s3 = new AWS.S3();
const bucketName = 'myimagenesmujica';


document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const idNumber = document.getElementById('idNumber').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0];

    if (photo) {
        // Subir la photo a S3
        const params = {
            Bucket: bucketName,
            Key: photo.name,
            Body: photo
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Error subiendo el archivo:', err);
            } else {
                console.log('Archivo subido con éxito:', data.Location);
                (firstName, lastName, idNumber, email, data.Location);
            }
        });
    } else {
        // enviar los datos sin la URL de la photo
        enviarDatos(firstName, lastName, idNumber, email, "");
    }
});

const enviarDatos = (firstName, lastName, idNumber, email,photoUrl ) => {
    const data = {
        TableName: 'usuario',  
        Item: {
            firstName: firstName,
            lastName: lastName,
			idNumber: idNumber,
            email: email,
            photo: photoUrl // URL de la photo
        }
    };
  
    // Enviar datos a la API Gateway
    fetch('https://dvgxskfwkl.execute-api.us-east-1.amazonaws.com/default/formulario', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Registro exitoso:', data);
        
    })
    .catch(error => {
        console.error('Error en el registro:', error);
    });
};

   
function cargarRegistros() {
	fetch('https://dvgxskfwkl.execute-api.us-east-1.amazonaws.com/default/formulario?TableName=usuario', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        const registros = data.Items;
        const listaRegistros = document.getElementById('lista-registros');
        listaRegistros.innerHTML = '';  

        registros.forEach(registro => {
            const fila = listaRegistros.insertRow();
            
            const celdafirstName = fila.insertCell(0);
            const celdalastName = fila.insertCell(1);
            const celdaidNumber = fila.insertCell(2);
            const celdaemail = fila.insertCell(3);
            const celdaphoto = fila.insertCell(4);
            
            celdafirstName.textContent = registro.firstName;
            celdalastName.textContent = registro.lastName;
            celdaidNumber.textContent = registro.idNumber;
            celdaemail.textContent = registro.email;

            if (registro.photo) {
                const photoImg = document.createElement('img');
                photoImg.src = registro.photo;
                photoImg.width = 50;
                celdaphoto.appendChild(photoImg);
            }
        });
    })
    .catch(error => {
        console.error('Error al cargar los registros:', error);
    });
}

function mostrarSeccion(idSeccion) {
    document.getElementById('seccion-formulario').style.display = 'none';
    document.getElementById('seccion-lista').style.display = 'none';
    document.getElementById(idSeccion).style.display = 'block';
}

mostrarSeccion('seccion-formulario');

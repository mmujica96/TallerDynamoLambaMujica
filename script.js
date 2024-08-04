document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const idNumber = document.getElementById('idNumber').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0];

    if (!photo) {
        document.getElementById('message').textContent = 'Por favor, sube una foto.';
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onloadend = function() {
        const formData = {
            TableName: 'usuario',
	    Item: {
		firstName: firstName,
            	lastName: lastName,
            	idNumber: idNumber,
            	email: email,
            	photo: reader.result.split(',')[1] 
		}// Convert image to Base64
        };

        fetch('https://dvgxskfwkl.execute-api.us-east-1.amazonaws.com/default/formulario', {  
            method: 'POST',
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('message').textContent = 'Registro exitoso!';
                document.getElementById('registerForm').reset();
                fetchRecords();
            } else {
                document.getElementById('message').textContent = 'Error en el registro.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message').textContent = 'Error en el registro.';
        });
    };
});

function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    const tablinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';

    if (tabName === 'Records') {
        fetchRecords();
    }
}

function fetchRecords() {
    fetch('https://dvgxskfwkl.execute-api.us-east-1.amazonaws.com/default/formulario?TableName=usuario')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('recordsTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';
        data.records.forEach(record => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = record.firstName;
            row.insertCell(1).textContent = record.lastName;
            row.insertCell(2).textContent = record.idNumber;
            row.insertCell(3).textContent = record.email;
            const imgCell = row.insertCell(4);
            const img = document.createElement('img');
            img.src = record.photoUrl;
            img.alt = 'Foto';
            img.width = 50;
            imgCell.appendChild(img);
        });
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.tablink').click();
});

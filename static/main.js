document.addEventListener('DOMContentLoaded', () => {

    const searchbar = document.getElementById('search-bar'); // tomamos la barra de busqueda
    const servantLinks = document.querySelectorAll('.details_link'); // tomamos los link
    const filterbutton = document.getElementById('button-filter'); //tomamos el boton de filtros
    const sidebar = document.getElementById('sidebar'); //tomamos el sidebar


    

    filterbutton.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-visible');

    });


    searchbar.addEventListener('input', () => {   // esperamos un input en la barra
        const textoBusqueda = searchbar.value.toLowerCase();     // extraemos la cadena de caracteres en lower case 

        servantLinks.forEach(link => {
            const servantCard = link.querySelector('.servant_card');
            const nombreDeLaTarjeta = servantCard.dataset.name; 

            if (nombreDeLaTarjeta.includes(textoBusqueda)) {
                link.style.display = 'block';
            } else {
                link.style.display = 'none';
            }
        });
    });
});
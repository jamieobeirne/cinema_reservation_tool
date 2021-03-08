/*James O’Beirne
M4.254 - Desarrollo front-end con framew. JavaScript aula 2
PEC1 - Introducción al desarrollo frontend
07 de Marzo de 2021*/

const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movie_list_select = document.getElementById('movie_list_select');
const new_currency = document.getElementById('new_currency');
const price = document.getElementById('price');

let ticket_price = parseInt(movie_list_select.value, 10); //+movie_list_select.value

populateUI();




//functions
//save selected movie index and price
function setMovieData(index, price) {
    localStorage.setItem('selected_movie_index', index);
    localStorage.setItem('selected_movie_price', price);
}

//update count
function updateCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    //spread operator converts seatIndex to array
    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const node_list_count = selectedSeats.length;
    count.innerText = node_list_count;
    total.innerText = node_list_count * ticket_price;
}

//pulls values from Local Storage and populates the UI/DOM
function populateUI() {
    const local_storage_seats = JSON.parse(localStorage.getItem("selectedSeats"));
    if (local_storage_seats !== null && local_storage_seats.length > 0) {
        seats.forEach((seat, index) => {
            if (local_storage_seats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
        });
    }

    const local_storage_movie_index = localStorage.getItem("selected_movie_index");
    if (local_storage_movie_index !== null) {
        movie_list_select.selectedIndex = local_storage_movie_index;
    }
}


//Fetch exchange rate and update DOM
function calculate() {
    const new_currency_name = new_currency.value
    async function fetch_exchange_rate() {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/ab65beff42352a8196716086/latest/USD`);
        const exchange_rate = await response.json();
        return exchange_rate;
    }

    //inserts rate and amount 
    fetch_exchange_rate().then(json_data => {
        const rate = json_data.conversion_rates[new_currency_name];
        const price_change = (rate * movie_list_select.value).toFixed(2);
        const current_index = movie_list_select.selectedIndex;
        const movie_text = movie_list_select.options[current_index].innerText;

        let split_movie_title = movie_text.split(" ");
        let sliced_movie_title = split_movie_title.slice(0, split_movie_title.length - 1).join(" ") + " ";

        movie_list_select.options[current_index].innerHTML = `<option value= ${rate}> ${sliced_movie_title} ${price_change}${new_currency_name}</option>`
        ticket_price = price_change;
        updateCount()

    });
}


//event listeners
movie_list_select.addEventListener("change", movie_selected => {
    const new_ticket_price = parseInt(movie_list_select.value, 10);
    const index_of_current_movie = movie_selected.target.selectedIndex
    ticket_price = new_ticket_price;
    setMovieData(index_of_current_movie, ticket_price)
    calculate()
    updateCount()
});


//checks clicked element and calls updateCount
container.addEventListener("click", element_clicked => {
    if (element_clicked.target.classList.contains('seat') && !element_clicked.target.classList.contains('occupied')) {
        element_clicked.target.classList.toggle('selected');
        updateCount();
    };
});


new_currency.addEventListener("change", calculate);

//initial count and total set
updateCount()







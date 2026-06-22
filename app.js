const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const movieContainer = document.getElementById("movieContainer");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const themeBtn = document.getElementById("themeBtn");
const suggestions = document.getElementById("suggestions");

const API_KEY = "9ee80a97";

/* Search Button */

searchBtn.addEventListener("click", () => {

    const movie = movieInput.value.trim();

    if(movie){
        getMovie(movie);
    }

});

/* Enter Key */

movieInput.addEventListener("keypress", e => {

    if(e.key === "Enter"){
        searchBtn.click();
    }

});

/* Theme Toggle */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

});

/* Get Single Movie */

async function getMovie(title){

    loading.classList.remove("hidden");
    error.classList.add("hidden");

    movieContainer.innerHTML = "";

    try{

        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`
        );

        const data = await response.json();

        if(data.Response === "False"){
            throw new Error();
        }

        displayMovie(data);

    }

    catch{

        error.classList.remove("hidden");

    }

    finally{

        loading.classList.add("hidden");

    }

}

/* Display Movie */

function displayMovie(movie){

    movieContainer.innerHTML = `

    <div class="movie-card">

        <img
        src="${movie.Poster}"
        alt="${movie.Title}"
        >

        <div class="movie-info">

            <h2>${movie.Title}</h2>

            <p><b>Year:</b> ${movie.Year}</p>

            <p><b>Genre:</b> ${movie.Genre}</p>

            <p><b>IMDb Rating:</b> ${movie.imdbRating}</p>

            <p><b>Runtime:</b> ${movie.Runtime}</p>

            <p><b>Plot:</b> ${movie.Plot}</p>

        </div>

    </div>

    `;

}

/* Popular Movies */

window.addEventListener("load", () => {

    loadPopularMovies();

});

async function loadPopularMovies(){

    const movies = [
        "Interstellar",
        "Inception",
        "The Dark Knight",
        "Avatar"
    ];

    const container =
    document.getElementById("suggestedMovies");

    container.innerHTML = "";

    for(const title of movies){

        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`
        );

        const movie = await response.json();

        container.innerHTML += `

        <div class="suggestion-card">

            <img
            src="${movie.Poster}"
            alt="${movie.Title}"
            >

            <p>${movie.Title}</p>

        </div>

        `;

    }

    document
    .querySelectorAll(".suggestion-card")
    .forEach(card=>{

        card.addEventListener("click",()=>{

            const movie =
            card.querySelector("p").textContent;

            movieInput.value = movie;

            getMovie(movie);

        });

    });

}

/* Auto Suggestions */

movieInput.addEventListener("input", async () => {

    const query = movieInput.value.trim();

    if(query.length < 2){

        suggestions.innerHTML = "";
        return;

    }

    const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );

    const data = await response.json();

    suggestions.innerHTML = "";

    if(data.Search){

        const uniqueMovies = [
            ...new Map(
                data.Search.map(movie => [
                    movie.Title,
                    movie
                ])
            ).values()
        ];

        uniqueMovies.slice(0,5).forEach(movie => {

            const item =
            document.createElement("div");

            item.classList.add("suggestion-item");

            item.textContent =
            `${movie.Title} (${movie.Year})`;

            item.addEventListener("click", () => {

                movieInput.value =
                movie.Title;

                suggestions.innerHTML = "";

                getMovie(movie.Title);

            });

            suggestions.appendChild(item);

        });

    }

});
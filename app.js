const searchInput = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");

//section 1 info
const pokemonName = document.getElementById("nameText");
const pokemonID = document.getElementById("idText");
const pokemonImgSection = document.getElementById("pokemonImgSection");

//footer
const weight = document.getElementById("weight");
const height = document.getElementById("height");

//types
const typesContainer = document.getElementById("typesContainer");

//section 2
const statsContainer = document.getElementById("subsection");

//buttons
const shinyButton = document.getElementById("shinyButton");
const flipButton = document.getElementById("flipButton");

let isShiny = false;
let isFlipped = false;

const backgroundSVG = `<svg class="pokeballBG" width="450" height="545" viewBox="0 0 450 545" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H450V545H0V0Z" fill="#F4F4F4"/>
                    <path d="M405 273C405 372.411 324.411 453 225 453C125.589 453 45 372.411 45 273C45 173.589 125.589 93 225 93C324.411 93 405 173.589 405 273Z" fill="#D9D9D9"/>
                    <path d="M300 273C300 314.421 266.421 348 225 348C183.579 348 150 314.421 150 273C150 231.579 183.579 198 225 198C266.421 198 300 231.579 300 273Z" fill="white"/>
                    <path d="M45.171 265H150.422L150 273L150.422 281L151.5 288L153.278 295H46.3242L45.5 287.5L45 280V272.5L45.171 265Z" fill="white"/>
                    <path d="M404.829 265H299.578L300 273L299.63 280.5L298.5 287.999L296.722 295H403.676L404.5 287.5L405 280V272.5L404.829 265Z" fill="white"/>
                </svg>`

const pokemonList = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon`

// API = https://pokeapi-proxy.freecodecamp.rocks/api/pokemon
const fetchData = async () => {
    try {
        const res = await fetch(pokemonList);
        const data = await res.json();
        console.log(data)
    } catch (err) {
        console.log(err);
    }
}
const fetchSpecificPokemon = async () => {
    try {
        const res = await fetch(pokemonList + "/" + searchInput.value);
        const data = await res.json();
        
        const pokemonInfo = getPokemonInfo(data);
        return pokemonInfo

    } catch (err) {
        console.log(err)
    }
    
}
const getPokemonInfo = (data) => {
    const info = {
        header: {
            name: data.name,
            id: data.id
        },
        footer: {
            height: data.height,
            weight: data.weight,
            types: data.types
        },
        imgs: {
            normal: {
                front: data.sprites.front_default,
                back: data.sprites.back_default,
            },
            shiny: {
                front: data.sprites.front_shiny,
                back: data.sprites.back_shiny
            }
        },
        stats: data.stats
    };
    return info;
}



const setInfo = async () => {
    const pokemonInfo = await fetchSpecificPokemon();
    // info
    footerInfo = pokemonInfo.footer;
    headerInfo = pokemonInfo.header;
    weight.innerHTML = `Weight: ${footerInfo.weight}`;
    height.innerHTML = `Height: ${footerInfo.height}`;
    pokemonID.innerHTML = `#${headerInfo.id}`;
    pokemonName.innerHTML = `${headerInfo.name.charAt(0).toUpperCase() + headerInfo.name.slice(1)}`
    setImg();
    setStats();   
    setTypes();
}
const setImg = async () => {
    const pokemonInfo = await fetchSpecificPokemon();
    const imgObj = pokemonInfo.imgs;
    if(!isFlipped && !isShiny){
        pokemonImgSection.innerHTML = `
            ${backgroundSVG}
            <img class="pokemonImg" src="${imgObj.normal.front}">
        `
    } else if(!isFlipped && isShiny){
        pokemonImgSection.innerHTML = `
            ${backgroundSVG}
            <img class="pokemonImg" src="${imgObj.shiny.front}">
        `
    } else if(isFlipped && !isShiny){
        pokemonImgSection.innerHTML = `
            ${backgroundSVG}
            <img class="pokemonImg" src="${imgObj.normal.back}">
        `
    } else {
        pokemonImgSection.innerHTML = `
            ${backgroundSVG}
            <img class="pokemonImg" src="${imgObj.shiny.back}">
        `
    }
}
const setStats = async () => {

    const pokemonInfo = await fetchSpecificPokemon();
    const stats = pokemonInfo.stats;
    statsContainer.innerHTML = "";
    stats.forEach(stat => {
        const checkArr = stat.stat.name.split("-");
        let statName = "";
        if(checkArr.length > 1){
            statName = `SP ${checkArr[1].charAt(0).toUpperCase() + checkArr[1].slice(1)}`
        }else{
            statName = checkArr[0].charAt(0).toUpperCase() + checkArr[0].slice(1)
        }
        statsContainer.innerHTML += `
            <div class="stat">
                    <div class="base">
                        <p>${statName}:</p>
                    </div>
                    <div class="number">
                        <p>${stat.base_stat}</p>
                    </div>
                </div>
        `
    })
}
const fetchImg = async (imgUrl) => {
    try {
        const res = await fetch(imgUrl);
        const data = await res.json();
        const sprites = data.sprites;
        const gen = Object.keys(sprites)[2];
        const img = sprites[gen]["scarlet-violet"].name_icon;
        return img;
    } catch (err) {
        console.log(err);
    }
};

const setTypes = async () => {
    const pokemonInfo = await fetchSpecificPokemon(); // Ensure this returns the expected structure
    const types = pokemonInfo.footer.types;

    // Create an array of promises
    const typeIcons = await Promise.all(types.map(async (type) => {
        // Await the fetchImg call to get the actual URL
        const typeIcon = await fetchImg(type.type.url);
        return typeIcon;
    }));
    typesContainer.innerHTML = "";
    // Now you can use the typeIcons array to update the innerHTML
    typeIcons.forEach((icon) => {
        // Assuming icon is the URL of the image returned by fetchImg
        typesContainer.innerHTML += `
            <img class="iconImg" src="${icon}" alt="Type icon">
        `;
    });
};

searchButton.addEventListener("click", setInfo);
shinyButton.addEventListener("click", () => {
    isShiny = !isShiny;
    setImg()
})
flipButton.addEventListener("click", () => {
    isFlipped = !isFlipped;
    setImg();
})
//const { response } = require("express")

// add our markup to the page
const root = document.getElementById('root')

let store = {
    apod: ''
}
const updateStore = (store, newState) => {
	store = Object.assign(store, newState)
	render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const App = (state) => {
    let { apod } = state;
    return `
        <section id="imageOfDay">
            ${ImageOfTheDay(apod)}
        </section>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})
// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <div class="apod">
                <p>See today's featured video <a href="${apod.url}">here</a></p>
                <p>${apod.title}</p>
                <p>${apod.explanation}</p>
            </div>
        `)
    } else {
        return (`
        <div class="image">
        	<p class="title">Astronomy Picture of the Day: ${apod.title}</p>
          <img src="${apod.url}" class="apodPhoto"/>
        </div>
				<div class="description">
					<p>${apod.explanation}</p>
				</div>  
        `)
    }
}

const getImageOfTheDay = (state) => {
    let { apod } = state
    let err
    fetch(`https://api.nasa.gov/planetary/apod?api_key=mbhLMB38eAG1VCORnGfymBsxlHnridCeGhOryd4N`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
        .catch(err)  
    return apod
}

async function fetchGallery(roverName) {
	roverInfoDetails(roverName);
	const res = await fetch(`/nasaAPI`, {
			headers: {
					'roverName': roverName,
			}
	});
	let RoverData = await res.json();
	if (RoverData) {
			return processRoverGallery(RoverData);
	}
	return RoverData;
}

function processRoverGallery(responseData) {
	let rover = responseData;
	const toShow =  rover.data.photos.slice(0, 50);
		const wrapper = document.getElementById('image-gallery');
		wrapper.innerHTML = ``;
		toShow.map((item) => {
				let img = document.createElement('img');
				img.src = item.img_src;
				wrapper.appendChild(img);
		})
}

function roverInfo(info) {

	const wrapInfo = document.getElementById('roverInfo');
	wrapInfo.innerHTML = ``;
	const newDiv = document.createElement('div');
	newDiv.className = 'card-body';
	newDiv.innerHTML = `
		<h6><b>Rover name:</b> ${info.name}</h6>
		<h6><b>Launch date:</b> ${info.launch_date}</h6>
		<h6><b>Landing date:</b> ${info.landing_date}</h6>
		<h6><b>Status:</b> ${info.status}</h6>
		<h6><b>Most recently available photos:</b> ?</h6>
		<h6><b>Date the most recent photos were taken:</b> ?</h6>
		`;
	wrapInfo.appendChild(newDiv)

}

function roverInfoDetails(roverName) {
	fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}?api_key=mbhLMB38eAG1VCORnGfymBsxlHnridCeGhOryd4N`)
	.then(res => res.json())
	.then(res => {
		let info = res
		const infoToShow = info.photo_manifest

		const wrapInfo = document.getElementById('roverInfo');
		wrapInfo.innerHTML = ``;
		const newDiv = document.createElement('div');
		newDiv.className = 'card-body';
		newDiv.innerHTML = `
			<h6><b>Rover name:</b> ${infoToShow.name}</h6>
			<h6><b>Launch date:</b> ${infoToShow.launch_date}</h6>
			<h6><b>Landing date:</b> ${infoToShow.landing_date}</h6>
			<h6><b>Status:</b> ${infoToShow.status}</h6>
			<h6><b>Most recently available photos:</b>${infoToShow.max_sol}</h6>
			<h6><b>Date the most recent photos were taken:</b>${infoToShow.max_date}</h6>
			`;
		wrapInfo.appendChild(newDiv)
	})
}


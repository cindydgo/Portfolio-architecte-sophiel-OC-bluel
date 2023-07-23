const URLApi = 'http://localhost:5678/api/'
const gallery = document.getElementById('gallery')

async function fetchData() {
    try {
        const res = await fetch(`${URLApi}works`)

        if (!res.ok) {
            const message = `Error with status: ${res.status}`
            throw new Error(message)
        }

    const data = await res.json()
    renderGallery(data)
    } catch (err) {alert (`Error : ${err}`)}
}

function renderGallery(images){
    let output = ""
    for (const image of images) {
        output += `
            <figure>
            <img src="${image.imageUrl}" alt="${image.title}">
            <figcaption>${image.title}</figcaption>
            </figure>`
    }
    gallery.innerHTML = output
}

fetchData()
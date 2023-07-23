const URLApi = 'http://localhost:5678/api/'
const gallery = document.getElementById('gallery')
const galleryFilters = document.getElementById('galleryFilters')
//will store data fetch from api 
let worksData = new Set ()

async function fetchData() {
    try {
        const res = await fetch(`${URLApi}works`)

        if (!res.ok) {
            const message = `Error with status: ${res.status}`
            throw new Error(message)
        }

    const data = await res.json()
    for (const dat of data) {
        worksData.add(dat)
    }

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

async function fetchCategories() {
    try {
        const res = await fetch(`${URLApi}categories`)

        if (!res.ok) {
            const message = `Error with status: ${res.status}`
            throw new Error(message)
        }

    const categories = await res.json()
    return categories
    } catch (err) {alert (`Error : ${err}`)}
}

fetchCategories().then(categories => {
    for (let category of categories) {
        const filterBtn = document.createElement('button')
        filterBtn.classList.add('categories')
        filterBtn.innerText = category.name
        filterBtn.setAttribute('data-category-id', category.id)
        galleryFilters.appendChild(filterBtn)
        filterBtn.addEventListener("click", (e) => {
            //works fetch from api and convert into an array
            let works = Array.from(worksData)
            let target =  e.target
            removeActiveClass()
            target.classList.add('active')
            const filterData = works.filter(work => {
                return work.categoryId === category.id
            }) 
            renderGallery(filterData)
        })
    }
})

function removeActiveClass() {
    const categoriesBtn = document.querySelectorAll('.categories')
    categoriesBtn.forEach(button => button.classList.remove('active'))
}

function displayAllWorks() {
    const allCategoriesBtn = document.getElementById('all-categories-btn')
    const allWorks = Array.from(worksData)
    removeActiveClass()
    allCategoriesBtn.classList.add('active')
    renderGallery(allWorks)
}

fetchData()
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

async function adminLogin() { 
    const tokken = localStorage.getItem('token')
    console.log(tokken)
    if (tokken) {
        galleryFilters.style.display = "none"
        topEditionMode()
        modifyProjects(figureIntro)
        modifyProjects(myPortfolioTitle)
        logout()
    }
}

function topEditionMode() {
    const header = document.getElementById('home-page-header')
    const headerEdition = document.getElementById('headerEdition')
    const headerDiv = document.createElement('div')
    header.prepend(headerDiv)
    header.style.marginTop = "100px"
    headerDiv.classList.add('black-header')
    headerEdition.style.display = "flex"
}

function modifyProjects(parent) {
    const modifyProjectsText = document.createElement('div')
    modifyProjectsText.style.display = "flex"
    modifyProjectsText.style.gap = "10px"
    modifyProjectsText.style.cursor = "pointer"
    modifyProjectsText.innerHTML =`<i class="fa-regular fa-pen-to-square"></i><p>modifier</p>`
    parent.appendChild(modifyProjectsText)
}

function logout() {
    const logOutBtn = document.getElementById("login") 
    logOutBtn.innerText = "logout"
    logOutBtn.addEventListener("click", () => {
        window.localStorage.removeItem("token")
        window.location.href = "./index.html"
    })
}

fetchData()
adminLogin()
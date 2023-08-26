const url = 'http://localhost:5678/api/'
const modal1 = document.getElementById('modal1') 
const modal2 = document.getElementById('modal2') 
const modalGallery = document.getElementById('modalGallery')
const submitPhotoBtn = document.getElementById('submitPhotoBtn')
const leftArrow = document.getElementById('leftArrow')
const modalForm = document.getElementById('modalForm')
const filePreview = document.getElementById('filePreview')
const blueFileContainer = document.getElementById('blueFileContainer')
const submitFormBtn = document.getElementById('submitFormBtn')

function closeModal(modal) {
    const closeModalBtn = document.querySelectorAll('.close-modal-btn')
    closeModalBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            modal.removeAttribute('aria-modal')
            modal.close()
            resetForm()
        })
    })
}

//if users click on any modify button then first modal is display
function modifyProjects() {
    const modifyProjectsBtn = document.querySelectorAll('.modify-projects')
    modifyProjectsBtn.forEach(btn => {
        btn.addEventListener("click", () => { 
            modal1.showModal()
        })
    })
}

async function fetchModalMedias() {
    try {
        const res = await fetch(`${url}works`)

        if (!res.ok) {
            const message = `Error with status: ${res.status}`
            throw new Error(message)
        }

    const data = await res.json()

    renderModalGallery(data)
    } catch (err) {console.log (`Error : ${err}`)}
}

function renderModalGallery(medias) {
    let result = ""
    for (const media of medias) {
    result += `
    <figure class="modal-figure">
        <div class="modal-images">
            <img src="${media.imageUrl}" alt="${media.title}" class="modal-image" data-id="${media.id}">
            <img src="./assets/icons/delete_trash-can.png" class="delete-icons" data-id="${media.id}">
        </div>
        <figcaption>éditer</figcaption>
        </figure>`
    }
    modalGallery.innerHTML = result
    createMoveBtn()
    deleteWork() 
}

function createMoveBtn() {
    const modalImage = document.querySelector('.modal-images')
    const moveBtn = document.createElement('img')
    moveBtn.src = "./assets/icons/Move.png"
    moveBtn.classList.add('move-btn')
    modalImage.appendChild(moveBtn)
}

function deleteWork() {
    const projects = Array.from(document.querySelectorAll(".modal-image"))
    const projectsId = projects.map(project => project.dataset.id)
    const deleteWorkIcons = document.querySelectorAll('.delete-icons')
    deleteWorkIcons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            for (const projectId of projectsId) {
                if(btn.dataset.id === projectId) {
                    if(confirm("Êtes-vous sûr de vouloir le supprimer ?")) {
                        deletePost(e, projectId)
                        console.log(projectId)
                    }
                }
            }
        })
    })
}


//user will be able to delete work from server
async function deletePost(e, id) {
    e.preventDefault()
    const token = JSON.parse(localStorage.getItem('token'))
    console.log(token)
    const figure = e.target.parentNode.parentNode
    
    try {
        const res = await fetch(`${url}works/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` },
        })

// SERVER STATUS RESPONSE OK
        if (res.ok) {
            figure.remove()
            console.log(figure)
// ERROR SERVER STATUS RESPONSE 
        } else if (res.status === 401) {
            alert("Accès non autorisé, vous allez etre redirigé vers la page de connexion.")
        } else if (res.status === 500) {
            alert("Une erreur innatendue s'est produite.");
        }

// CATCH ERRORS
    } catch (err) {console.log (`Error : ${err}`)}
}

function showModals(first, second) {
    first.close()
    second.showModal()
}

submitPhotoBtn.addEventListener("click", () => {
    showModals(modal1, modal2)
})

//redirect user from second modal to first modal 
leftArrow.addEventListener("click", () => {
    showModals(modal2, modal1) 
})

async function fetchCategories() {
    try {
        const res = await fetch(`${url}categories`)

        if (!res.ok) {
            const message = `Error with status: ${res.status}`
            throw new Error(message)
        }

    const categories = await res.json()
    return categories
    } catch (err) {console.log (`Error : ${err}`)}
}

//create categories options in the second modal
fetchCategories().then(categories => {
    for (let category of categories) {
        const selectCategory = document.getElementById('selectCategory')
        const categoryOption = document.createElement('option')
        categoryOption.innerText = category.name
        //categoryOption.categoryId = category.id
        categoryOption.value = category.id
        categoryOption.id = category.id
        selectCategory.appendChild(categoryOption)
    }
})

//specify which type and size of files is accepted
function fileTypeSize(event) {
    const [ file ] = event.target.files
    const sizeMax = 4194304
    if (!file) return

    const { size, type } = file

    if (size > sizeMax) {
        alert ("Le fichier dépasse la taille maximale autorisée de 4mo")
    } else if (type !== "images/jpg" && type !== "images/png") {
        alert("Seuls les fichiers jpg et png sont autorisées!")
    }
}

function loadFile(event) {
    const [ file ] = event.target.files
    const sizeMax = 4194304
    if(file && file.size <= sizeMax) {   
    var reader = new FileReader()
    reader.onload = () => {
    filePreview.src = reader.result
    blueFileContainer.style.display = "none"
    filePreview.style.display = "flex"
    } 
    reader.readAsDataURL(event.target.files[0])
    } else {
        fileTypeSize(event)
    }
}

//Function to check if all the fields are filled in and change the color of the submit button accordingly
function checkForm() {
    const titleValue = document.getElementById('formTitle').value
    const categoryValue = document.getElementById("selectCategory").value
    const imageInput = document.getElementById("file").files[0]
    if (titleValue !== "" && categoryValue !== "" && imageInput !== undefined) {
        submitFormBtn.style.backgroundColor = "#1D6154"
        submitFormBtn.disabled = false
    } else {
        submitFormBtn.style.backgroundColor = "#A7A7A7"
    }
}

//reset file input
function resetForm() {
    filePreview.style.display = "none"
    blueFileContainer.style.display = "flex"
    modalForm.reset()
    checkForm()
}

async function sendWorks(e) {
    e.preventDefault()
    
    const tokken = JSON.parse(localStorage.getItem('token'))
    
    var title = document.getElementById('formTitle').value
    var category = document.getElementById("selectCategory").value
    console.log("hello",category);
    var image = document.getElementById("file").files[0]
    //function stop running if values different than title, category or image 
    if(!title || !category || !image) {
        alert("Merci de remplir tous les champs.")
        return
    } 
    
    var formData = new FormData()
    formData.append("title", title)
    formData.append("category", category)
    formData.append("image", image)
    
    for( let [name, value] of formData) {
        console.log(`${name} = ${value}`)
    }
    
    try {
        const urlPost = modalForm.action
        const res = await fetch(urlPost, {
            method: "POST",
            headers: { 
                Authorization: `Bearer ${tokken}`,
            },
            body: formData
        })
        
// SERVER STATUS RESPONSE OK
        if (res.ok) {
            showModals(modal2, modal1) 
            await fetchModalMedias()
            resetForm()
        } else {
            alert("Une erreur s'est produite. Veuillez réessayer plus tard.")
        }

    } catch (err) {console.log (`Error : ${err}`)}
}

modalForm.addEventListener("input", checkForm)
modalForm.addEventListener("submit", sendWorks)

fetchModalMedias()
modifyProjects()
closeModal(modal1)
closeModal(modal2)

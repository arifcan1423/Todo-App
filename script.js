"use strict";

let gorevListesi = [];

// discribing

const taskInput = document.querySelector("#txtTaskName");
const addBtn = document.querySelector(".addBtn");
const filters = document.querySelectorAll(".filters span");
const span_active = document.querySelector("span.active");
const clearBtn = document.querySelector(".clearBtn");
const ul = document.querySelector(".task-list");
const deleteBtn = document.querySelector("#deleteBtn");
const updateBtn = document.querySelector("#updateBtn");


if(JSON.parse(localStorage.getItem("gorevListesi") !== null)){
    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

function setItemToLocalStorage(){
    localStorage.setItem("gorevListesi",JSON.stringify(gorevListesi));
}

let editId;
let isEditTask = false;
displayTask("all");

function displayTask(filter){
    ul.innerHTML ="";
    if(gorevListesi.length == 0){
        ul.innerHTML = '<p class="free-task p-3 m-0">Görev Listeniz Boş!</p>';
    }
    else{
        for(let gorev of gorevListesi){
            if(filter == gorev.durum || filter == "all" ){
            
                let completed = gorev.durum == "completed"? "checked":"";
                let li = `
                <li class="task task-item">
                  <div class="form-check">
                    <input onclick="updateStatus(this)" type="checkbox" id="${gorev.id}" class="form-check-input" ${completed}>
                    <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevAdi}</label>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" id="dropdown-button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#" id="deleteBtn"><i class="fa-solid fa-trash"></i> Sil</a></li>
                      <li><a onclick="editTask(${gorev.id},'${gorev.gorevAdi}')" class="dropdown-item" href="#" id="updateBtn"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
                    </ul>
                  </div>
                </li>
                `;
    
                ul.insertAdjacentHTML("beforeend",li);
            }
        }
    }
}

for(let span of filters){
    span.addEventListener("click",function(){
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTask(span.id);
    })
}

addBtn.addEventListener("click",newTask);
taskInput.addEventListener("keypress",function(event){
    if(event.key =="Enter"){
        addBtn.click();
    }
})
function newTask(event){
    if((taskInput.value).trim()== ""){
        alert("Lütfen görev giriniz!");
    }
    else{
        if(!isEditTask){
            //adding
            gorevListesi.push({"id":gorevListesi.length+1,"gorevAdi":taskInput.value,"durum":"pending"});
        }
        else{
            //updating
            for(let gorev of gorevListesi){
                if(gorev.id == editId){
                    gorev.gorevAdi = taskInput.value;
                }
                isEditTask = false;
            }
        }
        taskInput.value ="";
        displayTask(span_active.id);
        setItemToLocalStorage();
    }

    event.preventDefault();
}

clearBtn.addEventListener("click",clearAll);

function clearAll(){
    gorevListesi.splice(0,gorevListesi.length);
    displayTask();
    setItemToLocalStorage();
}

function deleteTask(id){
    let deletedId;
    for(let index in gorevListesi){
        if(gorevListesi[index].id == id){
            deletedId = index;
            gorevListesi.splice(deletedId,1);
            displayTask(span_active.id);
            setItemToLocalStorage();
        }
    }
}

function editTask(id,gorevAdi){
    editId = id; 
    isEditTask = true;
    taskInput.value = gorevAdi;
    taskInput.focus();
    taskInput.classList.add("active");
}

function updateStatus(selectedTask){
    let label = selectedTask.nextElementSibling;
    let durum;

    if(selectedTask.checked){
        label.classList.add("checked");
        durum = "completed";
    }

    else{
        label.classList.remove("checked");
        durum = "pending";
    }

    for(let gorev of gorevListesi){
        if(gorev.id == selectedTask.id){
            gorev.durum = durum ;
        }
    }

    displayTask(span_active.id);
    setItemToLocalStorage();
}


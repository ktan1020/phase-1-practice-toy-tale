let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  //create toy button
  fetchToys();
  //add toy form listener
  addToyFormListener();
});

function fetchToys(){
  fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(toys => renderToys(toys))
};

function renderToys(toys) {
  const collectionDiv = document.getElementById("toy-collection");
  collectionDiv.innerHTML = "";
  toys.forEach(toy => renderToy(toy, collectionDiv));
}

function renderToy(toy, collectionDiv){
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  collectionDiv.appendChild(card);

  const likeBtn = card.querySelector(".like-btn");
  const likesP = card.querySelector("p");

  likeBtn.addEventListener("click", () => {
    let newLikes = toy.likes + 1;

    // update DOM immediately
    likesP.textContent = `${newLikes} Likes`;

    // send PATCH request
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(resp => resp.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes; // sync local toy object
      })
      .catch(() => {
        // rollback if server fails
        likesP.textContent = `${toy.likes} Likes`;
        alert("Error updating likes. Please try again.");
      });
  })  
}

function addToyFormListener() {
  const form = document.querySelector(".add-toy-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = { name, image, likes: 0 };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
      })
      .then(resp => resp.json())
      .then(toy => {
        const collectionDiv = document.getElementById("toy-collection");
        renderToy(toy, collectionDiv); // single toy renderer
        form.reset();
      });
  });
}
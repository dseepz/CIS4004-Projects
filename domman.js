"use strict";

// show filter checkboxes, hide new article form
function showFilter() {
  const filterForm = document.getElementById("filterContent");
  const newForm = document.getElementById("newContent");

  filterForm.style.display = "block";
  newForm.style.display = "none";
}

// show new article form, hide filter checkboxes
function showAddNew() {
  const filterForm = document.getElementById("filterContent");
  const newForm = document.getElementById("newContent");

  filterForm.style.display = "none";
  newForm.style.display = "flex";
}

// hide/show articles based on checkboxes
function filterArticles() {
  const showOpinion = document.getElementById("opinionCheckbox").checked;
  const showRecipe = document.getElementById("recipeCheckbox").checked;
  const showUpdate = document.getElementById("updateCheckbox").checked;

  toggleType("opinion", showOpinion);
  toggleType("recipe", showRecipe);
  toggleType("update", showUpdate);
}

function toggleType(className, shouldShow) {
  const articles = document.querySelectorAll("article." + className);

  for (let a of articles) {
    a.style.display = shouldShow ? "" : "none";
  }
}

// add a new article to the list
function addNewArticle() {
  const title = document.getElementById("inputHeader").value;
  const text = document.getElementById("inputArticle").value;

  // figure out which radio is selected
  let articleClass = "";
  let markerText = "";

if (document.getElementById("opinionRadio").checked) {
    articleClass = "opinion";
    markerText = "Opinion";
  } else if (document.getElementById("recipeRadio").checked) {
    articleClass = "recipe";
    markerText = "Recipe";
  } else if (document.getElementById("lifeRadio").checked) {
    articleClass = "update";
    markerText = "Update";
  } else {
    return; // stop if no type was selected
  }

  // create the main article element
  const newArticle = document.createElement("article");
  newArticle.classList.add(articleClass);

  // create the colored type label
  const marker = document.createElement("span");
  marker.classList.add("marker");
  marker.innerText = markerText;

  // create the title and text for the article
  const h2 = document.createElement("h2");
  h2.innerText = title;

  const pText = document.createElement("p");
  pText.innerText = text;

  const pLink = document.createElement("p");
  const link = document.createElement("a");
  link.href = "moreDetails.html";
  link.innerText = "Read more...";
  pLink.appendChild(link);

  // add all elements into the article
  newArticle.appendChild(marker);
  newArticle.appendChild(h2);
  newArticle.appendChild(pText);
  newArticle.appendChild(pLink);

  // add the new article to the page
  document.getElementById("articleList").appendChild(newArticle);

  document.getElementById("inputHeader").value = "";
  document.getElementById("inputArticle").value = "";
  document.getElementById("opinionRadio").checked = false;
  document.getElementById("recipeRadio").checked = false;
  document.getElementById("lifeRadio").checked = false;
}

window.showFilter = showFilter;
window.showAddNew = showAddNew;
window.filterArticles = filterArticles;
window.addNewArticle = addNewArticle;
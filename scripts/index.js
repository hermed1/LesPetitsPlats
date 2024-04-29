import { recipes } from '/recipes.js';
import { cardTemplate } from './factories/cardTemplate.js';
import { filterTemplate } from './factories/listItem.js';

let matchingRecipesSet = new Set(); // Utilise un Set pour éviter les doublons
let matchingRecipes = [];
let ingredientsList = [];
let appliancesList = [];
let ustensilsList = [];

//tester has pour le set

function searchRecipes() {
  const mainInput = document.querySelector('.search-input');
  const inputValue = mainInput.value;
  const errorMessage = document.querySelector('.error-message');

  if (inputValue.length > 2) {
    matchingRecipesSet.clear();
    // matchingRecipes = [];
    errorMessage.textContent = '';

    recipes.forEach((recipe) => {
      if (recipe.name.includes(inputValue)) {
        matchingRecipesSet.add(recipe);
      } else if (
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.includes(inputValue)
        )
      ) {
        matchingRecipesSet.add(recipe);
      } else if (recipe.description.includes(inputValue)) {
        matchingRecipesSet.add(recipe);
      }
    });

    if (matchingRecipesSet.size === 0) {
      // Aucune recette correspondante trouvée, afficher le message d'erreur
      errorMessage.textContent = `Aucune recette ne contient "${inputValue}". Vous pouvez chercher «tarte aux pommes», «poisson», etc.`;
      errorMessage.style.color = 'red';
    }
  } else {
    errorMessage.textContent = 'Veuillez entrer au moins 3 caractères';
    errorMessage.style.color = 'red';
  }

  matchingRecipes = [...matchingRecipesSet]; // Convertit le Set en tableau
  getIngredientsUtensilsAppliancesLists(matchingRecipes);
  displayRecipes();
  displayIngredientsList(ingredientsList);
  displayUstensilsList(ustensilsList);
  displayAppliancesList(appliancesList);
  displayTotalrecipes();
  return matchingRecipes; // Retourne un tableau
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', searchRecipes);
});

function getIngredientsUtensilsAppliancesLists(matchingRecipes) {
  let ingredientsSet = new Set();
  let appliancesSet = new Set();
  let ustensilsSet = new Set();
  if (Array.isArray(matchingRecipes)) {
    matchingRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        ingredientsSet.add(ingredient.ingredient);
      });
      appliancesSet.add(recipe.appliance);
      recipe.ustensils.forEach((ustensil) => {
        ustensilsSet.add(ustensil);
      });
    });
  }
  ingredientsList = [...ingredientsSet];
  appliancesList = [...appliancesSet];
  ustensilsList = [...ustensilsSet];
  return {
    ingredientsList,
    appliancesList,
    ustensilsList,
  };
}

function displayRecipes() {
  const recipesContainer = document.querySelector('.recipes-container');
  if (recipesContainer) {
    recipesContainer.innerHTML = '';
    matchingRecipes.forEach((recipe) => {
      const cardModel = cardTemplate(recipe);
      const recipeCard = cardModel.createRecipeCard();
      recipesContainer.appendChild(recipeCard);
    });
  }
}

// function displayIngredientsList(ingredientsList) {
//   const ingredientsListElement = document.querySelector('.ingredients-list');
//   if (ingredientsListElement) {
//     ingredientsListElement.innerHTML = '';
//     ingredientsListElement.textContent = 'Ingrédients';
//     const searchInput = document.createElement('input');
//     searchInput.setAttribute('type', 'text');
//     ingredientsListElement.appendChild(searchInput);
//     ingredientsList.forEach((ingredient) => {
//       const filterModel = filterTemplate(ingredient);
//       const ingredientItem = filterModel.createFilter();
//       ingredientsListElement.appendChild(ingredientItem);
//     });
//   }
// }
function displayIngredientsList(ingredientsList) {
  const ingredientsListElement = document.querySelector('.ingredients-list');
  if (ingredientsListElement) {
    ingredientsListElement.innerHTML = '';
    ingredientsList.forEach((ingredient) => {
      const filterModel = filterTemplate(ingredient);
      const ingredientItem = filterModel.createFilter();
      ingredientsListElement.appendChild(ingredientItem);
    });
  }
}

function displayUstensilsList(ustensilsList) {
  const ustensilsListElement = document.querySelector('.ustensils-list');
  if (ustensilsListElement) {
    ustensilsListElement.innerHTML = '';
    ustensilsList.forEach((ustensil) => {
      const filterModel = filterTemplate(ustensil);
      const ustensilItem = filterModel.createFilter();
      ustensilsListElement.appendChild(ustensilItem);
    });
  }
}

function displayAppliancesList(appliancesList) {
  const appliancesListElement = document.querySelector('.appliances-list');
  if (appliancesListElement) {
    appliancesListElement.innerHTML = '';
    appliancesList.forEach((appliance) => {
      const filterModel = filterTemplate(appliance);
      const applianceItem = filterModel.createFilter();
      appliancesListElement.appendChild(applianceItem);
    });
  }
}

// function toggleDropdown() {
//   const buttons = document.querySelectorAll('.filters-dropdown-btn');
//   buttons.forEach((button) => {
//     button.addEventListener('click', () => {
//       const icon = button.nextElementSibling;
//       icon.classList.remove('fa-chevron-up');
//       icon.classList.add('fa-chevron-down');
//     });
//   });
// }

function displayTotalrecipes() {
  const total = document.querySelector('.total-recipes');
  total.textContent = matchingRecipes.length + ' recettes';
}
displayTotalrecipes();

// function toggleDropdown() {
//   const buttons = document.querySelectorAll('.filter-dropdown-btn');
//   buttons.forEach((button) => {
//     button.addEventListener('click', () => {
//       const icon = button.querySelector('i.fa-solid');
//       if (icon.classList.contains('fa-chevron-down')) {
//         icon.classList.remove('fa-chevron-down');
//         icon.classList.add('fa-chevron-up');
//       } else {
//         icon.classList.remove('fa-chevron-up');
//         icon.classList.add('fa-chevron-down');
//       }
//     });
//   });
// }

// toggleDropdown();

// function toggleFiltersList() {
//   const buttons = document.querySelectorAll('.filter-dropdown-btn');
//   buttons.forEach((button) => {
//     button.addEventListener('click', () => {
//       const list = button.nextElementSibling;
//       if (list) {
//         list.style.display = list.style.display === 'flex' ? 'none' : 'flex';
//       }
//     });
//   });
// }

// toggleFiltersList();

// function toggleFilters() {
//   const buttons = document.querySelectorAll('.filter-dropdown-btn');
//   buttons.forEach((button) => {
//     button.addEventListener('click', () => {
//       const list = button.nextElementSibling;
//       console.log(list);
//       //   if (list) {
//       //     list.style.display = list.style.display === 'flex' ? 'none' : 'flex';
//       //   }
//       if (list) {
//         if (list.classList.contains('filter-inactive')) {
//           list.classList.remove('filter-inactive');
//           list.classList.add('filter-active');
//           console.log('inactive');
//         } else {
//           list.classList.remove('filter-active');
//           list.classList.add('filter-inactive');
//           console.log('active');
//         }
//       } else {
//         console.log('no list');
//       }
//       const icon = button.querySelector('i.fa-solid');
//       if (icon.classList.contains('fa-chevron-down')) {
//         icon.classList.remove('fa-chevron-down');
//         icon.classList.add('fa-chevron-up');
//       } else {
//         icon.classList.remove('fa-chevron-up');
//         icon.classList.add('fa-chevron-down');
//       }
//     });
//   });
// }

function toggleFilters() {
  const buttons = document.querySelectorAll('.filter-dropdown-btn');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const list = button.nextElementSibling;
      if (list) {
        list.style.display = list.style.display === 'flex' ? 'none' : 'flex';
      }
      const icon = button.querySelector('i.fa-solid');
      if (icon.classList.contains('fa-chevron-down')) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      } else {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      }
    });
  });
}

toggleFilters();

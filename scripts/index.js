import { recipes } from '/recipes.js';
import { cardTemplate } from './factories/cardTemplate.js';
import { filterTemplate } from './factories/listItem.js';

// Initialisation des variables
let matchingRecipesSet = new Set();
let matchingRecipes = [...recipes];
let matchingRecipesCopy = [...recipes];
let ingredientsList = [];
let ingredientsListCopy = [];
let appliancesList = [];
let appliancesListCopy = [];
let ustensilsList = [];
let ustensilsListCopy = [];
let selectedTags = { ingredients: [], appliances: [], ustensils: [] };

// Exécution des fonctions à la fin du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  getIngredientsUtensilsAppliancesLists(recipes);
  displayRecipes(recipes);
  displayIngredientsList(ingredientsList);
  displayUstensilsList(ustensilsList);
  displayAppliancesList(appliancesList);
  displayTotalrecipes(matchingRecipes);
});

// Fonction de recherche de recettes
function searchRecipes() {
  const mainInput = document.querySelector('.search-input');
  const inputValue = mainInput.value.toLowerCase();
  const errorMessage = document.querySelector('.error-message');
  const errorMessageNoRecipes = document.querySelector(
    '.error-message-no-recipes'
  );

  if (inputValue.length > 2) {
    matchingRecipesSet.clear();
    errorMessage.textContent = '';
    errorMessageNoRecipes.textContent = '';

    // Vider les conteneurs de tags
    Array.from(document.querySelectorAll('.tags-container')).map(
      (container) => (container.innerHTML = '')
    );

    // Trouver les recettes correspondantes
    matchingRecipesSet = new Set(
      recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(inputValue) ||
          recipe.description.toLowerCase().includes(inputValue) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(inputValue)
          )
      )
    );

    if (matchingRecipesSet.size === 0) {
      errorMessageNoRecipes.textContent = `Aucune recette ne contient ${inputValue}. Vous pouvez chercher «tarte aux pommes», «poisson», etc.`;
      errorMessageNoRecipes.style.cssText =
        'color: red; margin-top: 10px; font-size: 1.2rem;';
    }
  } else {
    matchingRecipesSet.clear();
    errorMessage.textContent = 'Veuillez entrer au moins 3 caractères';
    errorMessage.style.color = 'red';
  }

  matchingRecipes = Array.from(matchingRecipesSet);
  matchingRecipesCopy = [...matchingRecipes];
  getIngredientsUtensilsAppliancesLists(matchingRecipes);
  displayRecipes(matchingRecipes);
  displayIngredientsList(ingredientsList);
  displayUstensilsList(ustensilsList);
  displayAppliancesList(appliancesList);
  displayTotalrecipes(matchingRecipes);
  return matchingRecipes; // Retourne un tableau
}

// Ajout de l'événement de recherche après chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', searchRecipes);
});

// Obtenir les listes d'ingrédients, appareils et ustensiles
function getIngredientsUtensilsAppliancesLists(matchingRecipes) {
  let ingredientsSet = new Set();
  let appliancesSet = new Set();
  let ustensilsSet = new Set();

  if (Array.isArray(matchingRecipes)) {
    matchingRecipes.map((recipe) => {
      recipe.ingredients.map((ingredient) =>
        ingredientsSet.add(ingredient.ingredient.toLowerCase())
      );
      appliancesSet.add(recipe.appliance.toLowerCase());
      recipe.ustensils.map((ustensil) =>
        ustensilsSet.add(ustensil.toLowerCase())
      );
    });
  }

  ingredientsList = Array.from(ingredientsSet);
  ingredientsListCopy = [...ingredientsList];
  appliancesList = Array.from(appliancesSet);
  appliancesListCopy = [...appliancesList];
  ustensilsList = Array.from(ustensilsSet);
  ustensilsListCopy = [...ustensilsList];
  return {
    ingredientsList,
    appliancesList,
    ustensilsList,
  };
}

// Afficher les recettes
function displayRecipes(recipes) {
  const recipesContainer = document.querySelector('.recipes-container');
  if (recipesContainer) {
    recipesContainer.innerHTML = '';
    recipes.forEach((recipe) => {
      const cardModel = cardTemplate(recipe);
      const recipeCard = cardModel.createRecipeCard();
      recipesContainer.appendChild(recipeCard);
    });
  }
}

// Afficher la liste des ingrédients
function displayIngredientsList(ingredientsList) {
  const ingredientsListElement = document.querySelector('.ingredients-list');
  if (ingredientsListElement) {
    ingredientsListElement.innerHTML = '';
    ingredientsList.forEach((ingredient) => {
      const filterModel = filterTemplate(ingredient);
      const ingredientItem = filterModel.createFilter('ingredient');
      ingredientsListElement.appendChild(ingredientItem);
    });
  }
  handleIngredientsTags();
}

// Afficher la liste des ustensiles
function displayUstensilsList(ustensilsList) {
  const ustensilsListElement = document.querySelector('.ustensils-list');
  if (ustensilsListElement) {
    ustensilsListElement.innerHTML = '';
    ustensilsList.forEach((ustensil) => {
      const filterModel = filterTemplate(ustensil);
      const ustensilItem = filterModel.createFilter('ustensil');
      ustensilsListElement.appendChild(ustensilItem);
    });
  }
  handleUstentilsTags();
}

// Afficher la liste des appareils
function displayAppliancesList(appliancesList) {
  const appliancesListElement = document.querySelector('.appliances-list');
  if (appliancesListElement) {
    appliancesListElement.innerHTML = '';
    appliancesList.forEach((appliance) => {
      const filterModel = filterTemplate(appliance);
      const applianceItem = filterModel.createFilter('appliance');
      appliancesListElement.appendChild(applianceItem);
    });
  }
  handleAppliancesTags();
}

// Afficher le nombre total de recettes
function displayTotalrecipes(currentRecipeList) {
  const total = document.querySelector('.total-recipes');
  if (total) {
    total.textContent =
      currentRecipeList.length +
      ' ' +
      `recette${currentRecipeList.length > 1 ? 's' : ''}`;
  }
}

// Basculer l'affichage des filtres
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

toggleFilters(); // Initialiser les filtres

// Fonction de recherche de filtres pour les ingrédients
function handleIngredientsFilterSearch() {
  ingredientsListCopy = [...ingredientsList];
  const input = document.querySelector('.ingredients-search-input');
  const inputValue = input.value.toLowerCase();
  ingredientsListCopy = ingredientsList.filter((ingredient) =>
    ingredient.toLowerCase().includes(inputValue)
  );

  displayIngredientsList(ingredientsListCopy);
}

// Ajout de l'événement de recherche pour les ingrédients
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.ingredients-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleIngredientsFilterSearch);
  }
});

// Fonction de recherche de filtres pour les ustensiles
function handleUstensilsFilterSearch() {
  ustensilsListCopy = [...ustensilsList];
  const input = document.querySelector('.ustensils-search-input');
  const inputValue = input.value.toLowerCase();
  ustensilsListCopy = ustensilsList.filter((ustensil) =>
    ustensil.toLowerCase().includes(inputValue)
  );
  displayUstensilsList(ustensilsListCopy);
}

// Ajout de l'événement de recherche pour les ustensiles
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.ustensils-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleUstensilsFilterSearch);
  }
});

// Fonction de recherche de filtres pour les appareils
function handleAppliancesFilterSearch() {
  appliancesListCopy = [...appliancesList];
  const input = document.querySelector('.appliances-search-input');
  const inputValue = input.value.toLowerCase();
  appliancesListCopy = appliancesList.filter((appliance) =>
    appliance.toLowerCase().includes(inputValue)
  );
  displayAppliancesList(appliancesListCopy);
}

// Ajout de l'événement de recherche pour les appareils
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.appliances-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleAppliancesFilterSearch);
  }
});

// Mise à jour des listes de filtres
function updateFilterLists() {
  const { ingredientsList, appliancesList, ustensilsList } =
    getIngredientsUtensilsAppliancesLists(matchingRecipesCopy);
  ingredientsListCopy = ingredientsList.filter(
    (ingredient) => !selectedTags.ingredients.includes(ingredient)
  );
  appliancesListCopy = appliancesList.filter(
    (appliance) => !selectedTags.appliances.includes(appliance)
  );
  ustensilsListCopy = ustensilsList.filter(
    (ustensil) => !selectedTags.ustensils.includes(ustensil)
  );
  displayIngredientsList(ingredientsListCopy);
  displayUstensilsList(ustensilsListCopy);
  displayAppliancesList(appliancesListCopy);
}

// Gérer les tags des ingrédients
function handleIngredientsTags() {
  const filterItems = document.querySelectorAll('.filter-ingredient');
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (!selectedTags.ingredients.includes(item.textContent)) {
        const selectedTagsContainer = document.querySelector(
          '.selected-ingredients-tags-list'
        );
        const tag = document.createElement('p');
        tag.classList.add('selected-tag');
        tag.textContent = item.textContent;
        const closetag = document.createElement('i');
        closetag.classList.add('fa-xmark', 'fa-solid', 'fa-sm');
        const tagIconContainer = document.createElement('div');
        tagIconContainer.classList.add('tag-icon-container');
        tagIconContainer.appendChild(closetag);
        tag.appendChild(tagIconContainer);
        selectedTagsContainer.appendChild(tag);
        selectedTags.ingredients.push(item.textContent);

        // Filtrer les recettes correspondant aux tags sélectionnés
        matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
          recipe.ingredients.some(
            (ingredient) =>
              ingredient.ingredient.toLowerCase() ===
              item.textContent.toLowerCase()
          )
        );
        displayRecipes(matchingRecipesCopy);
        displayTotalrecipes(matchingRecipesCopy);

        updateFilterLists(); // Mettre à jour les listes de filtres

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag);
          selectedTags.ingredients = selectedTags.ingredients.filter(
            (ingredient) => ingredient !== item.textContent
          );

          // Re-filtrer les recettes en fonction de tous les tags restants
          matchingRecipesCopy = matchingRecipes.filter((recipe) =>
            selectedTags.ingredients.every((tag) =>
              recipe.ingredients.some(
                (ingredient) =>
                  ingredient.ingredient.toLowerCase() === tag.toLowerCase()
              )
            )
          );

          displayRecipes(matchingRecipesCopy);
          displayTotalrecipes(matchingRecipesCopy);

          // Ajouter l'ingrédient de retour à la liste des ingrédients
          if (!ingredientsListCopy.includes(item.textContent.toLowerCase())) {
            ingredientsListCopy.push(item.textContent.toLowerCase());
          }

          updateFilterLists(); // Mettre à jour les listes de filtres
        });
      }
    });
  });
}

// Gérer les tags des ustensiles
function handleUstentilsTags() {
  const filterItems = document.querySelectorAll('.filter-ustensil');
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (!selectedTags.ustensils.includes(item.textContent)) {
        const selectedTagsContainer = document.querySelector(
          '.selected-ustensils-tags-list'
        );
        const tag = document.createElement('p');
        tag.classList.add('selected-tag');
        tag.textContent = item.textContent;
        const closetag = document.createElement('i');
        closetag.classList.add('fa-xmark', 'fa-solid');
        const tagIconContainer = document.createElement('div');
        tagIconContainer.classList.add('tag-icon-container');
        tagIconContainer.appendChild(closetag);
        tag.appendChild(tagIconContainer);
        selectedTagsContainer.appendChild(tag);
        selectedTags.ustensils.push(item.textContent);

        // Filtrer les recettes correspondant aux tags sélectionnés
        matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
          selectedTags.ustensils.every((tag) =>
            recipe.ustensils.some(
              (element) => element.toLowerCase() === tag.toLowerCase()
            )
          )
        );

        displayRecipes(matchingRecipesCopy);
        displayTotalrecipes(matchingRecipesCopy);

        updateFilterLists(); // Mettre à jour les listes de filtres

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag);
          selectedTags.ustensils = selectedTags.ustensils.filter(
            (ustensil) => ustensil !== item.textContent
          );

          // Re-filtrer les recettes en fonction de tous les tags restants
          matchingRecipesCopy = matchingRecipes.filter((recipe) =>
            selectedTags.ustensils.every((tag) =>
              recipe.ustensils.includes(tag.toLowerCase())
            )
          );
          displayRecipes(matchingRecipesCopy);
          displayTotalrecipes(matchingRecipesCopy);

          // Ajouter l'ustensile de retour à la liste des ustensiles
          if (!ustensilsListCopy.includes(item.textContent.toLowerCase())) {
            ustensilsListCopy.push(item.textContent.toLowerCase());
          }

          updateFilterLists(); // Mettre à jour les listes de filtres
        });
      }
    });
  });
}

// Gérer les tags des appareils
function handleAppliancesTags() {
  const filterItems = document.querySelectorAll('.filter-appliance');
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (!selectedTags.appliances.includes(item.textContent)) {
        const selectedTagsContainer = document.querySelector(
          '.selected-appliances-tags-list'
        );
        const tag = document.createElement('p');
        tag.classList.add('selected-tag');
        tag.textContent = item.textContent;
        const closetag = document.createElement('i');
        closetag.classList.add('fa-xmark', 'fa-solid');
        const tagIconContainer = document.createElement('div');
        tagIconContainer.classList.add('tag-icon-container');
        tagIconContainer.appendChild(closetag);
        tag.appendChild(tagIconContainer);
        selectedTagsContainer.appendChild(tag);
        selectedTags.appliances.push(item.textContent);

        matchingRecipesCopy = matchingRecipesCopy.filter(
          (recipe) =>
            recipe.appliance.toLowerCase() === item.textContent.toLowerCase()
        );
        displayRecipes(matchingRecipesCopy);
        displayTotalrecipes(matchingRecipesCopy);

        updateFilterLists(); // Mettre à jour les listes de filtres

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag);
          selectedTags.appliances = selectedTags.appliances.filter(
            (appliance) => appliance !== item.textContent
          );

          // Re-filtrer les recettes en fonction de tous les tags restants
          matchingRecipesCopy = matchingRecipes.filter((recipe) =>
            selectedTags.appliances.every(
              (tag) => recipe.appliance.toLowerCase() === tag.toLowerCase()
            )
          );
          displayRecipes(matchingRecipesCopy);
          displayTotalrecipes(matchingRecipesCopy);

          // Ré-ajouter le filtre du tag supprimé dans la liste des appareils
          if (!appliancesListCopy.includes(item.textContent.toLowerCase())) {
            appliancesListCopy.push(item.textContent.toLowerCase());
          }

          updateFilterLists(); // Mettre à jour les listes de filtres
        });
      }
    });
  });
}

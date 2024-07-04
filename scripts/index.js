import { recipes } from '/recipes.js';
import { cardTemplate } from './factories/cardTemplate.js';
import { filterTemplate } from './factories/listItem.js';

// Variables globales pour stocker les recettes et les listes de filtres
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

// Quand le DOM est chargé, initialise les listes et affiche les recettes
document.addEventListener('DOMContentLoaded', () => {
  getIngredientsUtensilsAppliancesLists(recipes);
  displayRecipes(recipes);
  displayIngredientsList(ingredientsList);
  displayUstensilsList(ustensilsList);
  displayAppliancesList(appliancesList);
  displayTotalrecipes(matchingRecipes);
});

// Fonction pour rechercher des recettes en fonction de l'entrée utilisateur
function searchRecipes() {
  const mainInput = document.querySelector('.search-input');
  const inputValue = mainInput.value;
  const errorMessage = document.querySelector('.error-message');
  const errorMessageNoRecipes = document.querySelector(
    '.error-message-no-recipes'
  );

  if (inputValue.length > 2) {
    // Efface les résultats précédents
    matchingRecipesSet.clear();
    errorMessage.textContent = '';
    errorMessageNoRecipes.textContent = '';

    // Vide les conteneurs de tags
    const tagsContainer = document.querySelectorAll('.tags-container');
    tagsContainer.forEach((container) => {
      container.innerHTML = '';
    });

    // Filtre les recettes en fonction du nom, des ingrédients ou de la description
    recipes.forEach((recipe) => {
      if (recipe.name.includes(inputValue.toLowerCase())) {
        matchingRecipesSet.add(recipe);
      } else if (
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.includes(inputValue.toLowerCase())
        )
      ) {
        matchingRecipesSet.add(recipe);
      } else if (recipe.description.includes(inputValue.toLowerCase())) {
        matchingRecipesSet.add(recipe);
      }
    });

    // Affiche un message si aucune recette n'est trouvée
    if (matchingRecipesSet.size === 0) {
      errorMessageNoRecipes.textContent = `Aucune recette ne contient ${inputValue}. Vous pouvez chercher «tarte aux pommes», «poisson», etc.`;
      errorMessageNoRecipes.style.cssText =
        'color: red; margin-top: 10px; font-size: 1.2rem; ';
    }
  } else {
    matchingRecipesSet.clear();
    errorMessage.textContent = 'Veuillez entrer au moins 3 caractères';
    errorMessage.style.color = 'red';
  }

  // Mets à jour les listes de recettes et les affichages
  matchingRecipes = [...matchingRecipesSet];
  matchingRecipesCopy = [...matchingRecipes];
  getIngredientsUtensilsAppliancesLists(matchingRecipes);
  displayRecipes(matchingRecipes);
  displayIngredientsList(ingredientsList);
  displayUstensilsList(ustensilsList);
  displayAppliancesList(appliancesList);
  displayTotalrecipes(matchingRecipes);
  return matchingRecipes;
}

// Ajoute un écouteur d'événements pour la recherche
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', searchRecipes);
});

// Fonction pour extraire les listes d'ingrédients, appareils et ustensiles des recettes correspondantes
function getIngredientsUtensilsAppliancesLists(matchingRecipes) {
  let ingredientsSet = new Set();
  let appliancesSet = new Set();
  let ustensilsSet = new Set();
  if (Array.isArray(matchingRecipes)) {
    matchingRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        ingredientsSet.add(ingredient.ingredient.toLowerCase());
      });
      appliancesSet.add(recipe.appliance.toLowerCase());
      recipe.ustensils.forEach((ustensil) => {
        ustensilsSet.add(ustensil.toLowerCase());
      });
    });
  }
  ingredientsList = [...ingredientsSet];
  ingredientsListCopy = [...ingredientsList];
  appliancesList = [...appliancesSet];
  appliancesListCopy = [...appliancesList];
  ustensilsList = [...ustensilsSet];
  ustensilsListCopy = [...ustensilsList];
  return {
    ingredientsList,
    appliancesList,
    ustensilsList,
  };
}

// Fonction pour afficher les cartes de recettes
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

// Fonction pour afficher la liste des ingrédients filtrés
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

// Fonction pour afficher la liste des ustensiles filtrés
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

// Fonction pour afficher la liste des appareils filtrés
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

// Fonction pour afficher le nombre total de recettes trouvées
function displayTotalrecipes(currentRecipeList) {
  const total = document.querySelector('.total-recipes');
  if (total) {
    total.textContent =
      currentRecipeList.length +
      ' ' +
      `recette${currentRecipeList.length > 1 ? 's' : ''}`;
  }
}

// Fonction pour basculer l'affichage des filtres
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

// Fonction pour filtrer la liste des ingrédients en fonction de l'entrée utilisateur
function handleIngredientsFilterSearch() {
  ingredientsListCopy = [...ingredientsList]; // Copie de la liste des ingrédients
  const input = document.querySelector('.ingredients-search-input'); // Sélectionne l'input de recherche des ingrédients
  const inputValue = input.value.toLowerCase(); // Récupère et met en minuscule la valeur de l'input
  // Filtre les ingrédients en fonction de l'entrée utilisateur
  ingredientsListCopy = ingredientsList.filter((ingredient) =>
    ingredient.toLowerCase().includes(inputValue)
  );

  displayIngredientsList(ingredientsListCopy); // Affiche la liste filtrée des ingrédients
}

// Ajoute un écouteur d'événement à l'input de recherche des ingrédients quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.ingredients-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleIngredientsFilterSearch);
  }
});

// Fonction pour filtrer la liste des ustensiles en fonction de l'entrée utilisateur
function handleUstensilsFilterSearch() {
  ustensilsListCopy = [...ustensilsList]; // Copie de la liste des ustensiles
  const input = document.querySelector('.ustensils-search-input'); // Sélectionne l'input de recherche des ustensiles
  const inputValue = input.value.toLowerCase(); // Récupère et met en minuscule la valeur de l'input
  // Filtre les ustensiles en fonction de l'entrée utilisateur
  ustensilsListCopy = ustensilsList.filter((ustensil) =>
    ustensil.toLowerCase().includes(inputValue)
  );
  displayUstensilsList(ustensilsListCopy); // Affiche la liste filtrée des ustensiles
}

// Ajoute un écouteur d'événement à l'input de recherche des ustensiles quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.ustensils-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleUstensilsFilterSearch);
  }
});

// Fonction pour filtrer la liste des appareils en fonction de l'entrée utilisateur
function handleAppliancesFilterSearch() {
  appliancesListCopy = [...appliancesList]; // Copie de la liste des appareils
  const input = document.querySelector('.appliances-search-input'); // Sélectionne l'input de recherche des appareils
  const inputValue = input.value.toLowerCase(); // Récupère et met en minuscule la valeur de l'input
  // Filtre les appareils en fonction de l'entrée utilisateur
  appliancesListCopy = appliancesList.filter((appliance) =>
    appliance.toLowerCase().includes(inputValue)
  );
  displayAppliancesList(appliancesListCopy); // Affiche la liste filtrée des appareils
}

// Ajoute un écouteur d'événement à l'input de recherche des appareils quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.appliances-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleAppliancesFilterSearch);
  }
});

// Fonction pour mettre à jour les listes de filtres en fonction des tags sélectionnés
function updateFilterLists() {
  const { ingredientsList, appliancesList, ustensilsList } =
    getIngredientsUtensilsAppliancesLists(matchingRecipesCopy);

  // Filtre les ingrédients, appareils et ustensiles en enlevant ceux déjà sélectionnés dans les tags
  ingredientsListCopy = ingredientsList.filter(
    (ingredient) => !selectedTags.ingredients.includes(ingredient)
  );
  appliancesListCopy = appliancesList.filter(
    (appliance) => !selectedTags.appliances.includes(appliance)
  );
  ustensilsListCopy = ustensilsList.filter(
    (ustensil) => !selectedTags.ustensils.includes(ustensil)
  );

  // Affiche les listes filtrées
  displayIngredientsList(ingredientsListCopy);
  displayUstensilsList(ustensilsListCopy);
  displayAppliancesList(appliancesListCopy);
}
// Gère les tags des ingrédients
function handleIngredientsTags() {
  const filterItems = document.querySelectorAll('.filter-ingredient'); // Sélectionne tous les éléments de filtre des ingrédients
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (!selectedTags.ingredients.includes(item.textContent)) {
        // Si l'ingrédient n'est pas déjà sélectionné
        const selectedTagsContainer = document.querySelector(
          '.selected-ingredients-tags-list'
        ); // Conteneur des tags sélectionnés
        const tag = document.createElement('p'); // Crée un nouveau tag
        tag.classList.add('selected-tag');
        tag.textContent = item.textContent;
        const closetag = document.createElement('i'); // Crée une icône de fermeture pour le tag
        closetag.classList.add('fa-xmark', 'fa-solid', 'fa-sm');
        const tagIconContainer = document.createElement('div'); // Conteneur de l'icône de fermeture
        tagIconContainer.classList.add('tag-icon-container');
        tagIconContainer.appendChild(closetag);
        tag.appendChild(tagIconContainer);
        selectedTagsContainer.appendChild(tag);
        selectedTags.ingredients.push(item.textContent); // Ajoute l'ingrédient à la liste des tags sélectionnés

        // Filtrer les recettes correspondant aux tags sélectionnés
        matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
          recipe.ingredients.some(
            (ingredient) =>
              ingredient.ingredient.toLowerCase() ===
              item.textContent.toLowerCase()
          )
        );
        displayRecipes(matchingRecipesCopy); // Affiche les recettes filtrées
        displayTotalrecipes(matchingRecipesCopy); // Affiche le nombre total de recettes filtrées

        // Mise à jour des listes de filtres en excluant les tags sélectionnés
        updateFilterLists();

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag); // Retire le tag de l'affichage
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

          displayRecipes(matchingRecipesCopy); // Affiche les recettes filtrées
          displayTotalrecipes(matchingRecipesCopy); // Affiche le nombre total de recettes filtrées

          // Ajouter l'ingrédient de retour à la liste des ingrédients
          if (!ingredientsListCopy.includes(item.textContent.toLowerCase())) {
            ingredientsListCopy.push(item.textContent.toLowerCase());
          }
          updateFilterLists(); // Met à jour les listes de filtres
        });
      }
    });
  });
}

// Gère les tags des ustensiles
function handleUstentilsTags() {
  const filterItems = document.querySelectorAll('.filter-ustensil'); // Sélectionne tous les éléments de filtre des ustensiles
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (!selectedTags.ustensils.includes(item.textContent)) {
        // Si l'ustensile n'est pas déjà sélectionné
        const selectedTagsContainer = document.querySelector(
          '.selected-ustensils-tags-list'
        ); // Conteneur des tags sélectionnés
        const tag = document.createElement('p'); // Crée un nouveau tag
        tag.classList.add('selected-tag');
        tag.textContent = item.textContent;
        const closetag = document.createElement('i'); // Crée une icône de fermeture pour le tag
        closetag.classList.add('fa-xmark', 'fa-solid');
        const tagIconContainer = document.createElement('div'); // Conteneur de l'icône de fermeture
        tagIconContainer.classList.add('tag-icon-container');
        tagIconContainer.appendChild(closetag);
        tag.appendChild(tagIconContainer);
        selectedTagsContainer.appendChild(tag);
        selectedTags.ustensils.push(item.textContent); // Ajoute l'ustensile à la liste des tags sélectionnés

        // Filtrer les recettes correspondant aux tags sélectionnés
        matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
          selectedTags.ustensils.every((tag) =>
            recipe.ustensils.some(
              (element) => element.toLowerCase() === tag.toLowerCase()
            )
          )
        );

        displayRecipes(matchingRecipesCopy); // Affiche les recettes filtrées
        displayTotalrecipes(matchingRecipesCopy); // Affiche le nombre total de recettes filtrées

        // Mise à jour des listes de filtres en excluant les tags sélectionnés
        updateFilterLists();

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag); // Retire le tag de l'affichage
          selectedTags.ustensils = selectedTags.ustensils.filter(
            (ustensil) => ustensil !== item.textContent
          );

          // Re-filtrer les recettes en fonction de tous les tags restants
          matchingRecipesCopy = matchingRecipes.filter((recipe) =>
            selectedTags.ustensils.every((tag) =>
              recipe.ustensils.includes(tag.toLowerCase())
            )
          );
          displayRecipes(matchingRecipesCopy); // Affiche les recettes filtrées
          displayTotalrecipes(matchingRecipesCopy); // Affiche le nombre total de recettes filtrées

          // Ajouter l'ustensile de retour à la liste des ustensiles
          if (!ustensilsListCopy.includes(item.textContent.toLowerCase())) {
            ustensilsListCopy.push(item.textContent.toLowerCase());
          }

          // Mise à jour des listes de filtres après la suppression du tag
          updateFilterLists();
        });
      }
    });
  });
}

// Gère les tags des appareils
function handleAppliancesTags() {
  const filterItems = document.querySelectorAll('.filter-appliance'); // Sélectionne tous les éléments de filtre des appareils
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (!selectedTags.appliances.includes(item.textContent)) {
        // Si l'appareil n'est pas déjà sélectionné
        const selectedTagsContainer = document.querySelector(
          '.selected-appliances-tags-list'
        ); // Conteneur des tags sélectionnés
        const tag = document.createElement('p'); // Crée un nouveau tag
        tag.classList.add('selected-tag');
        tag.textContent = item.textContent;
        const closetag = document.createElement('i'); // Crée une icône de fermeture pour le tag
        closetag.classList.add('fa-xmark', 'fa-solid');
        const tagIconContainer = document.createElement('div'); // Conteneur de l'icône de fermeture
        tagIconContainer.classList.add('tag-icon-container');
        tagIconContainer.appendChild(closetag);
        tag.appendChild(tagIconContainer);
        selectedTagsContainer.appendChild(tag);
        selectedTags.appliances.push(item.textContent); // Ajoute l'appareil à la liste des tags sélectionnés

        // Filtrer les recettes correspondant aux tags sélectionnés
        matchingRecipesCopy = matchingRecipesCopy.filter(
          (recipe) =>
            recipe.appliance.toLowerCase() === item.textContent.toLowerCase()
        );
        displayRecipes(matchingRecipesCopy); // Affiche les recettes filtrées
        displayTotalrecipes(matchingRecipesCopy); // Affiche le nombre total de recettes filtrées

        // Mise à jour des listes de filtres en excluant les tags sélectionnés
        updateFilterLists();

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag); // Retire le tag de l'affichage
          selectedTags.appliances = selectedTags.appliances.filter(
            (appliance) => appliance !== item.textContent
          );

          // Re-filtrer les recettes en fonction des tags restants
          matchingRecipesCopy = matchingRecipes.filter((recipe) =>
            selectedTags.appliances.every(
              (tag) => recipe.appliance.toLowerCase() === tag.toLowerCase()
            )
          );
          displayRecipes(matchingRecipesCopy); // Affiche les recettes filtrées
          displayTotalrecipes(matchingRecipesCopy); // Affiche le nombre total de recettes filtrées

          // Ré-ajouter le filtre du tag supprimé dans la liste des appareils
          if (!appliancesListCopy.includes(item.textContent.toLowerCase())) {
            appliancesListCopy.push(item.textContent.toLowerCase());
          }

          // Mise à jour des listes de filtres après la suppression du tag
          updateFilterLists();
        });
      }
    });
  });
}

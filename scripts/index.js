import { recipes } from '/recipes.js';
import { cardTemplate } from './factories/cardTemplate.js';
import { filterTemplate } from './factories/listItem.js';

// Initialisation des variables globales
let matchingRecipesSet = new Set(); // Ensemble des recettes correspondantes
let matchingRecipes = [...recipes]; // Copie des recettes
let matchingRecipesCopy = [...recipes]; // Copie des recettes pour filtrage
let ingredientsList = []; // Liste des ingrédients
let ingredientsListCopy = []; // Copie de la liste des ingrédients
let appliancesList = []; // Liste des appareils
let appliancesListCopy = []; // Copie de la liste des appareils
let ustensilsList = []; // Liste des ustensiles
let ustensilsListCopy = []; // Copie de la liste des ustensiles
let selectedTags = { ingredients: [], appliances: [], ustensils: [] }; // Tags sélectionnés

// Exécuter lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  getIngredientsUtensilsAppliancesLists(recipes); // Obtenir les listes initiales
  displayRecipes(recipes); // Afficher les recettes
  displayIngredientsList(ingredientsList); // Afficher la liste des ingrédients
  displayUstensilsList(ustensilsList); // Afficher la liste des ustensiles
  displayAppliancesList(appliancesList); // Afficher la liste des appareils
  displayTotalrecipes(matchingRecipes); // Afficher le total des recettes
});

// Fonction de recherche des recettes
function searchRecipes() {
  const mainInput = document.querySelector('.search-input'); // Sélecteur de l'input principal
  const inputValue = mainInput.value.toLowerCase(); // Valeur de l'input en minuscule
  const errorMessage = document.querySelector('.error-message'); // Message d'erreur
  const errorMessageNoRecipes = document.querySelector(
    '.error-message-no-recipes'
  ); // Message d'erreur spécifique

  if (inputValue.length > 2) {
    matchingRecipesSet.clear(); // Réinitialiser les recettes correspondantes
    errorMessage.textContent = '';
    errorMessageNoRecipes.textContent = '';

    const tagsContainer = document.querySelectorAll('.tags-container');
    for (let i = 0; i < tagsContainer.length; i++) {
      tagsContainer[i].innerHTML = ''; // Vider les conteneurs de tags
    }

    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].name.toLowerCase().includes(inputValue)) {
        matchingRecipesSet.add(recipes[i]); // Ajouter la recette si le nom correspond
      } else if (recipes[i].description.toLowerCase().includes(inputValue)) {
        matchingRecipesSet.add(recipes[i]); // Ajouter la recette si la description correspond
      } else if (
        recipes[i].ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(inputValue)
        )
      ) {
        matchingRecipesSet.add(recipes[i]); // Ajouter la recette si un ingrédient correspond
      }
    }

    if (matchingRecipesSet.size === 0) {
      errorMessageNoRecipes.textContent = `Aucune recette ne contient ${inputValue}. Vous pouvez chercher «tarte aux pommes», «poisson», etc.`;
      errorMessageNoRecipes.style.cssText =
        'color: red; margin-top: 10px; font-size: 1.2rem; ';
    }
  } else {
    matchingRecipesSet.clear(); // Réinitialiser les recettes correspondantes
    errorMessage.textContent = 'Veuillez entrer au moins 3 caractères';
    errorMessage.style.color = 'red';
  }

  matchingRecipes = [...matchingRecipesSet]; // Mettre à jour la liste des recettes correspondantes
  matchingRecipesCopy = [...matchingRecipes]; // Mettre à jour la copie des recettes correspondantes
  getIngredientsUtensilsAppliancesLists(matchingRecipes); // Obtenir les listes mises à jour
  displayRecipes(matchingRecipes); // Afficher les recettes correspondantes
  displayIngredientsList(ingredientsList); // Afficher la liste des ingrédients
  displayUstensilsList(ustensilsList); // Afficher la liste des ustensiles
  displayAppliancesList(appliancesList); // Afficher la liste des appareils
  displayTotalrecipes(matchingRecipes); // Afficher le total des recettes

  return matchingRecipes; // Retourner les recettes correspondantes
}

// Exécuter lorsque le DOM est chargé pour l'input de recherche
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', searchRecipes); // Ajouter l'événement input
});

// Obtenir les listes des ingrédients, appareils et ustensiles
function getIngredientsUtensilsAppliancesLists(matchingRecipes) {
  let ingredientsSet = new Set(); // Ensemble des ingrédients
  let appliancesSet = new Set(); // Ensemble des appareils
  let ustensilsSet = new Set(); // Ensemble des ustensiles

  if (Array.isArray(matchingRecipes)) {
    for (let i = 0; i < matchingRecipes.length; i++) {
      const recipe = matchingRecipes[i];

      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
        ingredientsSet.add(ingredient); // Ajouter l'ingrédient à l'ensemble
      }

      appliancesSet.add(recipe.appliance.toLowerCase()); // Ajouter l'appareil à l'ensemble

      for (let k = 0; k < recipe.ustensils.length; k++) {
        const ustensil = recipe.ustensils[k].toLowerCase();
        ustensilsSet.add(ustensil); // Ajouter l'ustensile à l'ensemble
      }
    }
  }

  ingredientsList = Array.from(ingredientsSet); // Convertir en tableau
  ingredientsListCopy = [...ingredientsList]; // Copier la liste
  appliancesList = Array.from(appliancesSet); // Convertir en tableau
  appliancesListCopy = [...appliancesList]; // Copier la liste
  ustensilsList = Array.from(ustensilsSet); // Convertir en tableau
  ustensilsListCopy = [...ustensilsList]; // Copier la liste

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
    recipesContainer.innerHTML = ''; // Vider le conteneur de recettes
    recipes.forEach((recipe) => {
      const cardModel = cardTemplate(recipe);
      const recipeCard = cardModel.createRecipeCard();
      recipesContainer.appendChild(recipeCard); // Ajouter la carte de recette
    });
  }
}

// Afficher la liste des ingrédients
function displayIngredientsList(ingredientsList) {
  const ingredientsListElement = document.querySelector('.ingredients-list');
  if (ingredientsListElement) {
    ingredientsListElement.innerHTML = ''; // Vider la liste des ingrédients
    ingredientsList.forEach((ingredient) => {
      const filterModel = filterTemplate(ingredient);
      const ingredientItem = filterModel.createFilter('ingredient');
      ingredientsListElement.appendChild(ingredientItem); // Ajouter l'ingrédient à la liste
    });
  }
  handleIngredientsTags(); // Gérer les tags des ingrédients
}

// Afficher la liste des ustensiles
function displayUstensilsList(ustensilsList) {
  const ustensilsListElement = document.querySelector('.ustensils-list');
  if (ustensilsListElement) {
    ustensilsListElement.innerHTML = ''; // Vider la liste des ustensiles
    ustensilsList.forEach((ustensil) => {
      const filterModel = filterTemplate(ustensil);
      const ustensilItem = filterModel.createFilter('ustensil');
      ustensilsListElement.appendChild(ustensilItem); // Ajouter l'ustensile à la liste
    });
  }
  handleUstentilsTags(); // Gérer les tags des ustensiles
}

// Afficher la liste des appareils
function displayAppliancesList(appliancesList) {
  const appliancesListElement = document.querySelector('.appliances-list');
  if (appliancesListElement) {
    appliancesListElement.innerHTML = ''; // Vider la liste des appareils
    appliancesList.forEach((appliance) => {
      const filterModel = filterTemplate(appliance);
      const applianceItem = filterModel.createFilter('appliance');
      appliancesListElement.appendChild(applianceItem); // Ajouter l'appareil à la liste
    });
  }
  handleAppliancesTags(); // Gérer les tags des appareils
}

// Afficher le nombre total de recettes
function displayTotalrecipes(currentRecipeList) {
  const total = document.querySelector('.total-recipes');
  if (total) {
    total.textContent =
      currentRecipeList.length +
      ' ' +
      `recette${currentRecipeList.length > 1 ? 's' : ''}`; // Afficher le total des recettes
  }
}

// Basculer l'affichage des filtres
function toggleFilters() {
  const buttons = document.querySelectorAll('.filter-dropdown-btn');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const list = button.nextElementSibling;
      if (list) {
        list.style.display = list.style.display === 'flex' ? 'none' : 'flex'; // Basculer l'affichage
      }
      const icon = button.querySelector('i.fa-solid');
      if (icon.classList.contains('fa-chevron-down')) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up'); // Changer l'icône
      } else {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down'); // Changer l'icône
      }
    });
  });
}

toggleFilters(); // Appeler la fonction de basculement des filtres

// Fonction de recherche de filtres pour les ingrédients
function handleIngredientsFilterSearch() {
  ingredientsListCopy = [...ingredientsList]; // Copier la liste des ingrédients
  const input = document.querySelector('.ingredients-search-input'); // Sélectionner l'input
  const inputValue = input.value.toLowerCase(); // Valeur de l'input en minuscule
  ingredientsListCopy = ingredientsList.filter((ingredient) =>
    ingredient.toLowerCase().includes(inputValue)
  );

  displayIngredientsList(ingredientsListCopy); // Afficher la liste filtrée
}

// Ajouter un écouteur d'événement pour la recherche de filtres des ingrédients
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.ingredients-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleIngredientsFilterSearch); // Ajouter l'événement input
  }
});

// Fonction de recherche de filtres pour les ustensiles
function handleUstensilsFilterSearch() {
  ustensilsListCopy = [...ustensilsList]; // Copier la liste des ustensiles
  const input = document.querySelector('.ustensils-search-input'); // Sélectionner l'input
  const inputValue = input.value.toLowerCase(); // Valeur de l'input en minuscule
  ustensilsListCopy = ustensilsList.filter((ustensil) =>
    ustensil.toLowerCase().includes(inputValue)
  );
  displayUstensilsList(ustensilsListCopy); // Afficher la liste filtrée
}

// Ajouter un écouteur d'événement pour la recherche de filtres des ustensiles
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.ustensils-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleUstensilsFilterSearch); // Ajouter l'événement input
  }
});

// Fonction de recherche de filtres pour les appareils
function handleAppliancesFilterSearch() {
  appliancesListCopy = [...appliancesList]; // Copier la liste des appareils
  const input = document.querySelector('.appliances-search-input'); // Sélectionner l'input
  const inputValue = input.value.toLowerCase(); // Valeur de l'input en minuscule
  appliancesListCopy = appliancesList.filter((appliance) =>
    appliance.toLowerCase().includes(inputValue)
  );
  displayAppliancesList(appliancesListCopy); // Afficher la liste filtrée
}

// Ajouter un écouteur d'événement pour la recherche de filtres des appareils
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.appliances-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleAppliancesFilterSearch); // Ajouter l'événement input
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
  displayIngredientsList(ingredientsListCopy); // Afficher la liste des ingrédients mise à jour
  displayUstensilsList(ustensilsListCopy); // Afficher la liste des ustensiles mise à jour
  displayAppliancesList(appliancesListCopy); // Afficher la liste des appareils mise à jour
}
function filterRecipesByAllTags(recipes) {
  return recipes.filter(
    (recipe) =>
      selectedTags.ingredients.every((tag) =>
        recipe.ingredients.some(
          (ingredient) =>
            ingredient.ingredient.toLowerCase() === tag.toLowerCase()
        )
      ) &&
      selectedTags.appliances.every(
        (tag) => recipe.appliance.toLowerCase() === tag.toLowerCase()
      ) &&
      selectedTags.ustensils.every((tag) =>
        recipe.ustensils.some(
          (ustensil) => ustensil.toLowerCase() === tag.toLowerCase()
        )
      )
  );
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
        selectedTagsContainer.appendChild(tag); // Ajouter le tag au conteneur
        selectedTags.ingredients.push(item.textContent); // Ajouter le tag aux tags sélectionnés

        matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
          recipe.ingredients.some(
            (ingredient) =>
              ingredient.ingredient.toLowerCase() ===
              item.textContent.toLowerCase()
          )
        );
        displayRecipes(matchingRecipesCopy); // Afficher les recettes filtrées
        displayTotalrecipes(matchingRecipesCopy); // Afficher le total des recettes filtrées

        updateFilterLists(); // Mettre à jour les listes de filtres

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag); // Retirer le tag du conteneur
          selectedTags.ingredients = selectedTags.ingredients.filter(
            (ingredient) => ingredient !== item.textContent
          );

          // Re-filtrer les recettes en fonction de tous les tags restants
          matchingRecipesCopy = filterRecipesByAllTags(matchingRecipes);

          displayRecipes(matchingRecipesCopy); // Afficher les recettes filtrées
          displayTotalrecipes(matchingRecipesCopy); // Afficher le total des recettes filtrées

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
        selectedTagsContainer.appendChild(tag); // Ajouter le tag au conteneur
        selectedTags.ustensils.push(item.textContent); // Ajouter le tag aux tags sélectionnés

        matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
          selectedTags.ustensils.every((tag) =>
            recipe.ustensils.some(
              (element) => element.toLowerCase() === tag.toLowerCase()
            )
          )
        );

        displayRecipes(matchingRecipesCopy); // Afficher les recettes filtrées
        displayTotalrecipes(matchingRecipesCopy); // Afficher le total des recettes filtrées

        updateFilterLists(); // Mettre à jour les listes de filtres

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag); // Retirer le tag du conteneur
          selectedTags.ustensils = selectedTags.ustensils.filter(
            (ustensil) => ustensil !== item.textContent
          );

          // Re-filtrer les recettes en fonction de tous les tags restants
          matchingRecipesCopy = filterRecipesByAllTags(matchingRecipes);

          displayRecipes(matchingRecipesCopy); // Afficher les recettes filtrées
          displayTotalrecipes(matchingRecipesCopy); // Afficher le total des recettes filtrées

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
        selectedTagsContainer.appendChild(tag); // Ajouter le tag au conteneur
        selectedTags.appliances.push(item.textContent); // Ajouter le tag aux tags sélectionnés

        matchingRecipesCopy = matchingRecipesCopy.filter(
          (recipe) =>
            recipe.appliance.toLowerCase() === item.textContent.toLowerCase()
        );
        displayRecipes(matchingRecipesCopy); // Afficher les recettes filtrées
        displayTotalrecipes(matchingRecipesCopy); // Afficher le total des recettes filtrées

        updateFilterLists(); // Mettre à jour les listes de filtres

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag); // Retirer le tag du conteneur
          selectedTags.appliances = selectedTags.appliances.filter(
            (appliance) => appliance !== item.textContent
          );

          // Re-filtrer les recettes en fonction de tous les tags restants
          matchingRecipesCopy = filterRecipesByAllTags(matchingRecipes);

          displayRecipes(matchingRecipesCopy); // Afficher les recettes filtrées
          displayTotalrecipes(matchingRecipesCopy); // Afficher le total des recettes filtrées

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

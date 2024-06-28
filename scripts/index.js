import { recipes } from '/recipes.js';
import { cardTemplate } from './factories/cardTemplate.js';
import { filterTemplate } from './factories/listItem.js';

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

// document.addEventListener('DOMContentLoaded', () => {
//   displayRecipes(recipes);
//   getIngredientsUtensilsAppliancesLists(recipes);
//   displayIngredientsList(ingredientsList);
//   displayUstensilsList(ustensilsList);
//   displayAppliancesList(appliancesList);
//   displayTotalrecipes(recipes);
// });

document.addEventListener('DOMContentLoaded', () => {
  getIngredientsUtensilsAppliancesLists(recipes);
  displayRecipes(recipes);
  displayIngredientsList(ingredientsList);
  displayUstensilsList(ustensilsList);
  displayAppliancesList(appliancesList);
  displayTotalrecipes(matchingRecipes);
});

//tester has pour le set

function searchRecipes() {
  const mainInput = document.querySelector('.search-input');
  const inputValue = mainInput.value.toLowerCase();
  const errorMessage = document.querySelector('.error-message');
  const errorMessageNoRecipes = document.querySelector(
    '.error-message-no-recipes'
  );
  if (inputValue.length > 2) {
    matchingRecipesSet.clear();
    // matchingRecipes = [];
    errorMessage.textContent = '';
    errorMessageNoRecipes.textContent = '';
    const tagsContainer = document.querySelectorAll('.tags-container');
    for (let i = 0; i < tagsContainer.length; i++) {
      tagsContainer[i].innerHTML = '';
    }
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].name.toLowerCase().includes(inputValue)) {
        matchingRecipesSet.add(recipes[i]);
      } else if (recipes[i].description.toLowerCase().includes(inputValue)) {
        matchingRecipesSet.add(recipes[i]);
      } else if (
        recipes[i].ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(inputValue)
        )
      ) {
        matchingRecipesSet.add(recipes[i]);
      }
    }
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

  matchingRecipes = [...matchingRecipesSet];
  matchingRecipesCopy = [...matchingRecipes];
  getIngredientsUtensilsAppliancesLists(matchingRecipes);
  displayRecipes(matchingRecipes);
  displayIngredientsList(ingredientsList);
  displayUstensilsList(ustensilsList);
  displayAppliancesList(appliancesList);
  displayTotalrecipes(matchingRecipes);
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
    for (let i = 0; i < matchingRecipes.length; i++) {
      const recipe = matchingRecipes[i];

      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
        ingredientsSet.add(ingredient);
      }

      appliancesSet.add(recipe.appliance.toLowerCase());

      for (let k = 0; k < recipe.ustensils.length; k++) {
        const ustensil = recipe.ustensils[k].toLowerCase();
        ustensilsSet.add(ustensil);
      }
    }
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

function displayRecipes(recipes) {
  // if (recipes.length === 0) {
  //     message d'erreur et récupérer valeur de 'linput
  // }
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
      const ingredientItem = filterModel.createFilter('ingredient');
      ingredientsListElement.appendChild(ingredientItem);
    });
  }
  handleIngredientsTags();
}

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

function displayTotalrecipes(currentRecipeList) {
  const total = document.querySelector('.total-recipes');
  if (total) {
    total.textContent =
      currentRecipeList.length +
      ' ' +
      `recette${currentRecipeList.length > 1 ? 's' : ''}`;
  }
}
// displayTotalrecipes(matchingRecipes);

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

// filters inputs functions
function handleIngredientsFilterSearch() {
  ingredientsListCopy = [...ingredientsList];
  const input = document.querySelector('.ingredients-search-input');
  const inputValue = input.value.toLowerCase();
  ingredientsListCopy = ingredientsList.filter((ingredient) =>
    ingredient.toLowerCase().includes(inputValue)
  );

  displayIngredientsList(ingredientsListCopy);
}

document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.ingredients-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleIngredientsFilterSearch);
  }
});

function handleUstensilsFilterSearch() {
  ustensilsListCopy = [...ustensilsList];
  const input = document.querySelector('.ustensils-search-input');
  const inputValue = input.value.toLowerCase();
  ustensilsListCopy = ustensilsList.filter((ustensil) =>
    ustensil.toLowerCase().includes(inputValue)
  );
  displayUstensilsList(ustensilsListCopy);
}
document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.ustensils-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleUstensilsFilterSearch);
  }
});

function handleAppliancesFilterSearch() {
  appliancesListCopy = [...appliancesList];
  const input = document.querySelector('.appliances-search-input');
  const inputValue = input.value.toLowerCase();
  appliancesListCopy = appliancesList.filter((appliance) =>
    appliance.toLowerCase().includes(inputValue)
  );
  displayAppliancesList(appliancesListCopy);
}

document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('.appliances-search-input');
  if (inputElement) {
    inputElement.addEventListener('input', handleAppliancesFilterSearch);
  }
});

// function handleIngredientsTags() {
//   const filterItems = document.querySelectorAll('.filter-ingredient');
//   filterItems.forEach((item) => {
//     item.addEventListener('click', () => {
//       if (!selectedTags.ingredients.includes(item.textContent)) {
//         const tagsContainer = document.querySelector(
//           '.ingredients-tags-container'
//         );
//         const tag = document.createElement('p');
//         tag.classList.add('tag');
//         tag.textContent = item.textContent;
//         const closetag = document.createElement('i');
//         closetag.classList.add('fa-xmark', 'fa-solid', 'fa-sm');
//         const tagIconContainer = document.createElement('div');
//         tagIconContainer.classList.add('tag-icon-container');
//         tagIconContainer.appendChild(closetag);
//         tag.appendChild(tagIconContainer);
//         tagsContainer.appendChild(tag);
//         selectedTags.ingredients.push(item.textContent);

//         //supprimer l'ingrédient de la liste des ingrédients
//         console.log('dedede', ingredientsListCopy);

//         ingredientsListCopy = ingredientsListCopy.filter(
//           (ingredient) =>
//             ingredient.toLowerCase() !== item.textContent.toLowerCase()
//         );

//         console.log('eeeeeeee', ingredientsListCopy);

//         displayIngredientsList(ingredientsListCopy);

//         // Filtrer les recettes correspondant aux tags sélectionnés
//         matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
//           recipe.ingredients.some(
//             (ingredient) =>
//               ingredient.ingredient.toLowerCase() ===
//               item.textContent.toLowerCase()
//           )
//         );
//         displayRecipes(matchingRecipesCopy);
//         displayTotalrecipes(matchingRecipesCopy);

//         // Gestion de la suppression du tag
//         closetag.addEventListener('click', () => {
//           tagsContainer.removeChild(tag);
//           selectedTags.ingredients = selectedTags.ingredients.filter(
//             (ingredient) => ingredient !== item.textContent
//           );

//           // Re-filtrer les recettes en fonction des tags restants
//           // si pas de tag every return true
//           matchingRecipesCopy = matchingRecipes.filter((recipe) =>
//             selectedTags.ingredients.every((tag) =>
//               recipe.ingredients.some(
//                 (ingredient) =>
//                   ingredient.ingredient.toLowerCase() === tag.toLowerCase()
//               )
//             )
//           );
//           displayRecipes(matchingRecipesCopy);
//         });
//       }
//     });
//   });
// }

// function updateFilterLists() {
//   const { ingredientsList, appliancesList, ustensilsList } =
//     getIngredientsUtensilsAppliancesLists(matchingRecipesCopy);
//   ingredientsListCopy = ingredientsList.filter(
//     (ingredient) => !selectedTags.ingredients.includes(ingredient)
//   );
//   appliancesListCopy = appliancesList.filter(
//     (appliance) => !selectedTags.appliances.includes(appliance)
//   );
//   ustensilsListCopy = ustensilsList.filter(
//     (ustensil) => !selectedTags.ustensils.includes(ustensil)
//   );
//   displayIngredientsList(ingredientsListCopy);
//   displayUstensilsList(ustensilsListCopy);
//   displayAppliancesList(appliancesListCopy);
// }
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

        // Supprimer l'ingrédient de la liste des ingrédients
        // ingredientsListCopy = ingredientsListCopy.filter(
        //   (ingredient) =>
        //     ingredient.toLowerCase() !== item.textContent.toLowerCase()
        // );

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

        // Mise à jour des listes de filtres en excluant les tags sélectionnés
        updateFilterLists();

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          console.log('click');
          selectedTagsContainer.removeChild(tag);
          selectedTags.ingredients = selectedTags.ingredients.filter(
            (ingredient) => ingredient !== item.textContent
          );

          // Re-filtrer les recettes en fonction de tous les tags restants
          //tous les tags sélectionnés sont dans la recette = every
          //je compare tous les ingrédients de la recette à mon tag = some
          matchingRecipesCopy = matchingRecipes.filter((recipe) =>
            selectedTags.ingredients.every((tag) =>
              recipe.ingredients.some(
                (ingredient) =>
                  ingredient.ingredient.toLowerCase() === tag.toLowerCase()
              )
            )
          );
          console.log('matchingRecipesCopy', matchingRecipesCopy);
          //   // Filtre les recettes pour ne conserver que celles qui correspondent aux tags d'ingrédients sélectionnés
          //   const matchingRecipesCopy = matchingRecipes.filter((recipe) =>
          //     // Vérifie que tous les tags d'ingrédients sélectionnés sont présents dans les ingrédients de la recette
          //     selectedTags.ingredients.every((tag) =>
          //       // Vérifie si un des ingrédients de la recette correspond au tag en cours (comparaison en minuscules)
          //       recipe.ingredients.some(
          //         (ingredient) =>
          //           ingredient.ingredient.toLowerCase() === tag.toLowerCase()
          //       )
          //     )
          //   );

          displayRecipes(matchingRecipesCopy);
          displayTotalrecipes(matchingRecipesCopy);

          // Ajouter l'ingrédient de retour à la liste des ingrédients
          if (!ingredientsListCopy.includes(item.textContent.toLowerCase())) {
            ingredientsListCopy.push(item.textContent.toLowerCase());
          }

          // Mise à jour des listes de filtres après la suppression du tag
          updateFilterLists();
        });
      }
    });
  });
}
//je mets à jour les selected tags
//je mets à jour matchingRecipesCopy en filtrant les recettes
//qui contiennent les tags sélectionnés
//ce qui filtre les recettes
//updateFilters met à jour les listes de filtresd
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

        // Supprimer l'ustensil de la liste des ustensils
        // ustensilsListCopy = ustensilsListCopy.filter(
        //   (ustensil) =>
        //     ustensil.toLowerCase() !== item.textContent.toLowerCase()
        // );

        // Filtrer les recettes correspondant aux tags sélectionnés

        matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
          selectedTags.ustensils.every((tag) =>
            recipe.ustensils.some(
              (element) => element.toLowerCase() === tag.toLowerCase()
            )
          )
        );

        // matchingRecipesCopy = matchingRecipes.filter((recipe) =>
        //   selectedTags.ustensils.every((tag) =>
        //     recipe.ustensils
        //       .map((ustensil) => ustensil.toLowerCase())
        //       .includes(tag.toLowerCase())
        //   )
        // );
        displayRecipes(matchingRecipesCopy);
        displayTotalrecipes(matchingRecipesCopy);

        // Mise à jour des listes de filtres en excluant les tags sélectionnés
        updateFilterLists();

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

          // Ajouter l'ustensil de retour à la liste des ustensiles
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

        // Supprimer l'appareil de la liste des appareils
        // appliancesListCopy = appliancesListCopy.filter(
        //   (appliance) =>
        //     appliance.toLowerCase() !== item.textContent.toLowerCase()
        // );

        // displayAppliancesList(appliancesListCopy);

        // Filtrer les recettes correspondant aux tags sélectionnés
        matchingRecipesCopy = matchingRecipesCopy.filter(
          (recipe) =>
            recipe.appliance.toLowerCase() === item.textContent.toLowerCase()
        );
        displayRecipes(matchingRecipesCopy);
        displayTotalrecipes(matchingRecipesCopy);

        // Mise à jour des listes de filtres en excluant les tags sélectionnés
        updateFilterLists();

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          selectedTagsContainer.removeChild(tag);
          selectedTags.appliances = selectedTags.appliances.filter(
            (appliance) => appliance !== item.textContent
          );

          // Re-filtrer les recettes en fonction des tags restants
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

          // Mise à jour des listes de filtres après la suppression du tag
          updateFilterLists();
        });
      }
    });
  });
}

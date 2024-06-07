import { recipes } from '/recipes.js';
import { cardTemplate } from './factories/cardTemplate.js';
import { filterTemplate } from './factories/listItem.js';

let matchingRecipesSet = new Set();
let matchingRecipes = [];
let matchingRecipesCopy = [];
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

//tester has pour le set

function searchRecipes() {
  const mainInput = document.querySelector('.search-input');
  const inputValue = mainInput.value;
  const errorMessage = document.querySelector('.error-message');

  if (inputValue.length > 2) {
    matchingRecipesSet.clear();
    // matchingRecipes = [];
    errorMessage.textContent = '';
    const tagsContainer = document.querySelectorAll('.tags-container');
    tagsContainer.forEach((container) => {
      container.innerHTML = '';
    });

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

    if (matchingRecipesSet.size === 0) {
      // Aucune recette correspondante trouvée, afficher le message d'erreur
      errorMessage.textContent = `Aucune recette ne contient "${inputValue}". Vous pouvez chercher «tarte aux pommes», «poisson», etc.`;
      errorMessage.style.color = 'red';
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
  total.textContent = currentRecipeList.length + ' recettes';
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
          selectedTagsContainer.removeChild(tag);
          selectedTags.ingredients = selectedTags.ingredients.filter(
            (ingredient) => ingredient !== item.textContent
          );

          // Re-filtrer les recettes en fonction des tags restants
          matchingRecipesCopy = matchingRecipes.filter((recipe) =>
            selectedTags.ingredients.every((tag) =>
              recipe.ingredients.some(
                (ingredient) =>
                  ingredient.ingredient.toLowerCase() === tag.toLowerCase()
              )
            )
          );
          displayRecipes(matchingRecipesCopy);

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

function handleUstentilsTags() {
  const filterItems = document.querySelectorAll('.filter-ustensil');
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (!selectedTags.ustensils.includes(item.textContent)) {
        const tagsContainer = document.querySelector(
          '.ustensils-tags-container'
        );
        const tag = document.createElement('p');
        tag.classList.add('tag');
        tag.textContent = item.textContent;
        const closetag = document.createElement('i');
        closetag.classList.add('fa-xmark', 'fa-solid');
        const tagIconContainer = document.createElement('div');
        tagIconContainer.classList.add('tag-icon-container');
        tagIconContainer.appendChild(closetag);
        tag.appendChild(tagIconContainer);
        tagsContainer.appendChild(tag);
        selectedTags.ustensils.push(item.textContent);

        // Supprimer l'ustensil de la liste des ustensils
        ustensilsListCopy = ustensilsListCopy.filter(
          (ustensil) =>
            ustensil.toLowerCase() !== item.textContent.toLowerCase()
        );

        // Filtrer les recettes correspondant aux tags sélectionnés
        matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
          recipe.ustensils.includes(item.textContent.toLowerCase())
        );
        displayRecipes(matchingRecipesCopy);
        displayTotalrecipes(matchingRecipesCopy);

        // Mise à jour des listes de filtres en excluant les tags sélectionnés
        updateFilterLists();

        // Gestion de la suppression du tag
        closetag.addEventListener('click', () => {
          tagsContainer.removeChild(tag);
          selectedTags.ustensils = selectedTags.ustensils.filter(
            (ustensil) => ustensil !== item.textContent
          );

          // Re-filtrer les recettes en fonction des tags restants
          matchingRecipesCopy = matchingRecipes.filter((recipe) =>
            selectedTags.ustensils.every((tag) =>
              recipe.ustensils.includes(tag.toLowerCase())
            )
          );
          displayRecipes(matchingRecipesCopy);

          // Ajouter l'ustensil de retour à la liste des ustensils
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

// function handleUstentilsTags() {
//   const filterItems = document.querySelectorAll('.filter-ustensil');
//   filterItems.forEach((item) => {
//     item.addEventListener('click', () => {
//       if (!selectedTags.ustensils.includes(item.textContent)) {
//         const tagsContainer = document.querySelector(
//           '.ustensils-tags-container'
//         );
//         const tag = document.createElement('p');
//         tag.classList.add('tag');
//         tag.textContent = item.textContent;
//         const closetag = document.createElement('i');
//         closetag.classList.add('fa-xmark', 'fa-solid');
//         const tagIconContainer = document.createElement('div');
//         tagIconContainer.classList.add('tag-icon-container');
//         tagIconContainer.appendChild(closetag);
//         tag.appendChild(tagIconContainer);
//         tagsContainer.appendChild(tag);
//         selectedTags.ustensils.push(item.textContent);

//         // Supprimer l'ustensil de la liste des ustensils
//         ustensilsListCopy = ustensilsListCopy.filter(
//           (ustensil) =>
//             ustensil.toLowerCase() !== item.textContent.toLowerCase()
//         );

//         displayUstensilsList(ustensilsListCopy);

//         // Filtrer les recettes correspondant aux tags sélectionnés
//         matchingRecipesCopy = matchingRecipesCopy.filter((recipe) =>
//           recipe.ustensils.includes(item.textContent.toLowerCase())
//         );
//         displayRecipes(matchingRecipesCopy);
//         displayTotalrecipes(matchingRecipesCopy);
//         getIngredientsUtensilsAppliancesLists(matchingRecipesCopy);
//         displayIngredientsList(ingredientsListCopy);
//         displayUstensilsList(ustensilsListCopy);
//         displayAppliancesList(appliancesListCopy);

//         // Gestion de la suppression du tag
//         closetag.addEventListener('click', () => {
//           tagsContainer.removeChild(tag);
//           selectedTags.ustensils = selectedTags.ustensils.filter(
//             (ustensil) => ustensil !== item.textContent
//           );

//           // Re-filtrer les recettes en fonction des tags restants
//           matchingRecipesCopy = matchingRecipes.filter((recipe) =>
//             selectedTags.ustensils.every((tag) =>
//               recipe.ustensils.includes(tag.toLowerCase())
//             )
//           );
//           displayRecipes(matchingRecipesCopy);

//           // Ajouter l'ustensil de retour à la liste des ustensils
//           if (!ustensilsListCopy.includes(item.textContent)) {
//             ustensilsListCopy.push(item.textContent.toLowerCase());
//             displayUstensilsList(ustensilsListCopy);
//           }
//           getIngredientsUtensilsAppliancesLists(matchingRecipesCopy);
//           displayIngredientsList(ingredientsListCopy);
//           displayUstensilsList(ustensilsListCopy);
//           displayAppliancesList(appliancesListCopy);
//         });
//       }
//     });
//   });
// }

// function handleAppliancesTags() {
//   const filterItems = document.querySelectorAll('.filter-appliance');
//   filterItems.forEach((item) => {
//     item.addEventListener('click', () => {
//       if (!selectedTags.appliances.includes(item.textContent)) {
//         const tagsContainer = document.querySelector(
//           '.appliances-tags-container'
//         );
//         const tag = document.createElement('p');
//         tag.classList.add('tag');
//         tag.textContent = item.textContent;
//         const closetag = document.createElement('i');
//         closetag.classList.add('fa-xmark', 'fa-solid');
//         const tagIconContainer = document.createElement('div');
//         tagIconContainer.classList.add('tag-icon-container');
//         tagIconContainer.appendChild(closetag);
//         tag.appendChild(tagIconContainer);
//         tagsContainer.appendChild(tag);
//         selectedTags.appliances.push(item.textContent);

//         // Supprimer l'appareil de la liste des appareils
//         appliancesListCopy = appliancesListCopy.filter(
//           (appliance) =>
//             appliance.toLowerCase() !== item.textContent.toLowerCase()
//         );

//         displayAppliancesList(appliancesListCopy);

//         // Filtrer les recettes correspondant aux tags sélectionnés
//         matchingRecipesCopy = matchingRecipesCopy.filter(
//           (recipe) =>
//             recipe.appliance.toLowerCase() === item.textContent.toLowerCase()
//         );
//         displayRecipes(matchingRecipesCopy);
//         displayTotalrecipes(matchingRecipesCopy);
//         getIngredientsUtensilsAppliancesLists(matchingRecipesCopy);
//         displayIngredientsList(ingredientsListCopy);
//         displayUstensilsList(ustensilsListCopy);
//         displayAppliancesList(appliancesListCopy);

//         // Gestion de la suppression du tag
//         closetag.addEventListener('click', () => {
//           tagsContainer.removeChild(tag);
//           selectedTags.appliances = selectedTags.appliances.filter(
//             (appliance) => appliance !== item.textContent
//           );

//           // Re-filtrer les recettes en fonction des tags restants
//           matchingRecipesCopy = matchingRecipes.filter((recipe) =>
//             selectedTags.appliances.every(
//               (tag) => recipe.appliance.toLowerCase() === tag.toLowerCase()
//             )
//           );
//           displayRecipes(matchingRecipesCopy);

//           // Ré-ajouter le filtre du tag supprimé dans la liste des appareils
//           if (!appliancesListCopy.includes(item.textContent)) {
//             appliancesListCopy.push(item.textContent.toLowerCase());
//             displayAppliancesList(appliancesListCopy);
//           }
//           getIngredientsUtensilsAppliancesLists(matchingRecipesCopy);
//           displayIngredientsList(ingredientsListCopy);
//           displayUstensilsList(ustensilsListCopy);
//           displayAppliancesList(appliancesListCopy);
//         });
//       }
//     });
//   });
// }
function handleAppliancesTags() {
  const filterItems = document.querySelectorAll('.filter-appliance');
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (!selectedTags.appliances.includes(item.textContent)) {
        const tagsContainer = document.querySelector(
          '.appliances-tags-container'
        );
        const tag = document.createElement('p');
        tag.classList.add('tag');
        tag.textContent = item.textContent;
        const closetag = document.createElement('i');
        closetag.classList.add('fa-xmark', 'fa-solid');
        const tagIconContainer = document.createElement('div');
        tagIconContainer.classList.add('tag-icon-container');
        tagIconContainer.appendChild(closetag);
        tag.appendChild(tagIconContainer);
        tagsContainer.appendChild(tag);
        selectedTags.appliances.push(item.textContent);

        // Supprimer l'appareil de la liste des appareils
        appliancesListCopy = appliancesListCopy.filter(
          (appliance) =>
            appliance.toLowerCase() !== item.textContent.toLowerCase()
        );

        displayAppliancesList(appliancesListCopy);

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
          tagsContainer.removeChild(tag);
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

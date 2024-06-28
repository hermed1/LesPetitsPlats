//algo principal
//map sur recipes avec conditions actuelles
//+ vérification de la recette existante dans le map

function searchRecipes() {
  const mainInput = document.querySelector('.search-input');
  const inputValue = mainInput.value;
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
      if (recipes[i].name.toLowerCase().includes(inputValue.toLowerCase())) {
        matchingRecipesSet.add(recipes[i]);
      } else if (
        recipes[i].ingredients.toLowerCase().includes(inputValue.toLowerCase())
      ) {
        matchingRecipesSet.add(recipes[i]);
      } else if (
        recipes[i].description.toLowerCase().includes(inputValue.toLowerCase())
      ) {
        matchingRecipesSet.add(recipes[i]);
      }
      if (matchingRecipesSet.size === 0) {
        errorMessageNoRecipes.textContent = `Aucune recette ne contient ${inputValue}. Vous pouvez chercher «tarte aux pommes», «poisson», etc.`;
        errorMessageNoRecipes.style.cssText =
          'color: red; margin-top: 10px; font-size: 1.2rem; ';
      }
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

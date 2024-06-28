function searchRecipesWithLoops() {
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
    document
      .querySelectorAll('.tags-container')
      .forEach((container) => (container.innerHTML = ''));

    for (let recipe of recipes) {
      if (recipe.name.toLowerCase().includes(inputValue)) {
        matchingRecipesSet.add(recipe);
      } else {
        for (let ingredient of recipe.ingredients) {
          if (ingredient.ingredient.toLowerCase().includes(inputValue)) {
            matchingRecipesSet.add(recipe);
            break;
          }
        }
        if (recipe.description.toLowerCase().includes(inputValue)) {
          matchingRecipesSet.add(recipe);
        }
      }
    }

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

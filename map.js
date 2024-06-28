function searchRecipes() {
  const mainInput = document.querySelector('.search-input');
  const inputValue = mainInput.value.toLowerCase();
  const errorMessage = document.querySelector('.error-message');
  const errorMessageNoRecipes = document.querySelector(
    '.error-message-no-recipes'
  );

  if (inputValue.length > 2) {
    errorMessage.textContent = '';
    errorMessageNoRecipes.textContent = '';

    // Utiliser reduce pour vider les conteneurs de tags
    Array.from(document.querySelectorAll('.tags-container')).reduce(
      (_, container) => {
        container.innerHTML = '';
        return _;
      },
      null
    );

    matchingRecipesSet = new Set(
      recipes.filter(
        (recipe) =>
          recipe.name.includes(inputValue) ||
          recipe.description.includes(inputValue) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.ingredient.includes(inputValue)
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

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', searchRecipes);
});

function getIngredientsUtensilsAppliancesLists(matchingRecipes) {
  let ingredientsSet = new Set();
  let appliancesSet = new Set();
  let ustensilsSet = new Set();

  matchingRecipes.map((recipe) => {
    recipe.ingredients
      .map((ingredient) => ingredient.ingredient.toLowerCase())
      .map((ingredient) => ingredientsSet.add(ingredient));
    appliancesSet.add(recipe.appliance.toLowerCase());
    recipe.ustensils
      .map((ustensil) => ustensil.toLowerCase())
      .map((ustensil) => ustensilsSet.add(ustensil));
  });

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

export function cardTemplate(recipe) {
  const { name, time, description, ingredients, image } = recipe;
  function createRecipeCard() {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card');

    const cardImage = document.createElement('img');
    cardImage.classList.add('card-image');
    const imgSrc = '/assets/Photos_recettes/' + image;
    cardImage.setAttribute('src', imgSrc);

    const recipeTime = document.createElement('p');
    recipeTime.classList.add('recipe-time', 'bg-warning');
    recipeTime.textContent = `${time}min`;

    const recipeName = document.createElement('h2');
    recipeName.classList.add('recipe-name', 'h3', 'my-4');

    recipeName.textContent = name;

    const recipeTitleElement = document.createElement('h3');
    recipeTitleElement.classList.add('recipe-title', 'mb-3');
    recipeTitleElement.textContent = 'RECETTE';
    const recipeDescription = document.createElement('p');
    recipeDescription.classList.add('recipe-description', 'mb-4');
    recipeDescription.textContent = description;

    const ingredientsTitleElement = document.createElement('h3');
    ingredientsTitleElement.classList.add('ingredients-title', 'mb-3');
    ingredientsTitleElement.textContent = 'INGRÉDIENTS';

    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.classList.add('ingredients-container', 'row');

    const cardTextContent = document.createElement('div');
    cardTextContent.classList.add('card-text-content', 'px-5');
    cardTextContent.append(
      recipeName,
      recipeTime,
      recipeTitleElement,
      recipeDescription,
      ingredientsTitleElement,
      ingredientsContainer
    );

    ingredients.forEach((ingredient) => {
      const ingredientContainer = document.createElement('div');
      ingredientContainer.classList.add('ingredient-container', 'col-6');

      const ingredientName = document.createElement('p');
      ingredientName.classList.add('ingredient-name');
      ingredientName.textContent = ingredient.ingredient;
      const ingredientQuantity = document.createElement('p');
      ingredientQuantity.classList.add('ingredient-quantity', 'text-black-50');
      ingredient.unit === 'grammes'
        ? (ingredientQuantity.textContent = `${ingredient.quantity}g`)
        : (ingredientQuantity.textContent = `${ingredient.quantity}${
            ingredient.unit ?? ''
          }`);

      ingredientContainer.append(ingredientName, ingredientQuantity);
      ingredientsContainer.append(ingredientContainer);
    });

    cardContainer.append(cardImage, cardTextContent);

    return cardContainer;
  }
  return { createRecipeCard, name, time, description, ingredients, image };
}

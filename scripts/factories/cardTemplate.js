export function cardTemplate(recipe) {
    const { name, time, description, ingredients, image } = recipe;
    function createRecipeCard() {
        // Création du conteneur de la carte
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card');

        // Création de l'image de la recette
        const cardImage = document.createElement('img');
        cardImage.classList.add('card-image');
        const imgSrc = '/assets/Photos_recettes/' + image;
        cardImage.setAttribute('src', imgSrc);

        // Création du paragraphe pour afficher le temps de préparation
        const recipeTime = document.createElement('p');
        recipeTime.classList.add('recipe-time');
        recipeTime.textContent = `${time}min`;

        // Création du titre de la recette
        const recipeName = document.createElement('h2');
        recipeName.classList.add('recipe-name', 'h3', 'my-4');
        recipeName.textContent = name;

        // Création du titre "RECETTE" et de la description de la recette
        const recipeTitleElement = document.createElement('h3');
        recipeTitleElement.classList.add('recipe-title', 'mb-3');
        recipeTitleElement.textContent = 'RECETTE';
        const recipeDescription = document.createElement('p');
        recipeDescription.classList.add('recipe-description', 'mb-4');
        recipeDescription.textContent = description;

        // Création du titre "INGRÉDIENTS" et du conteneur des ingrédients
        const ingredientsTitleElement = document.createElement('h3');
        ingredientsTitleElement.classList.add('ingredients-title', 'mb-3');
        ingredientsTitleElement.textContent = 'INGRÉDIENTS';
        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.add('ingredients-container', 'row');

        // Création du conteneur du texte de la carte et ajout des éléments
        const cardTextContent = document.createElement('div');
        cardTextContent.classList.add('card-text-content', 'px-4');
        cardTextContent.append(
            recipeName,
            recipeTime,
            recipeTitleElement,
            recipeDescription,
            ingredientsTitleElement,
            ingredientsContainer
        );

        // Parcours de la liste des ingrédients et création des éléments correspondants
        ingredients.forEach((ingredient) => {
            const ingredientContainer = document.createElement('div');
            ingredientContainer.classList.add('ingredient-container', 'col-6');

            const ingredientName = document.createElement('p');
            ingredientName.classList.add('ingredient-name');
            ingredientName.textContent = ingredient.ingredient;

            const ingredientQuantity = document.createElement('p');
            ingredientQuantity.classList.add('ingredient-quantity', 'text-black-50');
            const unit = ingredient.unit ?? '';
            ingredientQuantity.textContent = `${ingredient.quantity ?? ''} ${unit}`;

            ingredientContainer.append(ingredientName, ingredientQuantity);
            ingredientsContainer.append(ingredientContainer);
        });

        // Ajout de l'image et du texte à la carte
        cardContainer.append(cardImage, cardTextContent);

        return cardContainer;
    }
    return { createRecipeCard, name, time, description, ingredients, image };
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientListComponent } from '../ingredient-list/ingredient-list';
import { RecipeGeneratorComponent } from '../recipe-generator/recipe-generator';
import { Item } from '../../models/item.model';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CommonModule, IngredientListComponent, RecipeGeneratorComponent],
  templateUrl: './main-container.html',
  styleUrls: ['./main-container.scss']
})
export class MainContainerComponent {
  ingredients = signal<Item[]>([]);
  generatedRecipe = signal<Recipe | null>(null);

  onIngredientsChange(ingredients: Item[]): void {
    this.ingredients.set(ingredients);
  }

  onRecipeGenerated(recipe: Recipe): void {
    this.generatedRecipe.set(recipe);
  }

  onRecipeSaved(): void {
    this.ingredients.set([]);
    this.generatedRecipe.set(null);
  }
}
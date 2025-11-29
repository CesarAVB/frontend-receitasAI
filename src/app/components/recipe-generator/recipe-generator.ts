import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe';

@Component({
  selector: 'app-recipe-generator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-generator.html',
  styleUrls: ['./recipe-generator.scss'],
})
export class RecipeGeneratorComponent {
  recipe = input<Recipe | null>(null);
  showSaveModal = signal(false);
  recipeSaved = output<void>();
  generateNewRecipe = output<Recipe>();
  isLoading = signal(false);
  errorMessage = signal('');

  private recipeService = inject(RecipeService);

  formatInstruction(instruction: string): string {
    // Substitui texto em negrito por tags <strong>
    // Substitui quebras de linha por <br>
    // Formata os bullets
    return instruction
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Converte **texto** para <strong>texto</strong>
      .replace(/\n/g, '<br>')
      .replace(/  • /g, '<span class="instruction-bullet">&bull; </span>');
  }
}

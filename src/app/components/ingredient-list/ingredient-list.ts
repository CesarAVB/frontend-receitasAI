import { Component, signal, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../../models/item.model';
import { Recipe } from '../../models/recipe.model';
import { AddIngredientModalComponent } from '../add-ingredient-modal/add-ingredient-modal';
import { RecipeService } from '../../services/recipe';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AddIngredientModalComponent],
  templateUrl: './ingredient-list.html',
  styleUrls: ['./ingredient-list.scss']
})
export class IngredientListComponent implements OnInit {
  ingredients = signal<Item[]>([]);
  showModal = signal(false);
  isLoading = signal(false);

  ingredientsChange = output<Item[]>();
  generateRecipe = output<Recipe>();

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.carregarItens();
  }

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  carregarItens(): void {
    this.isLoading.set(true);

    this.recipeService.listarItens().subscribe({
      next: (itens) => {
        // Converte os itens do backend para o formato de ingredientes do frontend
        const ingredientes: Item[] = itens.map(item => ({
          id: item.id?.toString() || '',
          nome: item.nome,
          quantidade: item.quantidade
        }));

        this.ingredients.set(ingredientes);
        this.ingredientsChange.emit(ingredientes);
        this.isLoading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar itens:', erro);
        this.isLoading.set(false);
      }
    });
  }

  addIngredient(ingredient: Item): void {
    const newIngredients = [...this.ingredients(), ingredient];
    this.ingredients.set(newIngredients);
    this.ingredientsChange.emit(newIngredients);
    this.closeModal();
  }

  removeIngredient(id: string): void {
  // Primeiro verifica se o ID é numérico (vindo do backend)
  const numericId = parseInt(id);

  if (!isNaN(numericId)) {
    // Se for um ID numérico, remove do servidor
    this.recipeService.removerItem(numericId).subscribe({
      next: () => {
        // Após sucesso no servidor, atualiza a lista local
        const newIngredients = this.ingredients().filter(i => i.id !== id);
        this.ingredients.set(newIngredients);
        this.ingredientsChange.emit(newIngredients);
      },
      error: (erro) => {
        console.error('Erro ao remover ingrediente:', erro);
        alert('Não foi possível remover o ingrediente. Por favor, tente novamente.');
      }
    });
  } else {
    // Se for um ID temporário (não numérico), apenas remove da lista local
    const newIngredients = this.ingredients().filter(i => i.id !== id);
    this.ingredients.set(newIngredients);
    this.ingredientsChange.emit(newIngredients);
  }
}

  onGenerateRecipe(): void {
    if (this.ingredients().length === 0) {
      alert('Adicione pelo menos um ingrediente');
      return;
    }

    this.isLoading.set(true);

    this.recipeService.generateRecipe(this.ingredients()).subscribe({
      next: (response) => {
        const recipe: Recipe = {
          id: Date.now().toString(),
          title: response.title,
          ingredients: this.ingredients(),
          instructions: response.instructions,
          //createdAt: new Date()
        };
        this.generateRecipe.emit(recipe);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao gerar receita:', error);
        alert('Erro ao gerar receita. Tente novamente!');
        this.isLoading.set(false);
      }
    });

  }

  getIngredientIcon(name: string): string {
    const icons: { [key: string]: string } = {
      'tomate': '🍅',
      'ovo': '🥚',
      'queijo': '🧀',
      'pão': '🍞',
      'leite': '🥛',
      'manteiga': '🧈',
      'sal': '🧂',
      'pimenta': '🌶️',
      'alho': '🧄',
      'cebola': '🧅',
      'cenoura': '🥕',
      'brócolis': '🥦',
      'alface': '🥬',
      'tofu': '🟫',
      'frango': '🍗',
      'carne': '🥩',
      'peixe': '🐟',
      'camarão': '🦐',
      'arroz': '🍚',
      'macarrão': '🍝',
      'feijão': '🫘',
      'lentilha': '🫘',
      'batata': '🥔',
      'abóbora': '🎃',
      'melancia': '🍉',
      'morango': '🍓',
      'banana': '🍌',
      'maçã': '🍎',
      'laranja': '🍊',
      'limão': '🍋',
      'abacaxi': '🍍',
      'uva': '🍇',
      'melão': '🍈',
      'pêra': '🍐',
      'chocolate': '🍫',
      'café': '☕',
      'chá': '🫖',
      'iogurte': '🥛',
      'mel': '🍯',
      'azeite': '🫒',
      'vinagre': '🍶',
      'molho': '🍲',
      'sopa': '🍲',
      'caldo': '🍲'
    };
    return icons[name.toLowerCase()] || '🥘';
  }
}

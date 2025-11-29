import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-add-ingredient-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-ingredient-modal.html',
  styleUrls: ['./add-ingredient-modal.scss']
})
export class AddIngredientModalComponent {
  ingredientName = signal('');
  quantity = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  close = output<void>();
  add = output<Item>();

  constructor(private recipeService: RecipeService) {}

  onAdd(): void {
    if (!this.ingredientName().trim()) {
      alert('Digite o nome do ingrediente');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Cria o objeto para enviar ao backend
    const backendItem: Item = {
      nome: this.ingredientName().trim(),
      quantidade: this.quantity().trim()
    };

    // Salva o item no backend
    this.recipeService.adicionarItem(backendItem).subscribe({
      next: (itemSalvo) => {
        // Converte o item salvo para o formato Ingredient usado no frontend
        const ingredient: Item = {
          id: itemSalvo.id?.toString() || Date.now().toString(),
          nome: itemSalvo.nome,
          quantidade: itemSalvo.quantidade
        };

        // Emite o evento com o novo ingrediente
        this.add.emit(ingredient);

        // Limpa os campos
        this.ingredientName.set('');
        this.quantity.set('');

        this.isLoading.set(false);

        // Fecha o modal após adicionar com sucesso
        this.onClose();
      },
      error: (erro) => {
        console.error('Erro ao adicionar ingrediente:', erro);
        this.errorMessage.set('Erro ao adicionar ingrediente. Por favor, tente novamente.');
        this.isLoading.set(false);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}

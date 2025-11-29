import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Item } from '../models/item.model';
import { Recipe } from '../models/recipe.model';
import { environment } from '../../environments/environment';

export interface GenerateRecipeResponse {
  title: string;
  instructions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Gera uma receita baseada nos ingredientes fornecidos
   * @param ingredients - Lista de ingredientes
   * @returns Observable com a receita gerada
   */
  generateRecipe(ingredients: Item[]): Observable<GenerateRecipeResponse> {
    const payload = {
      ingredients: ingredients.map(i => ({
        nome: i.nome,
        quantidade: i.quantidade
      }))
    };
    return this.http.get<GenerateRecipeResponse>(
      `${this.apiUrl}/api/v1/receita`,
    );
  }

  /**
   * Gera uma nova receita com os ingredientes disponíveis no backend
   * @returns Observable com a receita gerada em formato de texto
   */
  gerarNovaReceita(): Observable<Recipe> {
    return this.http.get(`${this.apiUrl}/api/v1/receita`, { responseType: 'text' })
      .pipe(
        map(textoReceita => this.converterTextoParaReceita(textoReceita))
      );
  }

  /**
   * Converte o texto retornado pela API em um objeto Recipe
   * @param texto - Texto da receita em formato markdown
   * @returns Objeto Recipe estruturado
   */
  private converterTextoParaReceita(texto: string): Recipe {
    // Extrair o título (primeira linha após "### ")
    const tituloMatch = texto.match(/### (.*)/);
    const titulo = tituloMatch ? tituloMatch[1] : 'Nova Receita';

    // Extrair ingredientes
    const ingredientesTexto = texto.match(/- (.*)/g) || [];
    const ingredientes = ingredientesTexto.map((item, index) => {
      const textoItem = item.replace('- ', '');

      // Tenta extrair a quantidade e o nome
      const match = textoItem.match(/^([\d/.,]+ .+?) (.+)$/);

      if (match) {
        return {
          id: `ing-${index}`,
          nome: match[2],
          quantidade: match[1]
        };
      } else {
        // Se não conseguir separar, usa o texto completo como nome
        return {
          id: `ing-${index}`,
          nome: textoItem,
          quantidade: ''
        };
      }
    });

    // Extrair instruções
    const instrucoesMatch = texto.split(/####.*Modo de Preparo|####.*Instruções|####.*Preparo/i);
    let instrucoesTexto = instrucoesMatch.length > 1 ? instrucoesMatch[1] : '';

    // Limpa e divide as instruções
    const instrucoes = instrucoesTexto
      .split(/\d+\.\s|\n-\s/) // Divide por números ou marcadores de lista
      .map(item => item.trim())
      .filter(item => item.length > 0);

    // Criar o objeto Recipe
    return {
      id: Date.now().toString(),
      title: titulo,
      ingredients: ingredientes,
      instructions: instrucoes
    };
  }

  /**
   * Salva uma receita no banco de dados
   * @param recipe - Receita a ser salva
   * @returns Observable com a receita salva
   */
  saveRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/api/v1/receita`, recipe);
  }

  /**
   * Busca todas as receitas
   * @returns Observable com lista de receitas
   */
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/api/v1/receita`);
  }

  /**
   * Deleta uma receita
   * @param id - ID da receita
   * @returns Observable void
   */
  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/v1/receita/${id}`);
  }

  /**
   * Atualiza uma receita
   * @param id - ID da receita
   * @param recipe - Dados atualizados
   * @returns Observable com a receita atualizada
   */
  updateRecipe(id: string, recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/api/v1/receita/${id}`, recipe);
  }

  /**
   * SESSÃO PARA ITEM(INGREDIENTES)
   */
  listarItens(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/api/v1/receita/itens`);
  }

  adicionarItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/api/v1/receita/itens`, item);
  }

  removerItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/v1/receita/itens/${id}`);
  }
}

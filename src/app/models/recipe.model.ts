import { Item } from "./item.model";

export interface Recipe {
    id: string;
    title: string;
    ingredients: Item[];
    instructions: string[];
    notes?: string;
    tags?: string[];
}

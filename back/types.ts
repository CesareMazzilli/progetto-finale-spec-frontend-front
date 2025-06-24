type NutritionalValue = {
  name: string; 
  quantity: number;
  unit: string;
};

export type Vegetable = {

  readonly title: string;
  readonly calories: number;
  readonly category: string;
  nutritionalValues: NutritionalValue[];
};
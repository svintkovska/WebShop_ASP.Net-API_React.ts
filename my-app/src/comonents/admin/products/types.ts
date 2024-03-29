export interface IProductItem{
    id: number,
    name: string,
    images: Array<string>,
    description: string,
    price: number,
    category: string
}

export interface IProductResult{
  products: Array<IProductItem>,
  pages: number,
  currentPage: number,
  total: number,
  categories: ICategory[]
}
export interface IProductSearch{
  name?: string,
  description?: string,
  categoryId: string,
  page?: number | string | null
}

export interface ICategoryItem{
  id: number,
  name: string,
  image: string,
  description: string
}

export interface ICategoryResult{
  categories: Array<ICategoryItem>,
  pages: number,
  currentPage: number,
  total: number,

}
export interface ICategorySearch{
  name?: string,
  description?: string,
  page?: number | string | null
}



export interface ICategory{
    id: number;
    name: string;
  }

  export interface IProductImage {
  file?: File;
  url: string;
}

export interface ICreateProduct {
    name: string;
    price: number;
    description: string;
    categoryId: number;
    categories: ICategory[];
    images: IProductImage[];
    files: File[];
  }


  export interface IEditProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    categoryId: number;
    categories: ICategory[];
    images: IProductImage[];
    currentImages: string[];
    files: File[]
  }


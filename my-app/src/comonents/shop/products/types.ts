
export interface IProductItem{
    id: number,
    name: string,
    price: number,
    images: string[],
    description: string
}

export interface IProductResult{
    products: Array<IProductItem>,
    pages: number,
    currentPage: number,
    total: number
  }

  export interface IProductSearch{
    name?: string,
    description?: string,
    categoryId: string,
    page?: number | string | null
  }
  

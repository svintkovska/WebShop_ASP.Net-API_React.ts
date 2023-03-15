using static System.Runtime.InteropServices.JavaScript.JSType;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Data.Entities;
using WebShop_API.Models;
using AutoMapper;

namespace WebShop_API.Mapper
{
    public class MapProfile : Profile
    {
        public MapProfile()
        {


            CreateMap<CategoryEntity, CategoryViewModel>();


        }
    }
}

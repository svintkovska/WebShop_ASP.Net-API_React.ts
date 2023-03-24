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
            CreateMap<OrderStatusEntity, OrderStatusViewModel>();
            CreateMap<OrderItemEntity, OrderItemViewModel>()
                        .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                        .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                        .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Count))
                        .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.PriceBuy))
                       .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Product.ProductImages
                            .OrderBy(pi => pi.Priority)
                            .Select(pi => pi.Name)
                            .FirstOrDefault()))
                        .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId));
        }

    }
    
}

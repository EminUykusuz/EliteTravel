using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using EliteTravel.Core.Entities;

namespace EliteTravel.Core.Services
{
    // Generic Service yapısı: Her entity (TEntity) ve DTO (TDto) için çalışır.
    public interface IService<TEntity, TDto> 
        where TEntity : BaseEntity 
        where TDto : class
    {
        Task<TDto> GetByIdAsync(int id);
        Task<IEnumerable<TDto>> GetAllAsync();
        
        // Özel filtreleme yapmak istersek (Örn: Fiyatı 500'den büyük olanlar)
        Task<IEnumerable<TDto>> Where(Expression<Func<TEntity, bool>> expression);
        
        Task<TDto> AddAsync(TDto dto);
        Task UpdateAsync(TDto dto, int id);
        Task RemoveAsync(int id);
    }
}
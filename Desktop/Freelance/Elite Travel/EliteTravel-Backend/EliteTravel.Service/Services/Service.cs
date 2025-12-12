using AutoMapper;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace EliteTravel.Service.Services
{
    public class Service<TEntity, TDto> : IService<TEntity, TDto> 
        where TEntity : BaseEntity 
        where TDto : class
    {
        protected readonly IGenericRepository<TEntity> _repository;
        protected readonly IUnitOfWork _unitOfWork;
        protected readonly IMapper _mapper;

        public Service(IGenericRepository<TEntity> repository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // DİKKAT: 'virtual' kelimesi eklendi. Bu sayede TourService bunları ezebilir.
        public virtual async Task<TDto> AddAsync(TDto dto)
        {
            var newEntity = _mapper.Map<TEntity>(dto);
            await _repository.AddAsync(newEntity);
            await _unitOfWork.CommitAsync();
            
            return _mapper.Map<TDto>(newEntity);
        }

        // 'virtual' eklendi
        public virtual async Task<IEnumerable<TDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<TDto>>(entities);
        }

        // 'virtual' eklendi
        public virtual async Task<TDto> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _mapper.Map<TDto>(entity);
        }

        // 'virtual' eklendi
        public virtual async Task RemoveAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            _repository.Remove(entity);
            await _unitOfWork.CommitAsync();
        }

        // 'virtual' eklendi
        public virtual async Task UpdateAsync(TDto dto, int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            _mapper.Map(dto, entity);
            _repository.Update(entity);
            await _unitOfWork.CommitAsync();
        }

        // 'virtual' eklendi
        public virtual async Task<IEnumerable<TDto>> Where(Expression<Func<TEntity, bool>> expression)
        {
            var entities = await _repository.Where(expression);
            return _mapper.Map<IEnumerable<TDto>>(entities);
        }
    }
}
using EliteTravel.Core.UnitOfWork;
using EliteTravel.Data.Contexts;

namespace EliteTravel.Data.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }
        public void Commit() => _context.SaveChanges();
        public async Task CommitAsync() => await _context.SaveChangesAsync();
    }
}

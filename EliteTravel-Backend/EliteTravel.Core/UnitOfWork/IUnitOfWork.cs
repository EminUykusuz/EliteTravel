using System.Threading.Tasks;

namespace EliteTravel.Core.UnitOfWork
{
    public interface IUnitOfWork
    {
        Task CommitAsync(); // Asenkron kaydetme
        void Commit();      // Senkron kaydetme
    }
}
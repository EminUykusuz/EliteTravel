using Minio;
using Minio.DataModel.Args;
using Microsoft.AspNetCore.Http;
using UykusuzPenApi.Services.Interfaces;

namespace UykusuzPenApi.Services.Interfaces
{
    public interface IMinioService
    {
        Task<string> UploadFileAsync(IFormFile file, string bucketName, string? folder = null);
        Task<string> UploadFileAsync(byte[] fileBytes, string fileName, string contentType, string bucketName, string? folder = null);
        Task<bool> DeleteFileAsync(string fileName, string bucketName);
        Task<Stream> DownloadFileAsync(string fileName, string bucketName);
        string GetFileUrl(string fileName, string bucketName);
    }
}
// DTOs/BlogDto.cs
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

public class BlogDto
{
    public int Id { get; set; }

    [Required] // Backend’de zorunlu alan
    public string Baslik { get; set; } = null!;

    [Required]
    public string Aciklama { get; set; } = null!;

    public IFormFile? Resim { get; set; }  // Dosya opsiyonel
    public string? ResimUrl { get; set; }  // Frontend’e dönecek public URL
    public DateTime OlusturulmaTarihi { get; set; }
}
    
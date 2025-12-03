using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.DTOs
{
public class LoginDto
{
    [Required]
    public string KullaniciAdi { get; set; }

    [Required]
    public string Sifre { get; set; }
}

    
    public class LoginResponseDto
    {
        public string? Token { get; set; }
        public KullaniciDto? Kullanici { get; set; }
    }
    
    public class KullaniciDto
    {
        public int Id { get; set; }
        public string? KullaniciAdi { get; set; }
        public string? AdSoyad { get; set; }
        public string? Email { get; set; }
    }
}
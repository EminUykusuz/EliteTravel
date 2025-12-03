public class Blog
{
    public int Id { get; set; }
    public string Baslik { get; set; } = null!;
    public string Aciklama { get; set; } = null!;
    public string? ResimUrl { get; set; } // Dosya yolu
    public DateTime OlusturulmaTarihi { get; set; } = DateTime.Now;
}

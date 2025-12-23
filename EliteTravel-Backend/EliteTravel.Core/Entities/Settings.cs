namespace EliteTravel.Core.Entities;

public class Settings : BaseEntity
{
    public string? SiteName { get; set; }
    public string? SiteEmail { get; set; }
    public string? SitePhone { get; set; }
    public string? Address { get; set; }
    
    // SEO Settings
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? GoogleAnalytics { get; set; }
    public string? FacebookPixel { get; set; }
    
    // Social Media
    public string? FacebookUrl { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? YoutubeUrl { get; set; }
}

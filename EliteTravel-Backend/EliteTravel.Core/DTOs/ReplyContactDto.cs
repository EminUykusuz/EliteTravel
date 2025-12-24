namespace EliteTravel.Core.DTOs
{
    public class ReplyContactDto
    {
        public string? ReplyMessage { get; set; }
        
        // Email language (tr, en, de, nl)
        public string? Language { get; set; } = "tr";
    }
}

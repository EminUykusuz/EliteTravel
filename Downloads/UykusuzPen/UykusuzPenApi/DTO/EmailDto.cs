namespace UykusuzPenApi.DTOs
{
    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string CustomerName { get; set; }
        public string OriginalMessage { get; set; }
    }
}
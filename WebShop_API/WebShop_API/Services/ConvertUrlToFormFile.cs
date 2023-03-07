namespace WebShop_API.Services
{
    public static class ConvertUrlToFormFile
    {
        public static async Task<IFormFile> ConvertUrlToIFormFile(string url)
        {
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(url);
                var content = await response.Content.ReadAsByteArrayAsync();
                var stream = new MemoryStream(content);

                var formFile = new FormFile(stream, 0, content.Length, null, Path.GetFileName(url))
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/jpeg" // Change to the appropriate content type
                };

                return formFile;
            }

            return null;
        }
    }
}

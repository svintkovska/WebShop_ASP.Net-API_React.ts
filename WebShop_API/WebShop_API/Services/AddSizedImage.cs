using Microsoft.AspNetCore.Http;
using System.Drawing;
using System.Drawing.Imaging;
using WebShop_API.Helpers;

namespace WebShop_API.Services
{
    public static class AddSizedImage
    {
        public static string AddImage(IApplicationBuilder app, string urlImage)
        {
            using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var _configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                string fileName = String.Empty;

                if (urlImage != null)
                {
                    var bmp = ImageWorker.UrlToBitmap(urlImage);

                    fileName = Path.GetRandomFileName() + ".jpg";
                    string[] imageSizes = ((string)_configuration.GetValue<string>("ImageSizes")).Split(" ");
                    foreach (var imageSize in imageSizes)
                    {
                        int size = int.Parse(imageSize);
                        string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", $"{size}_{fileName}");

                        var saveImage = ImageWorker.CompressImage(bmp, size, size, false, false);
                        saveImage.Save(dirSaveImage, ImageFormat.Jpeg);
                    }
                    return fileName;

                }
            }
            return null;
        }

        public static string AddIFormImage(IConfiguration configuration, IFormFile fileImage)
        {
            var _configuration = configuration;

            string fileName = String.Empty;
            if (fileImage != null)
            {

                var memoryStream = new MemoryStream();
                fileImage.CopyTo(memoryStream);
                var bmp = new Bitmap(memoryStream);


                fileName = Path.GetRandomFileName() + ".jpg";
                string[] imageSizes = ((string)_configuration.GetValue<string>("ImageSizes")).Split(" ");
                foreach (var imageSize in imageSizes)
                {
                    int size = int.Parse(imageSize);
                    string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", $"{size}_{fileName}");

                    var saveImage = ImageWorker.CompressImage(bmp, size, size, false, false);
                    saveImage.Save(dirSaveImage, ImageFormat.Jpeg);
                }
                return fileName;

            }
            return null;
        }
    }
}

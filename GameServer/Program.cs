var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Дозволяємо браузеру отримувати HTML, CSS, JS файли з папки "wwwroot"
app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();

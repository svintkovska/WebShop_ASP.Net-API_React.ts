using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebShop_API.Migrations
{
    /// <inheritdoc />
    public partial class AddNewColumnsToOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "tblOrders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NovaPoshtaCity",
                table: "tblOrders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NovaPoshtaWarehouse",
                table: "tblOrders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiverName",
                table: "tblOrders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiverPhone",
                table: "tblOrders",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "tblOrders");

            migrationBuilder.DropColumn(
                name: "NovaPoshtaCity",
                table: "tblOrders");

            migrationBuilder.DropColumn(
                name: "NovaPoshtaWarehouse",
                table: "tblOrders");

            migrationBuilder.DropColumn(
                name: "ReceiverName",
                table: "tblOrders");

            migrationBuilder.DropColumn(
                name: "ReceiverPhone",
                table: "tblOrders");
        }
    }
}

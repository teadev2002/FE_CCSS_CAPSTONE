import React from "react";
import { Search } from "lucide-react";
import "../styles/CostumeRental.scss";

const CostumeRental = () => {
    return (
        <div className="costume-rental-page min-vh-100">
            {/* Hero Section */}
            <div className="hero-section text-white py-5">
                <div className="container">
                    <h1 className="display-4 fw-bold text-center">Costume Rental</h1>
                    <p className="lead text-center mt-3">
                        Find and rent the perfect costume for any occasion
                    </p>
                </div>
            </div>

            <div className="container py-5">
                {/* Search Bar */}
                <div className="search-container mb-5">
                    <div className="search-bar mx-auto">
                        <div className="input-group">
                            <span className="input-group-text">
                                <Search size={20} />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search costumes..."
                            />
                        </div>
                    </div>
                </div>

                {/* Costume Grid */}
                <div className="costume-grid">
                    {costumes.map((costume) => (
                        <div className="costume-card" key={costume.id}>
                            <div className="card-image">
                                <img
                                    src={costume.image}
                                    alt={costume.name}
                                    className="img-fluid"
                                />
                            </div>
                            <div className="card-content">
                                <h5 className="costume-name">{costume.name}</h5>
                                <p className="costume-category">{costume.category}</p>
                                <button className="rent-button">Rent now!</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const costumes = [
    {
        id: 1,
        name: "Vampire Costume",
        category: "Halloween",
        image:
            "https://images.halloweencostumes.com/media/13/vampire/plus-size-womens-vampire-costume.jpg", // Người hóa trang ma cà rồng
    },
    {
        id: 2,
        name: "Pirate Costume",
        category: "Adventure",
        image:
            "https://images-cdn.ubuy.co.in/65322a9adb3fe5782951c1bf-pirate-men-s-halloween-fancy-dress.jpg", // Người mặc trang phục cướp biển
    },
    {
        id: 3,
        name: "Medieval Knight",
        category: "Fantasy",
        image:
            "https://m.armstreet.com/catalogue/small-mobile/medieval-knight-gothic-plate-armour-kit-33.jpg", // Hiệp sĩ mặc giáp thời trung cổ
    },
    {
        id: 4,
        name: "Witch Costume",
        category: "Halloween",
        image:
            "https://m.media-amazon.com/images/I/711uXaJ-Q-L._AC_UY350_.jpg", // Người hóa trang thành phù thủy với mũ và áo choàng
    },
    {
        id: 5,
        name: "Samurai Armor",
        category: "Historical",
        image:
            "https://i.etsystatic.com/9584443/r/il/e96f86/1727033660/il_300x300.1727033660_j52o.jpg", // Samurai mặc giáp truyền thống
    },
    {
        id: 6,
        name: "Egyptian Pharaoh",
        category: "Historical",
        image:
            "https://www.morphsuits.co.uk/media/catalog/product/m/c/mcwphq-pharao-queen-women_1_.jpg?width=810&height=810&store=morphsuitsuk_storeview&image-type=image", // Người mặc trang phục Pharaoh Ai Cập
    },
    {
        id: 7,
        name: "Clown Costume",
        category: "Circus",
        image:
            "https://m.media-amazon.com/images/I/71J5XYEb+rL.jpg", // Chú hề với trang phục sặc sỡ
    },
    {
        id: 8,
        name: "Steampunk Explorer",
        category: "Fantasy",
        image:
            "https://i.pinimg.com/736x/42/6c/4a/426c4a930176ac74d89c6db75628c7b2.jpg", // Người mặc đồ phong cách steampunk
    },
    {
        id: 9,
        name: "Greek Warrior",
        category: "Historical",
        image:
            "https://i.pinimg.com/474x/7e/34/fe/7e34fe25497ea349e8afc181b9e5ccb7.jpg", // Người mặc giáp chiến binh Hy Lạp
    },
    {
        id: 10,
        name: "Fairy Costume",
        category: "Fantasy",
        image:
            "https://lorlie.com/cdn/shop/products/ScreenShot2022-10-05at12.52.53AM.png?v=1694157408&width=1024", // Người mặc trang phục tiên nữ
    },
];


export default CostumeRental;

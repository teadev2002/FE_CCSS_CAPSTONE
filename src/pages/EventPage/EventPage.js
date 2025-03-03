import React from "react";
import { Search } from "lucide-react";
import { Tag } from "antd";
import "../../styles/EventPage.scss";

const EventPage = () => {
  return (
    <div className="events-page min-vh-100">
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Event Gallery</h1>
          <p className="lead text-center mt-3">
            Discover the best cosplay experiences and events!
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="search-container mb-5">
          <div className="search-bar mx-auto">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={20} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search events..."
              />
            </div>
          </div>
        </div>

        {/* Simplified Grid Layout */}
        <div className="events-grid">
          {mockEvents.map((event, index) => (
            <div className="event-card" key={index}>
              <div className="card-image">
                <img src={event.Image} alt={event.Name} />
              </div>
              <div className="card-content">
                <h5 className="event-name">{event.Name}</h5>
                <p className="event-description">{event.Description}</p>
                <div className="event-meta">
                  <Tag color="purple">{event.Type}</Tag>
                  <span className="event-date">
                    {new Date(event.CreateDate).toLocaleDateString()}
                  </span>
                </div>
                <button className="learn-more-btn">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const mockEvents = [
  {
    Name: "Halloween Party",
    Image:
      "https://th.bing.com/th/id/OIP.V5CwCp09fB_wbbqTz_or6AHaE8?rs=1&pid=ImgDetMain",
    Description: "Join us for a spooky night of cosplay and fun!",
    Type: "Seasonal",
    CreateDate: "2025-02-01",
  },
  {
    Name: "League of Legends Night",
    Image:
      "https://i.pinimg.com/736x/6c/58/12/6c58121c518d0a0c063728fd3fa5fc97--legends-cosplay.jpg",
    Description: "Show off your LOL-inspired cosplay and compete in games!",
    Type: "Gaming",
    CreateDate: "2025-01-15",
  },
  {
    Name: "Grand Opening Celebration",
    Image:
      "https://th.bing.com/th/id/OIP.6Rf1UJBidvTco9ddkyq-gQHaFj?rs=1&pid=ImgDetMain",
    Description: "Celebrate the launch of our new cosplay center!",
    Type: "Opening",
    CreateDate: "2025-01-01",
  },
  {
    Name: "Gaming Expo",
    Image:
      "https://th.bing.com/th/id/OIP.PwM5ggkqisJp03MXkjuGlAHaE7?rs=1&pid=ImgDetMain",
    Description: "Explore the latest in gaming and cosplay trends.",
    Type: "Expo",
    CreateDate: "2025-02-08",
  },
  {
    Name: "Halloween Party",
    Image:
      "https://th.bing.com/th/id/OIP.8XQkZJtoSCV8igQ8ulXENgHaE8?rs=1&pid=ImgDetMain",
    Description: "Join us for a spooky night of cosplay and fun!",
    Type: "Seasonal",
    CreateDate: "2025-02-01",
  },
  {
    Name: "League of Legends Night",
    Image:
      "https://i.pinimg.com/736x/6c/58/12/6c58121c518d0a0c063728fd3fa5fc97--legends-cosplay.jpg",
    Description: "Show off your LOL-inspired cosplay and compete in games!",
    Type: "Gaming",
    CreateDate: "2025-01-15",
  },
  {
    Name: "Grand Opening Celebration",
    Image:
      "https://synuma.com/wp-content/uploads/2020/12/shutterstock_1114217525.jpg",
    Description: "Celebrate the launch of our new cosplay center!",
    Type: "Opening",
    CreateDate: "2025-01-01",
  },
  {
    Name: "Gaming Expo",
    Image:
      "https://i.pinimg.com/736x/6c/58/12/6c58121c518d0a0c063728fd3fa5fc97--legends-cosplay.jpg",
    Description: "Explore the latest in gaming and cosplay trends.",
    Type: "Expo",
    CreateDate: "2025-02-08",
  },
];

export default EventPage;
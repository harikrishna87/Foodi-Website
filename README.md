# Restaurant Management Web Application

## Overview
This web application serves as a robust platform for restaurant management, offering a seamless user experience for browsing, selecting, and purchasing food items. Built using modern web technologies and frameworks, the application provides a fully functional, interactive interface with advanced features like authentication, dynamic pricing, and product filtering.

## Key Features
1. **Authentication**: Firebase Authentication is implemented to securely handle user login and registration. Users must log in to access the home page and other application features.
2. **Home Page**:
   - Showcases restaurant details, including:
     - **Testimonials**: Displays customer reviews.
     - **Services**: Overview of restaurant services.
     - **Customer Favorites**: Highlights popular dishes.
   - "Add to Cart" functionality with **SweetAlert** notifications confirming item additions.
  
   **User Profile**:
   - Accessible via an avatar dropdown.
   - Allows users to upload a profile picture.
   
3. **Menu Page**:
   - Displays food items categorized as:
     - Veg
     - Non-Veg
     - Desserts
     - Fruit Juices
     - Pizzas
     - Ice Creams
   - Includes **pagination** with each page displaying 8 items, ensuring smooth navigation through the menu.
   - Provides **filtering options** to display specific categories.
4. **Cart Page**:
   - Displays cart items in a **table format**.
   - Includes functionality to increment or decrement item quantities using **+/- buttons**, dynamically updating the total price.
   - Allows users to delete items from the cart.
   - Displays the overall total price of items in the cart.
5. **Payment Process**:
   - Includes a **payment popup** created using HTML, CSS, and Bootstrap.
   - Requires the user to enter payment details and click "Pay Now."
   - Displays a success message upon successful payment.
6. **Order Page**:
   - Lists purchased items in a **table format**, providing users with a clear view of their order history.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Frameworks**: Bootstrap, DaisyUI
- **Authentication**: Firebase Authentication
- **Alerts**: SweetAlert for user notifications
- **Dynamic Pricing**: JavaScript for real-time updates
- **Pagination and Filtering**: Custom JavaScript logic for menu navigation and filtering

## Features in Detail
### Authentication:
Firebase Authentication ensures secure user access. On successful login, users are redirected to the home page, where they can explore all features of the application.

### Home Page:
The home page serves as the central hub for restaurant information. Users can:
- View testimonials, services, and customer favorites.
- Add items to the cart with real-time alerts.

### User Profile:
The avatar dropdown allows users to:
- View their details.
- Upload a profile picture for personalization.

### Menu Page:
The menu page categorizes items for easy browsing. Features include:
- Pagination: Displays 8 cards per page with smooth navigation.
- Filtering: Enables users to filter items by category, such as Veg or Non-Veg, dynamically displaying relevant products.

### Cart Page:
The cart page offers a comprehensive view of selected items:
- **Dynamic Price Calculation**: Prices update automatically based on quantity changes.
- **Table Format**: Items are displayed in an organized table.
- **Cart Management**: Users can increment, decrement, or delete items.

### Payment:
A payment process built with HTML, CSS, and Bootstrap offers:
- A user-friendly popup interface.
- Real-time status updates with SweetAlert notifications confirming payment success.

### Order Page:
Displays all purchased items in a table format, providing an organized view of past orders.


## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd restaurant-management-app
   ```
3. Open `index.html` in your browser to start the application.

## Future Enhancements
- Integrate advanced payment gateways for a smoother checkout experience.
- Add user ratings and reviews for menu items.
- Implement push notifications for order updates.

## Conclusion
This project demonstrates a fully functional restaurant management system with advanced features like authentication, filtering, pagination, dynamic pricing, and an interactive payment system. The integration of modern frameworks and libraries ensures a responsive and user-friendly experience, making it a reliable solution for restaurant operations.


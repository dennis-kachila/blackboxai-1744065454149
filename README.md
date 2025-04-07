
Built by https://www.blackbox.ai

---

```markdown
# Makaazi - Find Your Dream Home

## Project Overview
Makaazi is a web application designed to help users find their ideal homes across Kenya. The platform features a user-friendly interface backed by a robust backend system that allows users to browse properties, register, and make bookings with transparent pricing. It is powered by a SQLite database and uses Express.js for the backend, making it efficient and responsive.

## Installation
To set up the Makaazi project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/makaazi.git
   ```
   
2. **Navigate to the project directory**:
   ```bash
   cd makaazi
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   node sqlite-server-fixed.js
   ```

5. **Open your browser** and visit:
   ```
   http://localhost:3000
   ```

## Usage
After starting the server, you can use the application by navigating through the main pages:

- **Home Page**: Displays a hero section for users to start their property search.
- **Register Page**: Users can create an account to save their favorite properties.
- **Login Page**: Existing users can access their accounts.
- **Counties Page**: A list of counties where users can find properties.
- **County Details**: Provides a list of towns within a selected county.
- **House Details**: Detailed information about a specific house, including booking options.
- **Payment Page**: Users can complete transactions and manage their bookings.

## Features
- Browse properties across all 47 counties in Kenya.
- Transparent pricing with no hidden fees.
- Secure booking system with multiple payment options.
- User registration and login functionalities.
- Dynamic loading of properties and counties.

## Dependencies
This project utilizes the following dependencies as listed in `package.json`:

- **Express**: A web application framework for Node.js.
- **Cors**: Middleware for enabling CORS (Cross-Origin Resource Sharing).
- **SQLite3**: SQLite database driver for Node.js.
- **Mysql2**: MySQL database driver (currently unused in this application but included in dependencies).

You can review the full list of dependencies and their versions in the `package.json` file.

## Project Structure
Here is an overview of the project structure:

```
makaazi/
│
├── public/
│   ├── index.html               # Main user interface
│   ├── register.html            # User registration form
│   ├── login.html               # User login form
│   ├── counties.html            # Displays list of counties
│   ├── county-details.html       # Detailed view for a selected county
│   ├── house-details.html        # Detailed view for a selected house
│   ├── payment.html              # Payment process view
│   └── styles.css                # Custom styles
│
├── scripts/                     
│   ├── scripts-final.js         # JavaScript for dynamic content handling
│   ├── sqlite-server-fixed.js    # Node.js server for handling requests
│   ├── db-helper.js              # Database helper methods
│
├── data.json                    # Sample data for properties and counties
├── package.json                  # Node.js dependencies
└── package-lock.json             # Dependency lock file
```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes. Make sure to follow the repository guidelines.

## License
This project is open-source and available under the [MIT License](LICENSE).
```
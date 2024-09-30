# Ddoksik Frontend

This is the frontend repository for the Ddoksik project, which offers diet and meal planning services. The application allows users to manage their health profiles, update diet plans, and receive nutritional guidance. It connects with various backend services to offer personalized experiences.

## Table of Contents

- [Project Features](#project-features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Docker Setup](#docker-setup)
- [Contributing](#contributing)
- [License](#license)

## Project Features

- **User Authentication**: User login and registration functionality using `Account.js` and `UserPool.js`.
- **Diet Management**: Users can update and track their diet plans with `UpdateDietPlans.js`.
- **Health Profile Management**: Manage personal health details using `HealthProfileService.js`.
- **Responsive Design**: Application is designed to work well on both desktop and mobile devices.
- **CSS and SCSS Styling**: Custom styles using various CSS and SCSS files.

## Technologies Used

- **React**: JavaScript library for building the user interface.
- **TypeScript**: Strongly typed language that builds on JavaScript.
- **Styled Components**: CSS-in-JS library used for styling components.
- **Axios**: HTTP client used to interact with backend services.
- **Docker**: Containerized deployment setup.

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn (for dependency management)

### Clone the Repository

```bash
git clone https://github.com/seungjun-Lee0/ddoksik-frontend.git
cd ddoksik-frontend
```

Install Dependencies
Using npm:

```bash
npm install
```
Or, using yarn:

```bash
yarn install
```
## Usage
Running the Application Locally
To start the development server, run the following command:

```bash
npm run start
```
Or, using yarn:

```bash
yarn start
```
This will start the application on http://localhost:3000.

Building for Production
To build the application for production, run:

```bash
npm run build
```
Or, using yarn:

```bash
yarn build
```
The production-ready code will be output to the build/ directory.

## Project Structure
```graphql
ddoksik-frontend/
│
├── public/                      # Static assets
│   ├── favicon.ico               # Favicon for the application
│   ├── index.html                # Main HTML file
│   ├── logo.png                  # Logo images
│   └── manifest.json             # Web app manifest
│
├── src/
│   ├── Context/                  # React context for user and authentication management
│   │   ├── Account.js            # Account management logic
│   │   └── UserPool.js           # Cognito or user pool configuration
│   ├── assets/css/               # Stylesheets (CSS/SCSS) for components
│   │   ├── Card.module.css       # Module CSS for card components
│   │   └── (various CSS files)   # Stylesheets for various components
│   ├── components/               # Reusable UI components
│   │   ├── diet/                 # Components related to diet features
│   │   ├── shared/               # Shared components across the app
│   │   └── user/                 # Components related to user profiles
│   ├── services/                 # API interaction services
│   │   ├── AuthService.js        # Handles authentication requests
│   │   ├── DietService.js        # Handles diet-related API calls
│   │   ├── HealthProfileService.js # Health profile API calls
│   │   └── ApiClient.js          # Axios client configuration
│   ├── App.js                    # Main application component
│   ├── App.test.js               # Application tests
│   ├── index.js                  # Main entry point
│   └── setupTests.js             # Setup for testing framework
│
├── .gitignore                    # Files and directories to ignore in Git
├── Dockerfile                    # Docker configuration for the project
├── default.conf                  # Default configuration for Nginx or web server
├── package.json                  # Project dependencies and scripts
└── README.md                     # Project documentation
```
## Docker Setup
This project includes a Dockerfile for containerized deployment. Follow these steps to set up and run the project inside a Docker container:

Build Docker Image
```bash
docker build -t ddoksik-frontend .
```
Run Docker Container
```bash
docker run -p 3000:3000 ddoksik-frontend
```
This will start the application in a Docker container and expose it on http://localhost:3000.

## Contributing
We welcome contributions! Please follow these steps to contribute to the project:

Fork the repository.
Create a new branch for your feature/bugfix (git checkout -b feature-name).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature-name).
Open a pull request.
Please ensure your code follows the project's coding standards and includes relevant tests.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

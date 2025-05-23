# Amazon Bid Master

A comprehensive Amazon PPC campaign management and optimization platform designed to help Amazon sellers and agencies maximize their advertising ROI. It leverages machine learning-powered bid recommendations, automated rules, and performance forecasting to streamline campaign management, improve ad performance, and drive sales growth. This platform is ideal for Amazon PPC managers, agencies, and sellers who want to automate and optimize their advertising efforts.

## What is Amazon Bid Master?

Amazon Bid Master is an end-to-end solution for managing and optimizing Amazon PPC campaigns. It provides a suite of tools and features that help users to:

*   Automate bid adjustments based on performance metrics.
*   Improve ad performance and reduce advertising costs.
*   Forecast future campaign performance with confidence intervals.
*   Get insights and recommendations from an AI assistant.
*   Easily import campaign data and export reports.

## Why is this app needed?

Managing Amazon PPC campaigns can be a complex and time-consuming task. Amazon Bid Master simplifies this process by automating many of the tasks involved in campaign management, such as bid adjustments, rule creation, and performance forecasting. This allows users to focus on other important aspects of their business, such as product development and customer service.

## Who should use this app?

Amazon Bid Master is designed for:

*   Amazon PPC Managers: Professionals who manage Amazon PPC campaigns for businesses.
*   Agencies: Marketing agencies that provide Amazon PPC services to their clients.
*   Amazon Sellers: Businesses that sell products on Amazon and want to optimize their advertising efforts.

## Features

- **Campaign Management**: View and analyze all your Amazon PPC campaigns in one place
- **ML-Powered Bid Optimization**: Get intelligent bid recommendations based on campaign performance
- **Automated Rules**: Create custom rules to automate bid adjustments based on performance metrics
- **Performance Forecasting**: Predict future campaign performance with confidence intervals
- **PPC Expert Chatbot**: Get insights and recommendations from an AI assistant
- **CSV Import/Export**: Easily import campaign data and export reports

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI/ML**: Google Gemini (default), OpenAI, Anthropic APIs for chatbot, custom ML models for bid optimization

## Project Structure

The project follows a clean architecture approach with clear separation of concerns:

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript type definitions
│
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API route definitions
│   │   └── utils/          # Utility functions
│
└── shared/                 # Shared code between frontend and backend
    ├── ml/                 # Machine learning models
    ├── schema.ts           # Database schema
    ├── services/           # Shared services
    └── types/              # TypeScript types
```

## Getting Started

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/amazon-bid-master.git
   cd amazon-bid-master
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_database_url
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   GOOGLE_API_KEY=your_google_api_key

**Note:** The AI services require the API keys to be set in the `.env` file.

4. Start the development server:
   ```
   npm run dev
   ```
   This will start:
   - The backend server on http://localhost:4000
   - The frontend development server on http://localhost:3000

   You can also run them separately:
   ```
   # Run only the backend server
   npm run dev:server

   # Run only the frontend development server
   npm run dev:client
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Prerequisites

- Node.js 18+
- npm or yarn

### Running Locally via Terminal

### Running via Docker

1.  Install Docker:
    [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
2.  Build the Docker image:
    ```
    docker build -t amazon-bid-master .
    ```
3.  Run the Docker container:
    ```
    docker run -p 3000:3000 -p 4000:4000 amazon-bid-master
    ```
4.  Open your browser and navigate to `http://localhost:3000`

### Building for Production

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

3. The application will be available at http://localhost:4000

### Running via VPS

1.  Set up a VPS:
    *   Choose a VPS provider (e.g. DigitalOcean, AWS, Google Cloud).
    *   Create a new VPS instance with Ubuntu 20.04 or later.
    *   Connect to the VPS via SSH.
2.  Install Node.js and npm:
    ```
    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
3.  Install PostgreSQL:
    ```
    sudo apt-get update
    sudo apt-get install postgresql postgresql-contrib
    ```
4.  Clone the repository:
    ```
    git clone https://github.com/yourusername/amazon-bid-master.git
    cd amazon-bid-master
    ```
5.  Install dependencies:
    ```
    npm install
    ```
6.  Set up environment variables:
    Create a `.env` file in the root directory with the following variables:
    ```
    DATABASE_URL=your_database_url
    OPENAI_API_KEY=your_openai_api_key
    ANTHROPIC_API_KEY=your_anthropic_api_key
    GOOGLE_API_KEY=your_google_api_key

**Note:** The AI services require the API keys to be set in the `.env` file.
7.  Set up the database:
    *   Connect to the PostgreSQL server:
        ```
        sudo -u postgres psql
        ```
    *   Create a new database:
        ```
        CREATE DATABASE amazon_bid_master;
        ```
    *   Create a new user:
        ```
        CREATE USER amazon_bid_master WITH PASSWORD 'your_password';
        ```
    *   Grant privileges to the user:
        ```
        GRANT ALL PRIVILEGES ON DATABASE amazon_bid_master TO amazon_bid_master;
        ```
    *   Exit the PostgreSQL server:
        ```
        \q
        ```
8.  Run the database migrations:
    ```
    npx drizzle-kit generate:pg
    npx drizzle-kit push:pg
    ```
9.  Build the application:
    ```
    npm run build
    ```
10. Start the production server:
    ```
    npm start
    ```
11. Configure a reverse proxy:
    *   Install Nginx:
        ```
        sudo apt-get install nginx
        ```
    *   Create a new Nginx configuration file:
        ```
        sudo nano /etc/nginx/sites-available/amazon-bid-master
        ```
    *   Add the following configuration:
        ```
        server {
            listen 80;
            server_name your_domain.com;

            location / {
                proxy_pass http://localhost:4000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
            }
        ```
    *   Enable the new configuration:
        ```
        sudo ln -s /etc/nginx/sites-available/amazon-bid-master /etc/nginx/sites-enabled/
        ```
    *   Restart Nginx:
        ```
        sudo systemctl restart nginx
        ```

12. Open your browser and navigate to `http://your_domain.com`

### Running via Cloud

1.  Choose a cloud provider (e.g. AWS, Google Cloud, Azure).
2.  Create a new project or resource group.
3.  Set up a virtual machine:
    *   Choose an Ubuntu 20.04 or later image.
    *   Configure the virtual machine with at least 2GB of RAM and 2 vCPUs.
    *   Open ports 80, 443, 3000, and 4000 in the firewall.
4.  Connect to the virtual machine via SSH.
5.  Install Node.js and npm:
    ```
    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
6.  Install PostgreSQL:
    ```
    sudo apt-get update
    sudo apt-get install postgresql postgresql-contrib
    ```
7.  Clone the repository:
    ```
    git clone https://github.com/yourusername/amazon-bid-master.git
    cd amazon-bid-master
    ```
8.  Install dependencies:
    ```
    npm install
    ```
9.  Set up environment variables:
    Create a `.env` file in the root directory with the following variables:
    ```
    DATABASE_URL=your_database_url
    OPENAI_API_KEY=your_openai_api_key
    ANTHROPIC_API_KEY=your_anthropic_api_key
    GOOGLE_API_KEY=your_google_api_key

**Note:** The AI services require the API keys to be set in the `.env` file.
10. Set up the database:
    *   Connect to the PostgreSQL server:
        ```
        sudo -u postgres psql
        ```
    *   Create a new database:
        ```
        CREATE DATABASE amazon_bid_master;
        ```
    *   Create a new user:
        ```
        CREATE USER amazon_bid_master WITH PASSWORD 'your_password';
        ```
    *   Grant privileges to the user:
        ```
        GRANT ALL PRIVILEGES ON DATABASE amazon_bid_master TO amazon_bid_master;
        ```
    *   Exit the PostgreSQL server:
        ```
        \q
        ```
11. Run the database migrations:
    ```
    npx drizzle-kit generate:pg
    npx drizzle-kit push:pg
    ```
12. Build the application:
    ```
    npm run build
    ```
13. Start the production server:
    ```
    npm start
    ```
14. Configure a reverse proxy:
    *   Install Nginx:
        ```
        sudo apt-get install nginx
        ```
    *   Create a new Nginx configuration file:
        ```
        sudo nano /etc/nginx/sites-available/amazon-bid-master
        ```
    *   Add the following configuration:
        ```
        server {
            listen 80;
            server_name your_domain.com;

            location / {
                proxy_pass http://localhost:4000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
            }
        ```
    *   Enable the new configuration:
        ```
        sudo ln -s /etc/nginx/sites-available/amazon-bid-master /etc/nginx/sites-enabled/
        ```
    *   Restart Nginx:
        ```
        sudo systemctl restart nginx
        ```
15. Configure a domain name:
    *   Purchase a domain name from a domain registrar (e.g. GoDaddy, Namecheap).
    *   Create a new DNS record that points to the virtual machine's IP address.
16. Configure HTTPS:
    *   Install Certbot:
        ```
        sudo apt-get install certbot python3-certbot-nginx
        ```
    *   Obtain a SSL certificate:
        ```
        sudo certbot --nginx -d your_domain.com
        ```

## API Endpoints

### Campaigns

- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get a specific campaign
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/:id/bid-prediction` - Get bid prediction for a campaign
- `GET /api/campaigns/:id/forecast` - Get forecast for a campaign
- `GET /api/campaigns/bulk-bid-predictions` - Get bid predictions for all campaigns

### Rules

- `GET /api/rules` - Get all rules
- `GET /api/rules/:id` - Get a specific rule
- `POST /api/rules` - Create a new rule
- `PATCH /api/rules/:id` - Update a rule
- `POST /api/rules/validate` - Validate a rule

### Recommendations

- `GET /api/recommendations` - Get all recommendations
- `POST /api/recommendations` - Create a new recommendation

### Chat

- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/conversations/:id` - Get a specific conversation
- `POST /api/chat/conversations` - Create a new conversation
- `POST /api/chat/messages/:id` - Send a message in a conversation
- `DELETE /api/chat/conversations/:id` - Delete a conversation
- `GET /api/chat/models` - Get available AI models

### CSV Upload

- `POST /api/upload-csv` - Upload campaign data via CSV

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Documentation

[Wiki Docs](https://github.com/meerhamza00/AmazonBidMaster/blob/main/WIKI.md) (Content for the wiki pages is available in the WIKI.md file)

## Acknowledgements

- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Recharts](https://recharts.org/) - Charting library
- OpenAI (https://openai.com/) - AI services
- Anthropic (https://www.anthropic.com/) - AI services
- Google Gemini (https://ai.google.dev/) - AI services

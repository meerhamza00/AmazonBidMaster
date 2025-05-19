# Amazon Bid Master Wiki

## Home

Welcome to the Amazon Bid Master wiki! This wiki provides comprehensive documentation for the project, including installation instructions, configuration details, usage examples, and more.

## Getting Started

### Installation

1.  Clone the repository:
    ```
    git clone https://github.com/yourusername/amazon-bid-master.git
    cd amazon-bid-master
    ```

2.  Install dependencies:
    ```
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory with the following variables:
    ```
    DATABASE_URL=your_database_url
    OPENAI_API_KEY=your_openai_api_key
    ANTHROPIC_API_KEY=your_anthropic_api_key
    GOOGLE_API_KEY=your_google_api_key
    ```
    **Note:** The AI services require the API keys to be set in the `.env` file.

4.  Start the development server:
    ```
    npm run dev
    ```
    This will start:
    *   The backend server on http://localhost:4000
    *   The frontend development server on http://localhost:3000

    You can also run them separately:
    ```
    # Run only the backend server
    npm run dev:server

    # Run only the frontend development server
    npm run dev:client
    ```

5.  Open your browser and navigate to `http://localhost:3000`

### Prerequisites

- Node.js 18+
- npm or yarn

## Configuration

This section describes how to configure the Amazon Bid Master project.

### Environment Variables

The following environment variables are required to run the project:

- `DATABASE_URL`: The URL of the PostgreSQL database.
- `OPENAI_API_KEY`: The API key for the OpenAI service.
- `ANTHROPIC_API_KEY`: The API key for the Anthropic service.
- `GOOGLE_API_KEY`: The API key for the Google Gemini service.

### Settings

The following settings can be configured in the `.env` file:

- `PORT`: The port on which the backend server will listen (default: 4000).
- `CLIENT_PORT`: The port on which the frontend development server will listen (default: 3000).

## Usage

This section provides examples and tutorials on how to use the Amazon Bid Master project.

### Campaign Management

This section describes how to manage Amazon PPC campaigns using the Amazon Bid Master platform.

### Automated Rules

This section describes how to create and manage automated rules for bid adjustments.

### Performance Forecasting

This section describes how to use the performance forecasting feature to predict future campaign performance.

### PPC Expert Chatbot

This section describes how to use the PPC Expert Chatbot to get insights and recommendations.

### CSV Import/Export

This section describes how to import campaign data and export reports using CSV files.

## API Endpoints

This section documents the project's API endpoints.

### Campaigns

- `GET /api/campaigns`: Get all campaigns
- `GET /api/campaigns/:id`: Get a specific campaign
- `POST /api/campaigns`: Create a new campaign
- `GET /api/campaigns/:id/bid-prediction`: Get bid prediction for a campaign
- `GET /api/campaigns/:id/forecast`: Get forecast for a campaign
- `GET /api/campaigns/bulk-bid-predictions`: Get bid predictions for all campaigns

### Rules

- `GET /api/rules`: Get all rules
- `GET /api/rules/:id`: Get a specific rule
- `POST /api/rules`: Create a new rule
- `PATCH /api/rules/:id`: Update a rule
- `POST /api/rules/validate`: Validate a rule

### Recommendations

- `GET /api/recommendations`: Get all recommendations
- `POST /api/recommendations`: Create a new recommendation

### Chat

- `GET /api/chat/conversations`: Get all conversations
- `GET /api/chat/conversations/:id`: Get a specific conversation
- `POST /api/chat/conversations`: Create a new conversation
- `POST /api/chat/messages/:id`: Send a message in a conversation
- `DELETE /api/chat/conversations/:id`: Delete a conversation
- `GET /api/chat/models`: Get available AI models

### CSV Upload

- `POST /api/upload-csv`: Upload campaign data via CSV

## Contribution Guidelines

This section provides information for developers who want to contribute to the project.

### Code Style

Please follow the code style guidelines used in the project.

### Pull Requests

Please submit pull requests with clear and concise descriptions of the changes.

## Troubleshooting

This section provides solutions to common issues.

### Issue 1

Solution 1

### Issue 2

Solution 2

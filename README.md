# Amazon Bid Master

A comprehensive Amazon PPC campaign management and optimization platform with ML-powered bid recommendations, automated rules, and performance forecasting.

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
- **AI/ML**: OpenAI, Anthropic, Google Gemini APIs for chatbot, custom ML models for bid optimization

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
    └── types/              # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

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
   ```

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

## Acknowledgements

- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Recharts](https://recharts.org/) - Charting library
- [OpenAI](https://openai.com/) - AI services
- [Anthropic](https://www.anthropic.com/) - AI services
- [Google Gemini](https://ai.google.dev/) - AI services

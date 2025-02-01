# DeepSeek Chatbot

A simple chatbot template built using the AI SDK and DeepSeek R1 Distill LLaMA 70B, powered by Groq.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **AI Integration**: Vercel AI SDK with DeepSeek R1 Distill LLaMA 70B

## Features

- Modern, responsive UI with dark mode support
- Real-time chat interface
- Auto-resizing text areas
- Toast notifications
- Custom theming with CSS variables
- Markdown support for chat messages

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - React components
  - `/ui` - shadcn/ui components
- `/lib` - Utility functions
- `/hooks` - Custom React hooks
- `/styles` - Global CSS and Tailwind configuration

## Environment Variables

Update the `.env` file with the following variables:

- `DEEPSEEK_BASE_URL`
- `DEEPSEEK_API_KEY`


## License

This project is open-sourced under the MIT License.


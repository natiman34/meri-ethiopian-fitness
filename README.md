# Meri Ethiopian Fitness Application

A comprehensive fitness and nutrition management application built with React, TypeScript, and Supabase.

## 🚀 Features

- **User Authentication**: Secure login and registration system with password reset
- **BMI Calculator**: Calculate and track your Body Mass Index
- **Fitness Plans**: Personalized workout plans and tracking
- **Nutrition Plans**: Customized meal plans and nutrition guidance
- **Educational Content**: Fitness and nutrition educational materials
- **Motivational Content**: Inspirational content to keep you motivated
- **Admin Dashboard**: Comprehensive admin panel for content management
- **User Profiles**: Personal profile management and progress tracking

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Headless UI
- **Backend**: Supabase (Database, Authentication, Real-time)
- **State Management**: React Context API
- **Form Handling**: Formik with Yup validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   ├── models/        # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── types/         # Type definitions
│   ├── scripts/           # Database and setup scripts
│   └── supabase/          # Supabase configuration
├── supabase/              # Supabase project files and functions
└── package.json           # Root dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your Supabase URL and anon key
   - Create a `.env` file in the `client` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📝 Available Scripts

### Client Directory
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. Run the database setup scripts in `client/scripts/`
2. Configure authentication settings in Supabase dashboard
3. Set up storage buckets if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/yourusername/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Built with React and TypeScript
- Powered by Supabase
- Styled with Tailwind CSS
- Icons by Lucide React 
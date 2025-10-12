# 🌿 EcoNexo - Community Sustainability Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000)](https://vercel.com/)

EcoNexo is a comprehensive platform that connects sustainable communities, facilitates participation in ecological events, and promotes green jobs. Our mission is to create a digital ecosystem that drives collective environmental action.

## 🚀 Key Features

### 📅 **Event Management**
- Creation and participation in sustainable events
- Interactive calendar with monthly, weekly, and list views
- Categorization by themes (Environment, Education, Health, Community, Oceans, Nutrition)
- Detailed registration system with comprehensive forms
- Event geolocation

### 💼 **Green Jobs Portal**
- Advanced search for sustainable jobs
- Filters by location, salary, experience, and modality
- Complete application form with:
  - Motivations and areas of expertise
  - PDF motivation letter upload
  - CV and portfolio links
- Job favorites saving system

### 💬 **Community Chat**
- Thematic forums organized by categories
- Real-time chat with online users
- Personalized recommendations system
- Automatic moderation and community guidelines

### 🌍 **Internationalization**
- Full support for Spanish, English, and German
- Automatic content translation
- Cultural interface adaptation

### 🎨 **Responsive Design**
- Modern interface with light and dark modes
- Mobile-first design
- Enhanced accessibility
- Optimized user experience

## 🛠️ Technologies Used

- **Frontend:** Next.js 15.5.4, React 18, TypeScript
- **Styling:** Tailwind CSS, CSS Modules
- **State:** React Hooks, Context API
- **Internationalization:** Custom i18n system
- **Deployment:** Vercel
- **Version Control:** Git, GitHub

## 📦 Installation and Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/econexo.git
cd econexo
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configurations
```

4. **Run in development mode**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── eventos/           # Event pages
│   ├── trabajos/          # Jobs portal
│   ├── chat/              # Community chat
│   └── proyectos/         # Project management
├── components/            # Reusable components
│   ├── CalendarView.tsx   # Calendar view
│   ├── EventDetailClient.tsx # Event details
│   └── ChatComponent.tsx  # Community chat
├── lib/                  # Utilities and configurations
│   └── i18n.ts          # Internationalization system
└── styles/              # Global styles
```

## 🌐 Main Pages

### `/eventos` - Event Management
- Event creation form
- List of existing events
- Categorization system

### `/trabajos` - Jobs Portal
- Job search and filtering
- Enhanced application form
- Favorites saving system

### `/chat` - Community
- Organized thematic forums
- Real-time chat
- Personalized recommendations

### `/proyectos` - Sustainable Projects
- Community project management
- Progress tracking
- Team collaboration

## 🎯 Highlighted Features

### Advanced Event System
- **Intuitive creation:** Complete form with validation
- **Smart categorization:** 6 main categories + subcategories
- **Geolocation:** Integration with specific locations
- **Capacity management:** Participant control

### Complete Jobs Portal
- **Advanced search:** Multiple combinable filters
- **Professional application:** Form with motivations, expertise, and documents
- **Smart saving:** Persistent favorites system
- **Internationalization:** Jobs in multiple languages

### Thematic Community Chat
- **Organized forums:** 6 main thematic categories
- **Real-time chat:** Instant connection
- **Recommendations:** Personalized suggestions system
- **Moderation:** Clear community guidelines

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Configure environment variables
3. Automatic deploy on each push

### Other Providers
- **Netlify:** Compatible with Next.js
- **Railway:** Deploy with included database
- **DigitalOcean:** Custom VPS

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code conventions
- Add tests for new features
- Update documentation as needed
- Respect accessibility principles

## 📝 Roadmap

### Upcoming Features
- [ ] Push notification system
- [ ] Social media integration
- [ ] Analytics dashboard
- [ ] Badges and gamification system
- [ ] Public API for developers
- [ ] Native mobile app

### Planned Improvements
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Complete automated tests
- [ ] API documentation
- [ ] Automatic backup system

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 👥 Team

- **Frontend Development:** Santiago
- **UX/UI Design:** Design team
- **Internationalization:** Translation team

## 📞 Contact

- **Email:** contact@econexo.org
- **Website:** [econexo.org](https://econexo.org)
- **GitHub:** [github.com/econexo](https://github.com/econexo)

## 🙏 Acknowledgments

- Next.js community for excellent documentation
- Tailwind CSS for the design system
- Vercel for the deployment platform
- All EcoNexo contributors and users

---

**Join the sustainability revolution! 🌱**

*EcoNexo - Connecting communities for a greener future*
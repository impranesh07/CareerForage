import { useState } from "react";
import AiAssistantSection from "../components/AiAssistantSection";
import FeaturesSection from "../components/FeaturesSection";
import FinalCta from "../components/FinalCta";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";

const HomePage = ({ onLogin, onRegister, isDarkMode, onToggleDarkMode }) => {
  const [chatMessage, setChatMessage] = useState("");

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <Header onLogin={onLogin} onRegister={onRegister} isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
      <main>
        <HeroSection onRegister={onRegister} />
        <FeaturesSection />
        <HowItWorksSection />
        <AiAssistantSection chatMessage={chatMessage} onChatMessageChange={setChatMessage} />
        <FinalCta onRegister={onRegister} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

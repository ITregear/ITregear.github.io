import { SiLinkedin, SiGithub, SiX } from "react-icons/si";
import Header from "@/components/header";
import DocumentSection from "@/components/document-section";
import RedactedText from "@/components/ui/redacted-text";
import TabsNav from "@/components/ui/tabs";
import SEO from "@/components/seo";
import { trackExternalLinkClick } from "@/lib/utils";

export default function Home() {
  const handleSocialClick = (platform: string) => {
    console.log(`Navigate to ${platform} profile`);
  };

  const handleLinkClick = (linkType: string) => {
    console.log(`Navigate to ${linkType}`);
  };

  return (
    <div className="bg-vintage-beige text-typewriter-dark font-typewriter">
      <SEO 
        title="Ivan Tregear - Engineer & Entrepreneur"
        description="Chief Technology Officer at KAIKAKU, working on fast food robotics and automation. Co-founder of KAIKAKU and Apollo Tech, Forbes 30 Under 30."
        url="https://ivantregear.com/"
        type="website"
      />
      <Header />
      <TabsNav />
      {/* Main Content */}
      <main className="container mx-auto px-6 pt-[12px] md:pt-[24px] pb-[24px]" role="main">
        {/* Bento Box 2x2 Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 min-h-[400px] md:min-h-[600px]">
            
            {/* Left Column: Personnel File + Reference Materials */}
            <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
              {/* Top Left: Personnel File */}
              <DocumentSection 
                title="PERSONNEL FILE" 
                className="flex-1"
                footer="UPDATED: JUN 2025"
              >
                <div className="space-y-2 text-sm typewriter-text" role="list">
                  <div className="bullet-point" role="listitem">Mechanical Engineering MEng</div>
                  <div className="bullet-point" role="listitem">Imperial College London</div>
                  <div className="bullet-point" role="listitem">Co-Founder and CTO at KAIKAKU</div>
                  <div className="bullet-point" role="listitem">Co-Founder of Apollo Tech</div>
                  <div className="bullet-point" role="listitem">Forbes 30 Under 30</div>
                  <div className="bullet-point" role="listitem">Professional Voice Over Artist</div>
                </div>
              </DocumentSection>

              {/* Bottom Left: Reference Materials */}
              <DocumentSection 
                title="REFERENCE MATERIALS" 
                className="flex-1"
                footer="ACCESS LEVEL: PUBLIC"
              >
                <div className="space-y-2 text-sm typewriter-text" role="list">
                  <div className="bullet-point" role="listitem">
                    <a
                      href="https://www.kaikaku.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://www.kaikaku.ai/")}
                      aria-label="Visit KAIKAKU website"
                    >
                      KAIKAKU
                    </a>
                  </div>
                  <div className="bullet-point" role="listitem">
                    <a
                      href="https://saysovoices.com/talent/ivan-tregear/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://saysovoices.com/talent/ivan-tregear/")}
                      aria-label="View voice over work for Nickelodeon and Cartoon Network"
                    >
                      VOICE OVER (NICKELODEON, CARTOON NETWORK)
                    </a>
                  </div>
                  <div className="bullet-point" role="listitem">
                    <a
                      href="https://www.forbes.com/profile/kaikaku/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://www.forbes.com/profile/kaikaku/")}
                      aria-label="View Forbes 30 Under 30 profile"
                    >
                      FORBES 30U30 LIST
                    </a>
                  </div>
                  <div className="bullet-point" role="listitem">
                    <a
                      href="https://www.telegraph.co.uk/business/2024/08/25/would-you-eat-meal-cooked-robot-meet-machines-taking-over/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://www.telegraph.co.uk/business/2024/08/25/would-you-eat-meal-cooked-robot-meet-machines-taking-over/")}
                      aria-label="Read Telegraph article about KAIKAKU"
                    >
                      KAIKAKU IN THE NEWS
                    </a>
                  </div>
                  <div className="bullet-point" role="listitem">
                    <a
                      href="https://powerboat.world/news/255273/Reading-Rumble-2022-at-Burghfield"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://powerboat.world/news/255273/Reading-Rumble-2022-at-Burghfield")}
                      aria-label="Read about Reading Rumble 2022 victory"
                    >
                      READING RUMBLE 2022 VICTORS
                    </a>
                  </div>
                </div>
              </DocumentSection>
            </div>

            {/* Right Column: Operational Summary + Comms */}
            <div className="md:col-span-3 flex flex-col gap-4 md:gap-6">
              {/* Top Right: Operational Summary */}
              <DocumentSection 
                title="SUMMARY" 
                className="flex-[4]"
                footer={`DOCUMENT TYPE: BRIEFING\nORIGIN: TECHNICAL DIVISION`}
              >
                <div className="text-sm typewriter-text leading-relaxed text-typewriter-medium">
                  I am a Chief Technology Officer working in the glamarous field of Fast Food Robotics. Along with Josef Chen, we founded KAIKAKU, where we are revolutionising the world of Quick Service Restaurants through hardware, software and AI. In 18 months we have deployed 4 food assembly robots (the Fusion family) that have all served food to real paying customers (click the image to see them all).

Our goal is to automate the laborious and menial tasks that no human craves, with low cost and targeted robotics, allowing humans to focus on what they will always be superior to machines at; being hospitable.

I studied Mechanical Engineering at Imperial College London, with a specialisation in mechatronics and control. At university I sailed (see the Reading Rumble link for my Mangum Opus), went to 568 too many times, and was awarded the Imperial Centenary Prize. In my free time I like to build robots or RC planes, cook meals I watched from a YouTube video without a recipe, and do jujitsu.
                </div>
              </DocumentSection>

              {/* Bottom Right: Comms */}
              <DocumentSection 
                title="COMMUNICATIONS" 
                className="min-h-[120px]"
                footer="STATUS: ACTIVE"
              >
                <div className="flex justify-center space-x-6" role="list" aria-label="Social media links">
                  <a
                    href="https://www.linkedin.com/in/ivantregear"
                    className="social-icon text-2xl text-typewriter-dark"
                    aria-label="LinkedIn Profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackExternalLinkClick("https://www.linkedin.com/in/ivantregear")}
                    role="listitem"
                  >
                    <SiLinkedin />
                  </a>
                  <a
                    href="https://github.com/ITregear"
                    className="social-icon text-2xl text-typewriter-dark"
                    aria-label="GitHub Profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackExternalLinkClick("https://github.com/ITregear")}
                    role="listitem"
                  >
                    <SiGithub />
                  </a>
                  <a
                    href="https://x.com/IvanTregear"
                    className="social-icon text-2xl text-typewriter-dark"
                    aria-label="X (Twitter) Profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackExternalLinkClick("https://x.com/IvanTregear")}
                    role="listitem"
                  >
                    <SiX />
                  </a>
                </div>
              </DocumentSection>
            </div>
          </div>
        </div>
      </main>
      {/* Footer - positioned outside main content flow */}
      <div className="w-full">
        <footer className="container mx-auto px-6 py-6 md:py-8 border-t border-document-border mt-8 md:mt-16" role="contentinfo">
          <div className="text-center text-xs text-typewriter-medium typewriter-text">
            <div className="mb-2">
              CONFIDENTIAL PERSONNEL FILE • AUTHORIZED ACCESS ONLY
            </div>
            <div>
              DOCUMENT ID: IT-001 • LAST MODIFIED: 2025
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

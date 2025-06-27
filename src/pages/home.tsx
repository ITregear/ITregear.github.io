import { SiLinkedin, SiGithub, SiX } from "react-icons/si";
import Header from "@/components/header";
import DocumentSection from "@/components/document-section";
import RedactedText from "@/components/ui/redacted-text";
import TabsNav from "@/components/ui/tabs";
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
      <Header />
      <TabsNav />
      {/* Main Content */}
      <main className="container mx-auto px-6 pt-[24px] pb-[24px]">
        {/* Bento Box 2x2 Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[600px]">
            
            {/* Left Column: Personnel File + Reference Materials */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Top Left: Personnel File */}
              <DocumentSection 
                title="PERSONNEL FILE" 
                className="flex-1"
                footer="UPDATED: JUN 2025"
              >
                <div className="space-y-2 text-sm typewriter-text">
                  <div className="bullet-point">Mechanical Engineering MEng</div>
                  <div className="bullet-point">Imperial College London</div>
                  <div className="bullet-point">Co-Founder and CTO at KAIKAKU</div>
                  <div className="bullet-point">Co-Founder of Apollo Tech</div>
                  <div className="bullet-point">Forbes 30 Under 30</div>
                  <div className="bullet-point">Professional Voice Over Artist</div>
                </div>
              </DocumentSection>

              {/* Bottom Left: Reference Materials */}
              <DocumentSection 
                title="REFERENCE MATERIALS" 
                className="flex-1"
                footer="ACCESS LEVEL: PUBLIC"
              >
                <div className="space-y-2 text-sm typewriter-text">
                  <div className="bullet-point">
                    <a
                      href="https://www.kaikaku.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://www.kaikaku.ai/")}
                    >
                      KAIKAKU
                    </a>
                  </div>
                  <div className="bullet-point">
                    <a
                      href="https://saysovoices.com/talent/ivan-tregear/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://saysovoices.com/talent/ivan-tregear/")}
                    >
                      VOICE OVER (NICKELODEON, CARTOON NETWORK)
                    </a>
                  </div>
                  <div className="bullet-point">
                    <a
                      href="https://www.forbes.com/profile/kaikaku/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://www.forbes.com/profile/kaikaku/")}
                    >
                      FORBES 30U30 LIST
                    </a>
                  </div>
                  <div className="bullet-point">
                    <a
                      href="https://www.telegraph.co.uk/business/2024/08/25/would-you-eat-meal-cooked-robot-meet-machines-taking-over/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://www.telegraph.co.uk/business/2024/08/25/would-you-eat-meal-cooked-robot-meet-machines-taking-over/")}
                    >
                      KAIKAKU IN THE NEWS
                    </a>
                  </div>
                  <div className="bullet-point">
                    <a
                      href="https://powerboat.world/news/255273/Reading-Rumble-2022-at-Burghfield"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bullet-link w-full text-left transition-all duration-200"
                      onClick={() => trackExternalLinkClick("https://powerboat.world/news/255273/Reading-Rumble-2022-at-Burghfield")}
                    >
                      READING RUMBLE 2022 VICTORS
                    </a>
                  </div>
                </div>
              </DocumentSection>
            </div>

            {/* Right Column: Operational Summary + Comms */}
            <div className="md:col-span-3 flex flex-col gap-6">
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
                <div className="flex justify-center space-x-6">
                  <a
                    href="https://www.linkedin.com/in/ivantregear"
                    className="social-icon text-2xl text-typewriter-dark"
                    aria-label="LinkedIn Profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackExternalLinkClick("https://www.linkedin.com/in/ivantregear")}
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
        <footer className="container mx-auto px-6 py-8 border-t border-document-border mt-16">
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

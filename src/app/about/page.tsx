import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("en");

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gls-secondary mb-6">
            About EcoNexo
          </h1>
          <p className="text-xl md:text-2xl text-gls-secondary opacity-90 max-w-3xl mx-auto">
            Connecting Europe's environmental community for a sustainable future
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gls-secondary mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              EcoNexo is dedicated to connecting environmental activists, volunteers, and organizations 
              across Europe to create a more sustainable future. We believe that collaboration and 
              community are key to addressing the environmental challenges of our time.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our platform enables users to discover environmental projects, join events, find 
              green jobs, and connect with like-minded individuals who share their passion for 
              environmental protection.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gls-secondary text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gls-secondary mb-3">Interactive Map</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Discover environmental projects and events near you with our interactive map interface.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gls-secondary mb-3">Events & Activities</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Join environmental events, workshops, and community activities happening across Europe.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gls-secondary mb-3">Green Jobs</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Find meaningful employment opportunities in the environmental and sustainability sector.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gls-secondary mb-3">Community Chat</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Connect with fellow environmentalists through our community discussion forums.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-gls-secondary mb-3">Personal Profiles</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Create detailed profiles to showcase your environmental interests and expertise.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gls-secondary mb-3">Multilingual</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Available in English, Spanish, and German to serve diverse European communities.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gls-secondary mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gls-secondary mb-3">🌱 Sustainability</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We are committed to promoting sustainable practices and environmental protection 
                  across all our activities and partnerships.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gls-secondary mb-3">🤝 Community</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We believe in the power of community and collaboration to create meaningful 
                  environmental change.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gls-secondary mb-3">🌍 Inclusivity</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We welcome people from all backgrounds and skill levels to join our 
                  environmental community.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gls-secondary mb-3">📈 Impact</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We focus on creating measurable positive impact for the environment and 
                  our communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-green-100">Active Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2,500+</div>
                <div className="text-green-100">Community Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-green-100">European Cities</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gls-secondary mb-6">Get Involved</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Ready to make a difference? Join our community and start contributing to 
              environmental change today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/eventos" 
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Explore Events
              </a>
              <a 
                href="/chat" 
                className="bg-transparent border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
              >
                Join Community
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

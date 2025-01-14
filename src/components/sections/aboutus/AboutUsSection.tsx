import {
    Flower2,
    Globe,
    Leaf
} from 'lucide-react';
import React from 'react';

// Types
interface ValueCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

interface TeamMember {
    name: string;
    role: string;
    image: string;
    quote: string;
}

// Value Card Component
const ValueCard: React.FC<ValueCardProps> = ({ icon: Icon, title, description }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm 
    hover:shadow-md transition-all duration-300 transform hover:-translate-y-2">
        <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

// Main About Us Page Component
const AboutUsSection: React.FC = () => {
    const teamMembers: TeamMember[] = [
        {
            name: "Krishna Yadav",
            role: "Founder & Chief Perfumer",
            image: "/team/ananya.jpg",
            quote: "Every fragrance tells a story, and we're here to help you write yours."
        },
        {
            name: "Shankar Kumar Yadav",
            role: "Creative Director",
            image: "/team/rohan.jpg",
            quote: "Design is not just what it looks like, but how it makes you feel."
        },
        {
            name: "Kryss Na",
            role: "Head of Fragrance Development",
            image: "/team/priya.jpg",
            quote: "Crafting emotions through scent is an art we've perfected."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-orange-50 to-white py-24 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6 
            animate-fade-in-up animation-delay-200">
                        Crafting Memories, One Fragrance at a Time
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 
            animate-fade-in-up animation-delay-400">
                        Sugandha is more than a perfume brand. We're storytellers, emotion weavers,
                        and passionate creators of olfactory experiences that transcend the ordinary.
                    </p>
                </div>
            </div>

            {/* Our Values Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We believe in authenticity, craftsmanship, and the power of scent to
                        evoke the deepest human emotions.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <ValueCard
                        icon={Flower2}
                        title="Artisan Craftsmanship"
                        description="Each fragrance is meticulously crafted, blending traditional techniques with modern innovation."
                    />
                    <ValueCard
                        icon={Globe}
                        title="Global Inspiration"
                        description="We source the finest ingredients from around the world, celebrating global diversity."
                    />
                    <ValueCard
                        icon={Leaf}
                        title="Sustainable Luxury"
                        description="Committed to ethical sourcing and environmentally conscious production."
                    />
                </div>
            </div>

            {/* Our Story Section */}
            <div className="bg-white py-16 px-6">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
                        <p className="text-gray-600 mb-4">
                            Founded in 2024, Sugandha emerged from a passion to redefine fragrance
                            as an art form. What began in a small workshop has now become a
                            testament to Nepalese creativity and global appeal.
                        </p>
                        <p className="text-gray-600">
                            Our mission is simple: to create fragrances that are not just scents,
                            but memories bottled, emotions captured, and stories waiting to be told.
                        </p>
                    </div>
                    <img
                        src="/about/workshop.jpg"
                        alt="Sugandha Workshop"
                        className="rounded-xl shadow-lg object-cover h-96 w-full 
              transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>

            {/* Team Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Visionaries</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        The passionate individuals who breathe life into every Sugandha creation.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={member.name}
                            className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm 
                transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-100"
                            />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                            <p className="text-gray-600 mb-4">{member.role}</p>
                            <p className="italic text-gray-500">"{member.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-orange-50 py-16 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Discover Your Signature Scent
                    </h2>
                    <p className="text-gray-600 mb-8 text-xl">
                        Every fragrance is a personal journey. Let us help you find yours.
                    </p>
                    <button className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg 
            hover:bg-orange-600 transition-colors shadow-lg 
            transform hover:scale-105 active:scale-95 duration-300">
                        Explore Our Collection
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AboutUsSection;
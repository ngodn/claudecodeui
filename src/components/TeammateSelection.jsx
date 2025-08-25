import React, { useState } from 'react';
import CometCard from './ui/CometCard';

const TeammateSelection = ({ onSelectTeammate }) => {
  const [selectedTeammate, setSelectedTeammate] = useState(null);

  const teammates = [
    {
      id: 'verso',
      name: 'Verso',
      specialty: 'Daily Tasks & General Support',
      description: 'Great for regular daily tasks and general assistance. Reliable and versatile for everyday productivity.',
      color: 'from-blue-500 to-cyan-500',
      avatar: '🤖',
      expertise: ['Task Management', 'General Support', 'Productivity']
    },
    {
      id: 'renoir',
      name: 'Renoir',
      specialty: 'Senior Programming Expert',
      description: 'Experienced senior programmer with deep technical knowledge. Perfect for complex coding challenges and architecture decisions.',
      color: 'from-purple-500 to-indigo-500',
      avatar: '👨‍💻',
      expertise: ['Software Architecture', 'Code Review', 'Technical Leadership']
    },
    {
      id: 'aline',
      name: 'Aline',
      specialty: 'UI/UX Design Specialist',
      description: 'Creative designer focused on user experience and interface design. Brings aesthetic vision to life.',
      color: 'from-pink-500 to-rose-500',
      avatar: '🎨',
      expertise: ['User Interface', 'User Experience', 'Visual Design']
    },
    {
      id: 'alicia',
      name: 'Alicia',
      specialty: 'Data Analysis & Research',
      description: 'Analytical mind specialized in data processing and research methodologies. Turns information into insights.',
      color: 'from-green-500 to-emerald-500',
      avatar: '📊',
      expertise: ['Data Analytics', 'Research', 'Statistical Analysis']
    },
    {
      id: 'maelle',
      name: 'Maelle',
      specialty: 'Combat & Problem Solving',
      description: 'Fierce problem solver who tackles challenges head-on. Specializes in debugging and troubleshooting.',
      color: 'from-red-500 to-orange-500',
      avatar: '⚔️',
      expertise: ['Debugging', 'Troubleshooting', 'Problem Solving']
    },
    {
      id: 'simon',
      name: 'Simon',
      specialty: 'Security Expert',
      description: 'Cybersecurity specialist focused on protecting systems and data. Your guardian against digital threats.',
      color: 'from-gray-600 to-gray-800',
      avatar: '🛡️',
      expertise: ['Cybersecurity', 'Penetration Testing', 'Security Auditing']
    },
    {
      id: 'gustave',
      name: 'Gustave',
      specialty: 'Engineering & Leadership',
      description: 'Technical leader with strong engineering background. Guides projects from conception to deployment.',
      color: 'from-yellow-500 to-amber-500',
      avatar: '⚙️',
      expertise: ['System Engineering', 'Project Leadership', 'Technical Strategy']
    },
    {
      id: 'sciel',
      name: 'Sciel',
      specialty: 'Performance & Optimization',
      description: 'Tempo-driven specialist in system performance and optimization. Makes everything run faster and smoother.',
      color: 'from-teal-500 to-cyan-600',
      avatar: '⚡',
      expertise: ['Performance Tuning', 'System Optimization', 'Resource Management']
    },
    {
      id: 'lune',
      name: 'Lune',
      specialty: 'Research & Knowledge',
      description: 'Deep researcher with thirst for knowledge. Specializes in discovery and understanding complex systems.',
      color: 'from-indigo-500 to-purple-600',
      avatar: '🔬',
      expertise: ['Research & Development', 'Knowledge Management', 'System Analysis']
    },
    {
      id: 'monoco',
      name: 'Monoco',
      specialty: 'Versatile Warrior',
      description: 'Adaptable fighter with diverse skills. Can transform and adapt to any challenge or requirement.',
      color: 'from-orange-500 to-red-600',
      avatar: '🎭',
      expertise: ['Versatility', 'Adaptation', 'Multi-domain Expertise']
    },
    {
      id: 'esquie',
      name: 'Esquie',
      specialty: 'Legendary Support & Exploration',
      description: 'Mythical helper with extraordinary abilities. Perfect for exploring new territories and innovative solutions.',
      color: 'from-violet-500 to-purple-700',
      avatar: '🌟',
      expertise: ['Innovation', 'Exploration', 'Creative Solutions']
    },
    {
      id: 'sophie',
      name: 'Sophie',
      specialty: 'Documentation & Communication',
      description: 'Expert communicator and documentarian. Transforms complex ideas into clear, understandable content.',
      color: 'from-blue-400 to-teal-500',
      avatar: '📝',
      expertise: ['Technical Writing', 'Documentation', 'Communication']
    }
  ];

  const handleTeammateClick = (teammate) => {
    setSelectedTeammate(teammate);
  };

  const handleProceed = () => {
    if (selectedTeammate && onSelectTeammate) {
      onSelectTeammate(selectedTeammate);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background stars effect */}
      <div className="absolute inset-0">
        <div className="stars"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Choose Your Teammate
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Select an AI assistant specialized in your specific needs. Each teammate brings unique expertise to help you accomplish your goals.
          </p>
        </div>

        {/* Teammates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {teammates.map((teammate) => (
            <CometCard 
              key={teammate.id}
              className="cursor-pointer"
              rotateDepth={15}
            >
              <div 
                className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                  selectedTeammate?.id === teammate.id 
                    ? 'border-blue-400 shadow-2xl shadow-blue-500/25' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => handleTeammateClick(teammate)}
              >
                {/* Card background with gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${teammate.color} opacity-10`} />
                
                {/* Content */}
                <div className="relative p-6 bg-gray-800/90 backdrop-blur-sm">
                  {/* Avatar and name */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{teammate.avatar}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{teammate.name}</h3>
                    <p className={`text-sm font-medium bg-gradient-to-r ${teammate.color} bg-clip-text text-transparent`}>
                      {teammate.specialty}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {teammate.description}
                  </p>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-1">
                    {teammate.expertise.slice(0, 3).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Selection indicator */}
                  {selectedTeammate?.id === teammate.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CometCard>
          ))}
        </div>

        {/* Selected teammate details and proceed button */}
        {selectedTeammate && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">{selectedTeammate.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedTeammate.name}</h3>
                  <p className={`text-sm bg-gradient-to-r ${selectedTeammate.color} bg-clip-text text-transparent font-medium`}>
                    {selectedTeammate.specialty}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{selectedTeammate.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTeammate.expertise.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-200 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleProceed}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Working with {selectedTeammate.name}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS for stars animation */}
      <style jsx>{`
        .stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .stars::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: zoom 10s infinite;
          opacity: 0.3;
        }

        @keyframes zoom {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TeammateSelection;
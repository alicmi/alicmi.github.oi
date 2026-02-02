import React from 'react';
import { Project } from '../types';
import { PROJECTS, CONNECTIONS } from '../constants';

interface ContentPanelProps {
  activeProject: Project | null;
  activeTopic: string | null;
  onProjectClick: (id: string) => void;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ activeProject, activeTopic, onProjectClick }) => {
  
  // Find projects for the active topic
  const topicProjects = activeTopic 
    ? PROJECTS.filter(p => CONNECTIONS[p.id]?.includes(activeTopic))
    : [];

  return (
    <div className="h-full flex flex-col p-12 lg:p-16 overflow-y-auto backdrop-blur-md bg-gradient-to-r from-[#004d4d]/0 via-[#005a5a]/70 to-[#005a5a]/90 text-white z-10 transition-colors duration-500 custom-scrollbar">
      
      {activeProject ? (
        <div className="animate-fade-in-up flex flex-col pb-10">
           {/* Image scrolls with the content naturally */}
           <div className="w-full h-48 lg:h-56 mb-8 rounded-sm overflow-hidden bg-black/20 shrink-0">
              <img 
                src={activeProject.img} 
                alt={activeProject.label} 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
           </div>
           
           {/* Sticky Header */}
           {/* -mx-4 px-4 and negative margins expand background to look like a bar, but respect parent padding */}
           <div className="sticky top-[-3rem] lg:top-[-4rem] pt-4 pb-4 z-20 backdrop-blur-xl bg-[#005a5a]/80 mb-6 border-b border-[#FFD700]/20 -mx-4 px-4 shadow-sm">
             <h1 className="text-xl lg:text-2xl font-light text-[#FFD700] tracking-widest uppercase m-0">
               {activeProject.label}
             </h1>
           </div>
           
           {/* Text Content */}
           <div className="font-mono text-xs lg:text-sm leading-relaxed opacity-90 space-y-3 text-justify">
             {activeProject.text.split('\n').filter(t => t.trim() !== '').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
             ))}
             <p className="opacity-70 mt-3 italic border-l-2 border-[#FFD700] pl-4">
               “Design is not just what it looks like and feels like. Design is how it works... and who it works for.”
             </p>
           </div>

           {/* Secondary Image - displayed below text */}
           {activeProject.secondaryImg && (
             <div className="w-full h-48 lg:h-56 mt-8 rounded-sm overflow-hidden bg-black/20 shrink-0">
                <img 
                  src={activeProject.secondaryImg} 
                  alt={`${activeProject.label} detail`} 
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
             </div>
           )}
        </div>
      ) : activeTopic ? (
        <div className="animate-fade-in-up h-full flex flex-col justify-center">
            <h1 className="text-xl lg:text-2xl font-light mb-2 text-[#FFD700] tracking-widest uppercase shrink-0">
              {activeTopic}
            </h1>
            <p className="font-mono text-[10px] mb-6 opacity-70 shrink-0 tracking-wider">RELATED PROJECTS</p>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {topicProjects.length > 0 ? (
                    topicProjects.map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => onProjectClick(p.id)}
                            className="group cursor-pointer bg-black/10 hover:bg-[#FFD700]/10 p-4 rounded-sm border-l-2 border-transparent hover:border-[#FFD700] transition-all duration-300"
                        >
                            <h3 className="text-base font-light group-hover:text-[#FFD700] transition-colors">{p.label}</h3>
                            <p className="text-xs font-mono opacity-60 mt-1 line-clamp-2">{p.text}</p>
                        </div>
                    ))
                ) : (
                    <p className="font-mono text-xs opacity-50">No specific projects linked directly, but this concept permeates my work.</p>
                )}
            </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center h-full animate-fade-in">
           <div className="font-mono text-xs lg:text-sm leading-relaxed opacity-90 space-y-4 lg:space-y-6">
             <p>
               In my head, my work, and my life, nothing exists in isolation. I believe that we are all part of a living system — an interconnected web.
             </p>
             <p>
               I am an Integrated Designer, which means I see design in relationships. I lean torwards a 'sweet spot' where social justice, environmental stewardship, and creative expression meet.
             </p>
             <p>
               Design is often used to fuel consumption and exploitation. I choose a different path and design to improve. While aligning one’s work with one's deepest values can feel like a radical act in today's world, it is a Utopia I refuse to give up on.
             </p>
             <p>
             This portfolio is a living map of that journey.
             </p>
             <div className="mt-8 pt-6 border-t border-[#FFD700]/30 text-[10px] text-[#FFD700]/70">
                <p>Click a project or topic to see connections and details.</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContentPanel;
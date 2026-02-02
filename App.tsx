import React, { useState, useCallback } from 'react';
import NetworkGraph from './components/NetworkGraph';
import ContentPanel from './components/ContentPanel';
import { PROJECTS } from './constants';

const App: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const activeProject = activeProjectId 
    ? PROJECTS.find(p => p.id === activeProjectId) || null 
    : null;

  // activeId passed to graph is either project ID or topic string
  const graphActiveId = activeProjectId || activeTopic;

  const handleNodeClick = useCallback((id: string | null) => {
    if (!id) {
        setActiveProjectId(null);
        setActiveTopic(null);
        return;
    }

    // Check if ID is a project
    const isProject = PROJECTS.some(p => p.id === id);
    if (isProject) {
        setActiveProjectId(id);
        setActiveTopic(null);
    } else {
        // Must be a topic
        setActiveProjectId(null);
        setActiveTopic(id);
    }
  }, []);

  const handleProjectSelectFromPanel = useCallback((id: string) => {
      setActiveProjectId(id);
      setActiveTopic(null);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#004d4d] relative">
      {/* 
        Network Visualization 
        On mobile, it takes top 40%.
        On desktop: 
          - Default: w-2/3 (66%)
          - Active Project: w-1/2 (50%)
      */}
      <div className={`h-[40vh] md:h-full relative order-1 md:order-1 z-0 transition-all duration-700 ease-in-out md:shrink-0 ${activeProjectId ? 'md:w-1/2' : 'md:w-2/3'}`}>
        <NetworkGraph onNodeClick={handleNodeClick} activeId={graphActiveId} />
      </div>

      {/* 
        Content Panel
        On mobile, it takes bottom 60%.
        On desktop: 
          - Default: w-1/3 (33%)
          - Active Project: w-1/2 (50%)
      */}
      <div className={`h-[60vh] md:h-full relative order-2 md:order-2 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.2)] md:shrink-0 transition-all duration-700 ease-in-out ${activeProjectId ? 'md:w-1/2' : 'md:w-1/3'}`}>
        <ContentPanel 
            activeProject={activeProject} 
            activeTopic={activeTopic}
            onProjectClick={handleProjectSelectFromPanel}
        />
      </div>
    </div>
  );
};

export default App;
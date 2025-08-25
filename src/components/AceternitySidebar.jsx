import React, { useState, useEffect } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from './ui/sidebar';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

import { 
  FolderOpen, 
  Folder, 
  Plus, 
  MessageSquare, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  Check, 
  X, 
  Trash2, 
  Settings, 
  FolderPlus, 
  RefreshCw, 
  Edit2, 
  Star, 
  Search 
} from 'lucide-react';

import ClaudeLogo from './ClaudeLogo';
import CursorLogo from './CursorLogo.jsx';
import { api } from '../utils/api';

// Move formatTimeAgo outside component to avoid recreation on every render
const formatTimeAgo = (dateString, currentTime) => {
  const date = new Date(dateString);
  const now = currentTime;
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Unknown';
  }
  
  const diffInMs = now - date;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInMinutes === 1) return '1 min ago';
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};

// Header Component - shows only when sidebar is expanded
const SidebarHeader = () => {
  const { open } = useSidebar();

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
        <MessageSquare className="w-4 h-4 text-primary-foreground" />
      </div>
      <motion.div
        animate={{
          opacity: open ? 1 : 0,
          width: open ? "auto" : 0,
        }}
        className="overflow-hidden"
      >
        <h1 className="text-lg font-bold text-foreground whitespace-nowrap">The Canvas of Clea</h1>
      </motion.div>
    </div>
  );
};

// Action Buttons Component
const SidebarActions = ({ onRefresh, onNewProject, isRefreshing }) => {
  const { open } = useSidebar();

  return (
    <motion.div
      animate={{
        opacity: open ? 1 : 0,
        height: open ? "auto" : 0,
        marginBottom: open ? "16px" : 0,
      }}
      className="flex gap-2 overflow-hidden"
    >
      {open && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 px-0 hover:bg-accent transition-colors duration-200 group flex-shrink-0"
            onClick={async () => {
              try {
                await onRefresh();
              } catch (error) {
                console.error('Refresh failed:', error);
              }
            }}
            disabled={isRefreshing}
            title="Refresh projects and canvases"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-300`} />
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="h-9 w-9 px-0 bg-primary hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
            onClick={onNewProject}
            title="Create new project"
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        </>
      )}
    </motion.div>
  );
};

// Search Component
const SidebarSearch = ({ searchFilter, setSearchFilter, projectCount }) => {
  const { open } = useSidebar();

  if (projectCount === 0) return null;

  return (
    <motion.div
      animate={{
        opacity: open ? 1 : 0,
        height: open ? "auto" : 0,
        marginBottom: open ? "16px" : 0,
      }}
      className="overflow-hidden"
    >
      {open && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-9 h-9 text-sm bg-muted/50 border-0 focus:bg-background focus:ring-1 focus:ring-primary/20"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Project Item Component
const ProjectItem = ({ 
  project, 
  isSelected, 
  isExpanded, 
  isStarred,
  editingProject,
  editingName,
  setEditingName,
  onToggle,
  onSelect,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleStar,
  getAllSessions
}) => {
  const { open } = useSidebar();

  const links = [
    {
      label: project.displayName,
      href: "#",
      icon: isExpanded ? (
        <FolderOpen className="w-4 h-4 text-primary flex-shrink-0" />
      ) : (
        <Folder className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="group">
      <div
        className={cn(
          "flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer",
          isSelected && "bg-accent text-accent-foreground",
          isStarred && !isSelected && "bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20"
        )}
        onClick={() => {
          onSelect(project);
          onToggle(project.name);
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-primary flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
          
          <motion.span
            animate={{
              opacity: open ? 1 : 0,
              width: open ? "auto" : 0,
            }}
            className="text-sm font-medium text-foreground truncate overflow-hidden whitespace-nowrap"
          >
            {open && project.displayName}
          </motion.span>
        </div>
        
        {/* Action buttons - only show when expanded */}
        <motion.div
          animate={{
            opacity: open ? 1 : 0,
            width: open ? "auto" : 0,
          }}
          className="flex items-center gap-1 overflow-hidden"
        >
          {open && !editingProject && (
            <>
              <button
                className={cn(
                  "w-6 h-6 rounded flex items-center justify-center transition-colors",
                  isStarred 
                    ? "hover:bg-yellow-50 dark:hover:bg-yellow-900/20" 
                    : "hover:bg-accent"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(project.name);
                }}
                title={isStarred ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={cn(
                  "w-3 h-3 transition-colors",
                  isStarred 
                    ? "text-yellow-600 dark:text-yellow-400 fill-current" 
                    : "text-muted-foreground"
                )} />
              </button>
              
              <button
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-accent transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
                title="Rename project"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              
              {getAllSessions(project).length === 0 && (
                <button
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.name);
                  }}
                  title="Delete empty project"
                >
                  <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                </button>
              )}
              
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </>
          )}
          
          {open && editingProject === project.name && (
            <>
              <button
                className="w-6 h-6 rounded flex items-center justify-center bg-green-50 hover:bg-green-100 dark:bg-green-900/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(project.name);
                }}
              >
                <Check className="w-3 h-3 text-green-600" />
              </button>
              <button
                className="w-6 h-6 rounded flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </>
          )}
        </motion.div>
      </div>
      
      {/* Edit input */}
      {editingProject === project.name && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 px-2"
        >
          <Input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full text-sm"
            placeholder="Project name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave(project.name);
              if (e.key === 'Escape') onCancel();
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

// Canvases List Component (Note: internally still called "sessions" for API compatibility)
const SessionsList = ({ 
  project, 
  isExpanded, 
  getAllSessions, 
  selectedSession, 
  onSessionSelect, 
  onSessionDelete, 
  onNewSession,
  currentTime,
  formatTimeAgo 
}) => {
  const { open } = useSidebar();

  if (!isExpanded) return null;

  const sessions = getAllSessions(project);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="ml-4 mt-2 space-y-1 border-l border-border pl-4"
    >
      {sessions.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">No canvases yet</p>
      ) : (
        sessions.map((session) => {
          const isCursorSession = session.__provider === 'cursor';
          const sessionDate = new Date(isCursorSession ? session.createdAt : session.lastActivity);
          const diffInMinutes = Math.floor((currentTime - sessionDate) / (1000 * 60));
          const isActive = diffInMinutes < 10;
          const sessionName = isCursorSession ? (session.name || 'Untitled Canvas') : (session.summary || 'New Canvas');
          const sessionTime = isCursorSession ? session.createdAt : session.lastActivity;
          const messageCount = session.messageCount || 0;

          return (
            <div
              key={session.id}
              className={cn(
                "group flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer relative",
                selectedSession?.id === session.id && "bg-accent text-accent-foreground"
              )}
              onClick={() => onSessionSelect(session)}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
              
              <div className="flex-shrink-0">
                {isCursorSession ? (
                  <CursorLogo className="w-3 h-3" />
                ) : (
                  <ClaudeLogo className="w-3 h-3" />
                )}
              </div>
              
              <motion.div
                animate={{
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : 0,
                }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                {open && (
                  <>
                    <div className="text-xs font-medium truncate text-foreground whitespace-nowrap">
                      {sessionName}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(sessionTime, currentTime)}
                      </span>
                      {messageCount > 0 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0 ml-auto">
                          {messageCount}
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
              
              {/* Delete button for Claude canvases */}
              {!isCursorSession && open && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-5 h-5 rounded flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSessionDelete(project.name, session.id);
                  }}
                >
                  <Trash2 className="w-2.5 h-2.5 text-red-600 dark:text-red-400" />
                </motion.button>
              )}
            </div>
          );
        })
      )}
      
      {/* New Canvas Button */}
      <motion.div
        animate={{
          opacity: open ? 1 : 0,
          height: open ? "auto" : 0,
        }}
        className="pt-2 overflow-hidden"
      >
        {open && (
          <Button
            variant="default"
            size="sm"
            className="w-full justify-start gap-2 h-8 text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onNewSession(project)}
          >
            <Plus className="w-3 h-3" />
            New Canvas
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

// Version Update Notification Component
const VersionUpdateNotification = ({ onShowVersionModal, latestVersion }) => {
  const { open } = useSidebar();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-border pt-4"
    >
      <div
        className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        onClick={onShowVersionModal}
      >
        <div className="relative">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </div>
        <motion.div
          animate={{
            opacity: open ? 1 : 0,
          }}
          className="min-w-0 flex-1"
        >
          {open && (
            <>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Update Available</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Version {latestVersion} is ready</div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Settings Component
const SidebarSettings = ({ onShowSettings }) => {
  const links = [
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div 
      className="mt-auto pt-4 border-t border-border cursor-pointer"
      onClick={onShowSettings}
    >
      <SidebarLink link={links[0]} />
    </div>
  );
};

// Main Sidebar Component
function AceternitySidebar(props) {
  const {
    projects,
    selectedProject,
    selectedSession,
    onProjectSelect,
    onSessionSelect,
    onNewSession,
    onSessionDelete,
    onProjectDelete,
    isLoading,
    onRefresh,
    onShowSettings,
    updateAvailable,
    latestVersion,
    currentVersion,
    onShowVersionModal
  } = props;

  // All your existing state
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [editingProject, setEditingProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [newProjectPath, setNewProjectPath] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);
  // State management (Note: "sessions" terminology kept for API compatibility - these represent "canvases")
  const [loadingSessions, setLoadingSessions] = useState({});
  const [additionalSessions, setAdditionalSessions] = useState({});
  const [initialSessionsLoaded, setInitialSessionsLoaded] = useState(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [projectSortOrder, setProjectSortOrder] = useState('name');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editingSessionName, setEditingSessionName] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState({});
  const [searchFilter, setSearchFilter] = useState('');

  // Starred projects state
  const [starredProjects, setStarredProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('starredProjects');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error('Error loading starred projects:', error);
      return new Set();
    }
  });

  // All your existing useEffect hooks and functions remain the same
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setAdditionalSessions({});
    setInitialSessionsLoaded(new Set());
  }, [projects]);

  useEffect(() => {
    if (selectedSession && selectedProject) {
      setExpandedProjects(prev => new Set([...prev, selectedProject.name]));
    }
  }, [selectedSession, selectedProject]);

  useEffect(() => {
    if (projects.length > 0 && !isLoading) {
      const newLoaded = new Set();
      projects.forEach(project => {
        if (project.sessions && project.sessions.length >= 0) {
          newLoaded.add(project.name);
        }
      });
      setInitialSessionsLoaded(newLoaded);
    }
  }, [projects, isLoading]);

  useEffect(() => {
    const loadSortOrder = () => {
      try {
        const savedSettings = localStorage.getItem('claude-tools-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setProjectSortOrder(settings.projectSortOrder || 'name');
        }
      } catch (error) {
        console.error('Error loading sort order:', error);
      }
    };

    loadSortOrder();
    const handleStorageChange = (e) => {
      if (e.key === 'claude-tools-settings') {
        loadSortOrder();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const checkInterval = setInterval(() => {
      if (document.hasFocus()) {
        loadSortOrder();
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkInterval);
    };
  }, []);

  // All your existing functions
  const toggleProject = (projectName) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectName)) {
      newExpanded.delete(projectName);
    } else {
      newExpanded.add(projectName);
    }
    setExpandedProjects(newExpanded);
  };

  const toggleStarProject = (projectName) => {
    const newStarred = new Set(starredProjects);
    if (newStarred.has(projectName)) {
      newStarred.delete(projectName);
    } else {
      newStarred.add(projectName);
    }
    setStarredProjects(newStarred);
    
    try {
      localStorage.setItem('starredProjects', JSON.stringify([...newStarred]));
    } catch (error) {
      console.error('Error saving starred projects:', error);
    }
  };

  const isProjectStarred = (projectName) => {
    return starredProjects.has(projectName);
  };

  // Function to get all canvases (Note: called "sessions" for API compatibility)
  const getAllSessions = (project) => {
    const claudeSessions = [...(project.sessions || []), ...(additionalSessions[project.name] || [])].map(s => ({ ...s, __provider: 'claude' }));
    const cursorSessions = (project.cursorSessions || []).map(s => ({ ...s, __provider: 'cursor' }));
    const normalizeDate = (s) => new Date(s.__provider === 'cursor' ? s.createdAt : s.lastActivity);
    return [...claudeSessions, ...cursorSessions].sort((a, b) => normalizeDate(b) - normalizeDate(a));
  };

  const getProjectLastActivity = (project) => {
    const allSessions = getAllSessions(project);
    if (allSessions.length === 0) {
      return new Date(0);
    }
    
    const mostRecentDate = allSessions.reduce((latest, session) => {
      const sessionDate = new Date(session.lastActivity);
      return sessionDate > latest ? sessionDate : latest;
    }, new Date(0));
    
    return mostRecentDate;
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const aStarred = isProjectStarred(a.name);
    const bStarred = isProjectStarred(b.name);
    
    if (aStarred && !bStarred) return -1;
    if (!aStarred && bStarred) return 1;
    
    if (projectSortOrder === 'date') {
      return getProjectLastActivity(b) - getProjectLastActivity(a);
    } else {
      const nameA = a.displayName || a.name;
      const nameB = b.displayName || b.name;
      return nameA.localeCompare(nameB);
    }
  });

  const startEditing = (project) => {
    setEditingProject(project.name);
    setEditingName(project.displayName);
  };

  const cancelEditing = () => {
    setEditingProject(null);
    setEditingName('');
  };

  const saveProjectName = async (projectName) => {
    try {
      const response = await api.renameProject(projectName, editingName);
      if (response.ok) {
        if (window.refreshProjects) {
          window.refreshProjects();
        } else {
          window.location.reload();
        }
      } else {
        console.error('Failed to rename project');
      }
    } catch (error) {
      console.error('Error renaming project:', error);
    }
    
    setEditingProject(null);
    setEditingName('');
  };

  // Delete canvas function (Note: API still uses "session" terminology)
  const deleteSession = async (projectName, sessionId) => {
    if (!confirm('Are you sure you want to delete this canvas? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.deleteSession(projectName, sessionId);
      if (response.ok) {
        if (onSessionDelete) {
          onSessionDelete(sessionId);
        }
      } else {
        console.error('Failed to delete canvas');
        alert('Failed to delete canvas. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting canvas:', error);
      alert('Error deleting canvas. Please try again.');
    }
  };

  const deleteProject = async (projectName) => {
    if (!confirm('Are you sure you want to delete this empty project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.deleteProject(projectName);
      if (response.ok) {
        if (onProjectDelete) {
          onProjectDelete(projectName);
        }
      } else {
        const error = await response.json();
        console.error('Failed to delete project');
        alert(error.error || 'Failed to delete project. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    }
  };

  const createNewProject = async () => {
    if (!newProjectPath.trim()) {
      alert('Please enter a project path');
      return;
    }

    setCreatingProject(true);
    
    try {
      const response = await api.createProject(newProjectPath.trim());
      if (response.ok) {
        const result = await response.json();
        setShowNewProject(false);
        setNewProjectPath('');
        
        if (window.refreshProjects) {
          window.refreshProjects();
        } else {
          window.location.reload();
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create project. Please try again.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    } finally {
      setCreatingProject(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredProjects = sortedProjects.filter(project => {
    if (!searchFilter.trim()) return true;
    
    const searchLower = searchFilter.toLowerCase();
    const displayName = (project.displayName || project.name).toLowerCase();
    const projectName = project.name.toLowerCase();
    
    return displayName.includes(searchLower) || projectName.includes(searchLower);
  });

  return (
    <Sidebar animate={true}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarHeader />
          
          <SidebarActions 
            onRefresh={handleRefresh}
            onNewProject={() => setShowNewProject(true)}
            isRefreshing={isRefreshing}
          />
          
          <SidebarSearch 
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            projectCount={projects.length}
          />

          {/* New Project Form */}
          {showNewProject && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-muted/30 rounded-lg space-y-2"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FolderPlus className="w-4 h-4" />
                Create New Project
              </div>
              <Input
                value={newProjectPath}
                onChange={(e) => setNewProjectPath(e.target.value)}
                placeholder="/path/to/project or relative/path"
                className="text-sm focus:ring-2 focus:ring-primary/20"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createNewProject();
                  if (e.key === 'Escape') setShowNewProject(false);
                }}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={createNewProject}
                  disabled={!newProjectPath.trim() || creatingProject}
                  className="flex-1 h-8 text-xs hover:bg-primary/90 transition-colors"
                >
                  {creatingProject ? 'Creating...' : 'Create Project'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowNewProject(false)}
                  disabled={creatingProject}
                  className="h-8 text-xs hover:bg-accent transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Projects List */}
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="w-6 h-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-1">Loading projects...</h3>
                <p className="text-sm text-muted-foreground">
                  Fetching your Claude projects and canvases
                </p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Folder className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-1">No projects found</h3>
                <p className="text-sm text-muted-foreground">
                  Run Claude CLI in a project directory to get started
                </p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-1">No matching projects</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search term
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const isExpanded = expandedProjects.has(project.name);
                const isSelected = selectedProject?.name === project.name;
                const isStarred = isProjectStarred(project.name);
                
                return (
                  <div key={project.name}>
                    <ProjectItem
                      project={project}
                      isSelected={isSelected}
                      isExpanded={isExpanded}
                      isStarred={isStarred}
                      editingProject={editingProject}
                      editingName={editingName}
                      setEditingName={setEditingName}
                      onToggle={toggleProject}
                      onSelect={onProjectSelect}
                      onEdit={startEditing}
                      onSave={saveProjectName}
                      onCancel={cancelEditing}
                      onDelete={deleteProject}
                      onToggleStar={toggleStarProject}
                      getAllSessions={getAllSessions}
                    />
                    
                    <SessionsList
                      project={project}
                      isExpanded={isExpanded}
                      getAllSessions={getAllSessions}
                      selectedSession={selectedSession}
                      onSessionSelect={onSessionSelect}
                      onSessionDelete={deleteSession}
                      onNewSession={onNewSession}
                      currentTime={currentTime}
                      formatTimeAgo={formatTimeAgo}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Version Update Notification */}
        {/* {updateAvailable && (
          <VersionUpdateNotification 
            onShowVersionModal={onShowVersionModal}
            latestVersion={latestVersion}
          />
        )} */}

        <SidebarSettings onShowSettings={onShowSettings} />
      </SidebarBody>
    </Sidebar>
  );
}

export default AceternitySidebar;

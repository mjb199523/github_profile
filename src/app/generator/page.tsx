"use client";

import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { generateReadme } from "@/lib/readme-generator";
import { marked } from "marked";
import 'github-markdown-css/github-markdown-light.css';
import { useRouter } from "next/navigation";

const ALL_TECHNOLOGIES = [
  "html", "css", "javascript", "typescript", "react", "nextjs", "vue", "angular", "svelte", "nodejs", 
  "express", "nestjs", "django", "flask", "python", "java", "c", "cpp", "cs", "php", "ruby", "go", 
  "rust", "swift", "kotlin", "dart", "flutter", "reactnative", "mysql", "postgresql", "mongodb", 
  "redis", "firebase", "supabase", "docker", "kubernetes", "aws", "azure", "gcp", "git", "github", 
  "gitlab", "bitbucket", "linux", "ubuntu", "windows", "macos", "bash", "powershell", "vim", "vscode", 
  "figma", "tailwind", "sass", "bootstrap", "materialui", "graphql", "apollo", "prisma", "jest", "cypress"
].sort();

export default function GeneratorPage() {
  const state = useStore();
  const { currentStep, nextStep, prevStep, profile, updateProfile, techStack, updateTechStack, githubActivity, updateGithubActivity, projects, setProjects, fetchedRepos, setFetchedRepos, beyondCode, updateBeyondCode, header, updateHeader, resetStore } = state;
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "markdown">("preview");
  const [techSearch, setTechSearch] = useState("");
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (entries.length > 0 && entries[0].type === 'reload') {
        resetStore();
        router.replace('/');
      }
    }
  }, [resetStore, router]);

  const handleImportProfile = async () => {
    setLoading(true);
    try {
      // Clean up URL to just username if needed
      let username = profile.githubUsername
        .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
        .replace(/\/$/, "")
        .trim();
        
      updateProfile({ githubUsername: username });
      
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`)
      ]);
      
      if (userRes.ok) {
        const data = await userRes.json();
        updateProfile({
          githubUsername: data.login,
          name: data.name || data.login,
          bio: data.bio || "",
          portfolio: data.blog || "",
          avatarUrl: data.avatar_url || ""
        });
        
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          const parsedRepos = reposData.map((r: any, idx: number) => ({
            name: r.name,
            url: r.html_url,
            description: r.description || "",
            technologies: r.language || "",
            icon: "",
            selected: false,
            order: idx
          }));
          setFetchedRepos(parsedRepos);
          // auto-select first 4
          setProjects(parsedRepos.slice(0, 4).map((p: any) => ({...p, selected: true})));
        }
        nextStep();
      } else {
        alert("Couldn't find that GitHub profile or API rate limit reached. Check the username and try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error fetching GitHub profile.");
    } finally {
      setLoading(false);
    }
  };

  const generatedMarkdown = generateReadme(state);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Editor Panel */}
      <div className="w-full md:w-[45%] flex flex-col border-r border-border-subtle bg-background z-10 shadow-sm relative">
        <header className="h-16 flex items-center px-6 border-b border-border-subtle bg-white justify-between">
          <h1 className="font-semibold text-text-primary">README Studio</h1>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { resetStore(); router.push('/'); }} 
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Create New
            </button>
            <span className="text-sm text-text-secondary">Step {currentStep} of 7</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-md mx-auto">
            {currentStep === 1 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-text-primary">GitHub Profile</h2>
                <p className="text-text-secondary mb-8">Let's start by finding your GitHub profile.</p>
                <div className="bg-white border border-border-subtle rounded-lg p-6">
                  <label className="block text-sm font-medium text-text-primary mb-2">GitHub Username</label>
                  <input 
                    type="text" 
                    value={profile.githubUsername}
                    onChange={(e) => updateProfile({ githubUsername: e.target.value })}
                    placeholder="e.g. torvalds" 
                    className="w-full h-11 px-3 py-2 border border-border-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors text-text-primary"
                  />
                  <button 
                    onClick={handleImportProfile}
                    disabled={!profile.githubUsername || loading}
                    className="w-full h-11 mt-4 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? "Finding profile..." : "Import Profile →"}
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-text-primary">About You & Header</h2>
                <p className="text-text-secondary mb-6">Introduce yourself to the world.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      className="w-full h-11 px-3 py-2 border border-border-strong rounded-lg text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Professional Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Software Engineer · AI · Full Stack"
                      value={profile.title}
                      onChange={(e) => updateProfile({ title: e.target.value })}
                      className="w-full h-11 px-3 py-2 border border-border-strong rounded-lg text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Short Tagline</label>
                    <textarea 
                      placeholder="👋 I build products, intelligent systems & experiments."
                      value={profile.bio}
                      onChange={(e) => updateProfile({ bio: e.target.value })}
                      className="w-full h-24 px-3 py-2 border border-border-strong rounded-lg text-text-primary resize-none"
                    />
                  </div>
                  <hr className="border-border-subtle my-4"/>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Portfolio URL</label>
                    <input type="text" placeholder="https://yourportfolio.com" value={profile.portfolio} onChange={(e) => updateProfile({ portfolio: e.target.value })} className="w-full h-11 px-3 py-2 border border-border-strong rounded-lg text-text-primary"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">LinkedIn URL</label>
                    <input type="text" placeholder="https://linkedin.com/in/username" value={profile.linkedin} onChange={(e) => updateProfile({ linkedin: e.target.value })} className="w-full h-11 px-3 py-2 border border-border-strong rounded-lg text-text-primary"/>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-text-primary">Selected Work</h2>
                <p className="text-text-secondary mb-6">Showcase up to 8 of your best repositories.</p>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {fetchedRepos.length === 0 && (
                    <div className="bg-white border border-border-subtle rounded-lg p-6 text-center text-text-secondary">
                      <p>No repositories found. Import your GitHub profile in Step 1.</p>
                    </div>
                  )}
                  {fetchedRepos.map((repo, i) => {
                    const isSelected = projects.some(p => p.url === repo.url);
                    return (
                      <div key={repo.url} className={`p-4 border rounded-lg transition-colors cursor-pointer flex items-center justify-between ${isSelected ? 'border-accent bg-accent/5' : 'border-border-strong bg-white hover:border-accent/50'}`}
                        onClick={() => {
                          if (isSelected) {
                            setProjects(projects.filter(p => p.url !== repo.url));
                          } else {
                            if (projects.length >= 8) {
                              alert("You can select up to 8 projects max.");
                              return;
                            }
                            setProjects([...projects, { ...repo, selected: true }]);
                          }
                        }}
                      >
                        <div>
                          <div className="font-semibold text-text-primary">{repo.name}</div>
                          <div className="text-xs text-text-secondary line-clamp-1">{repo.description}</div>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-accent border-accent text-white' : 'border-border-strong'}`}>
                          {isSelected && "✓"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-text-primary">Tech Stack</h2>
                <p className="text-text-secondary mb-6">What tools do you use?</p>
                <div className="bg-white border border-border-subtle rounded-lg p-6 space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-text-primary mb-2">Technologies</label>
                    <div 
                      className="min-h-11 px-3 py-2 border border-border-strong rounded-lg bg-white flex flex-wrap gap-2 items-center cursor-pointer"
                      onClick={() => setIsTechDropdownOpen(true)}
                    >
                      {techStack.technologies.length === 0 && <span className="text-text-secondary">Select technologies...</span>}
                      {techStack.technologies.map(tech => (
                        <span key={tech} className="bg-panel px-2 py-1 rounded text-sm flex items-center gap-1 border border-border-subtle">
                          {tech}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTechStack({ technologies: techStack.technologies.filter(t => t !== tech) });
                            }}
                            className="text-text-secondary hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input 
                        type="text" 
                        value={techSearch}
                        onChange={(e) => {
                          setTechSearch(e.target.value);
                          setIsTechDropdownOpen(true);
                        }}
                        onFocus={() => setIsTechDropdownOpen(true)}
                        placeholder={techStack.technologies.length === 0 ? "" : "..."}
                        className="flex-1 min-w-[50px] outline-none text-text-primary bg-transparent"
                      />
                    </div>
                    
                    {isTechDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsTechDropdownOpen(false)} />
                        <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-border-strong rounded-lg shadow-lg z-20 p-2">
                          {ALL_TECHNOLOGIES
                            .filter(t => t.includes(techSearch.toLowerCase()) && !techStack.technologies.includes(t))
                            .map(tech => (
                              <button
                                key={tech}
                                onClick={() => {
                                  updateTechStack({ technologies: [...techStack.technologies, tech] });
                                  setTechSearch("");
                                  setIsTechDropdownOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-panel rounded text-sm text-text-primary capitalize transition-colors"
                              >
                                {tech}
                              </button>
                          ))}
                          {ALL_TECHNOLOGIES.filter(t => t.includes(techSearch.toLowerCase()) && !techStack.technologies.includes(t)).length === 0 && (
                            <div className="px-3 py-2 text-sm text-text-secondary">No matching technologies found.</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <hr className="border-border-subtle"/>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Highlight Category (optional)</label>
                    <select
                      value={techStack.highlightCategory}
                      onChange={(e) => updateTechStack({ highlightCategory: e.target.value })}
                      className="w-full h-11 px-3 border border-border-strong rounded-lg text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="">None</option>
                      <option value="ai">🤖 AI & LLMs</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-text-primary">GitHub Activity</h2>
                <p className="text-text-secondary mb-6">Show off your contribution stats.</p>
                <div className="bg-white border border-border-subtle rounded-lg p-6 space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={githubActivity.enabled} onChange={(e) => updateGithubActivity({ enabled: e.target.checked })} className="form-checkbox h-5 w-5 text-accent rounded focus:ring-accent" />
                    <span className="text-text-primary font-medium">Enable Activity Section</span>
                  </label>
                  
                  {githubActivity.enabled && (
                    <>
                      <label className="flex items-center space-x-3 cursor-pointer ml-6">
                        <input type="checkbox" checked={githubActivity.showStreak} onChange={(e) => updateGithubActivity({ showStreak: e.target.checked })} className="form-checkbox h-5 w-5 text-accent rounded focus:ring-accent" />
                        <span className="text-text-primary">Show Contribution Streak</span>
                      </label>
                    </>
                  )}
                </div>
              </>
            )}

            {currentStep === 6 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-text-primary">Beyond the Code</h2>
                <p className="text-text-secondary mb-6">Hobbies, interests, and fun facts.</p>
                <div className="bg-white border border-border-subtle rounded-lg p-6 space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer mb-4">
                    <input type="checkbox" checked={beyondCode.enabled} onChange={(e) => updateBeyondCode({ enabled: e.target.checked })} className="form-checkbox h-5 w-5 text-accent rounded focus:ring-accent" />
                    <span className="text-text-primary font-medium">Enable Beyond the Code Section</span>
                  </label>
                  
                  {beyondCode.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Bullet Points (one per line)</label>
                        <textarea 
                          value={beyondCode.items.join('\n')}
                          onChange={(e) => updateBeyondCode({ items: e.target.value.split('\n') })}
                          className="w-full h-32 px-3 py-2 border border-border-strong rounded-lg text-text-primary resize-none"
                          placeholder="🔭 I’m currently working on..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Favorite Quote</label>
                        <input 
                          type="text" 
                          value={beyondCode.quote}
                          onChange={(e) => updateBeyondCode({ quote: e.target.value })}
                          className="w-full h-11 px-3 py-2 border border-border-strong rounded-lg text-text-primary"
                          placeholder="Quote here..."
                        />
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {currentStep === 7 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-text-primary">Ready to Export!</h2>
                <p className="text-text-secondary mb-6">Your README is fully designed and ready.</p>
                <div className="space-y-4">
                  <button 
                    onClick={() => navigator.clipboard.writeText(generatedMarkdown)}
                    className="w-full h-11 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors"
                  >
                    Copy README Markdown
                  </button>
                  <button 
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([generatedMarkdown], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = "README.md";
                      document.body.appendChild(element);
                      element.click();
                    }}
                    className="w-full h-11 bg-white border border-border-strong text-text-primary font-medium rounded-lg transition-colors hover:bg-panel"
                  >
                    Download README.md
                  </button>
                </div>
                
                <div className="mt-8 border-t border-border-subtle pt-6">
                  <h3 className="font-semibold text-text-primary mb-4">How to add it to GitHub</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
                    <li>Create a repository exactly matching your username.</li>
                    <li>Make the repository public.</li>
                    <li>Create a `README.md` file.</li>
                    <li>Paste your copied content.</li>
                    <li>Commit and you're done!</li>
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>

        <footer className="h-16 flex items-center justify-between px-6 border-t border-border-subtle bg-white">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="text-text-secondary font-medium px-4 py-2 hover:bg-panel rounded-md transition-colors disabled:opacity-30"
          >
            ← Back
          </button>
          <button 
            onClick={nextStep}
            disabled={currentStep === 7 || (currentStep === 1 && !profile.avatarUrl)}
            className="text-text-primary font-medium px-4 py-2 hover:bg-panel rounded-md transition-colors disabled:opacity-30"
          >
            Next →
          </button>
        </footer>
      </div>

      {/* Preview Panel */}
      <div className="hidden md:flex md:w-[55%] flex-col bg-panel">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border-subtle bg-panel">
          <span className="text-sm font-medium text-text-secondary">README Preview</span>
          <div className="flex bg-white rounded-md border border-border-subtle p-1">
            <button 
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1 text-xs font-medium rounded ${viewMode === "preview" ? "bg-panel text-text-primary shadow-sm border border-border-subtle" : "text-text-secondary hover:text-text-primary transition-colors"}`}
            >
              Preview
            </button>
            <button 
              onClick={() => setViewMode("markdown")}
              className={`px-3 py-1 text-xs font-medium rounded ${viewMode === "markdown" ? "bg-panel text-text-primary shadow-sm border border-border-subtle" : "text-text-secondary hover:text-text-primary transition-colors"}`}
            >
              Markdown
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto bg-white min-h-full border border-border-subtle rounded-xl shadow-sm p-8 overflow-hidden">
            {viewMode === "preview" ? (
              <div 
                className="markdown-body"
                style={{ backgroundColor: 'transparent' }}
                dangerouslySetInnerHTML={{ __html: marked.parse(generatedMarkdown, { gfm: true, breaks: true }) as string }} 
              />
            ) : (
              <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono">
                {generatedMarkdown}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateReadme(state: any): string {
  const formatUrl = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  let md = "";

  // 1. Header (Capsule Render API & Intro)
  md += `<div align="center">\n\n`;

  if (state.header.enabled) {
    const text = encodeURIComponent((state.profile.name || state.profile.githubUsername || "Hello World").toUpperCase());
    const desc = encodeURIComponent(state.profile.title || "");
    const gStart = (state.header?.gradientStart || "f4a261").replace("#", "");
    const gEnd = (state.header?.gradientEnd || "e76f51").replace("#", "");
    const fColor = (state.header?.fontColor || "ffffff").replace("#", "");
    const animation = state.header?.animation || "waving";
    const height = state.header?.height || "180";
    const fontSize = state.header?.fontSize || "40";
    
    // Using the exact structure requested by the user
    md += `<img src="https://capsule-render.vercel.app/api?type=${animation}&color=0:${gStart},100:${gEnd}&height=${height}&section=header&text=${text}&fontSize=${fontSize}&fontColor=${fColor}&animation=fadeIn&fontAlignY=38&desc=${desc}&descAlignY=58&descSize=17" width="100%"/>\n\n`;
  }

  if (state.profile.bio) {
    md += `### ${state.profile.bio}\n\n`;
  }
  
  // Links
  const links = [];
  if (state.profile.portfolio) links.push(`<a href="${formatUrl(state.profile.portfolio)}">🌐 Portfolio</a>`);
  if (state.profile.linkedin) links.push(`<a href="${formatUrl(state.profile.linkedin)}">💼 LinkedIn</a>`);
  if (state.profile.githubUsername) links.push(`<a href="https://github.com/${state.profile.githubUsername}">🐙 GitHub</a>`);
  
  if (links.length > 0) {
    md += `${links.join(' &nbsp; &bull; &nbsp; ')}\n\n`;
  }
  
  if (state.githubActions?.enabled && state.githubActions.workflows.length > 0 && state.profile.githubUsername) {
    const badges = state.githubActions.workflows.map((wf: string) => 
      `<a href="https://github.com/${state.profile.githubUsername}/${state.profile.githubUsername}/actions/workflows/${wf}"><img src="https://github.com/${state.profile.githubUsername}/${state.profile.githubUsername}/actions/workflows/${wf}/badge.svg" alt="${wf} status"></a>`
    );
    md += `${badges.join(' &nbsp; ')}\n\n`;
  }

  md += `</div>\n\n`;
  md += `---\n\n`;

  // 2. Selected Work
  if (state.projects && state.projects.length > 0) {
    md += `## ⭐ Selected Work\n\n`;
    md += `<div align="center">\n\n`;
    md += `<table width="100%" cellpadding="8" cellspacing="0">\n<tr>\n\n`;
    
    const colWidth = 100 / Math.max(state.projects.length, 1);
    
    state.projects.forEach((p: any) => {
      // Use language as technology, or standard text
      const tech = p.technologies || "GitHub Repo";
      // Icon mapping or default
      const icon = p.icon || "https://img.icons8.com/color/96/code.png";
      
      md += `<td align="center" width="${colWidth}%">\n`;
      md += `<a href="${p.url}"><img src="${icon}" width="42" height="42"></a>\n<br>\n`;
      md += `<b>${p.name}</b>\n<br>\n`;
      md += `<sub>${tech}</sub>\n`;
      md += `</td>\n\n`;
    });
    
    md += `</tr>\n</table>\n\n`;
    
    if (state.profile.portfolio) {
      md += `<br>\n\n<a href="${formatUrl(state.profile.portfolio)}">\n🚀 <strong>Explore all projects →</strong>\n</a>\n\n`;
    }
    
    md += `</div>\n\n`;
    md += `---\n\n`;
  }

  // 3. Tech Stack
  if (state.techStack.enabled && (state.techStack.technologies.length > 0 || state.techStack.highlightCategory)) {
    md += `## 🛠️ Tech Stack\n\n`;
    md += `<div align="center">\n\n`;
    if (state.techStack.technologies.length > 0) {
      md += `<img src="https://skillicons.dev/icons?i=${state.techStack.technologies.join(',')}" />\n\n`;
    }
    
    if (state.techStack.highlightCategory) {
      const categories: Record<string, { label: string, items: string }> = {
        'ai': { label: '🤖 <strong>AI & LLMs</strong>', items: 'OpenAI · Claude · Gemini · Groq · RAG · AI Agents · Computer Vision' },
      };
      
      const cat = categories[state.techStack.highlightCategory];
      if (cat) {
        md += `<br><br>\n\n`;
        md += `<table width="100%">\n<tr>\n<td align="center">\n\n`;
        md += `${cat.label} &nbsp; ${cat.items}\n\n`;
        md += `</td>\n</tr>\n</table>\n\n`;
      }
    }
    
    md += `</div>\n\n`;
    md += `---\n\n`;
  }

  // 4. GitHub Activity
  if (state.githubActivity.enabled) {
    md += `## 📈 GitHub Activity\n\n`;
    md += `<div align="center">\n\n`;
    if (state.githubActivity.showStreak && state.profile.githubUsername) {
      md += `<img src="https://streak-stats.demolab.com/?user=${state.profile.githubUsername}&theme=${state.githubActivity.theme}&hide_border=true&background=00000000&ring=f97316&fire=f97316&currStreakNum=111827&sideNums=111827&currStreakLabel=555555&sideLabels=555555&dates=777777" width="650" alt="GitHub Contribution Streak"/>\n\n`;
      md += `<br>\n\n<sub>Keep building. 🚀</sub>\n\n`;
    }


    
    md += `</div>\n\n`;
    md += `---\n\n`;
  }
  
  // 5. Beyond the Code
  if (state.beyondCode && state.beyondCode.enabled) {
    md += `## 🧪 Beyond the Code\n\n`;
    md += `<div align="center">\n\n`;
    
    if (state.beyondCode.items && state.beyondCode.items.length > 0) {
      const formattedItems = state.beyondCode.items
        .filter((item: string) => item.trim())
        .map((item: string) => `**${item}**`);
      
      md += `${formattedItems.join(' &nbsp; · &nbsp; ')}\n\n`;
    }
    
    if (state.beyondCode.quote) {
      md += `<br>\n\n*${state.beyondCode.quote}*\n\n<br>\n\n`;
    }
    
    if (state.profile.portfolio) {
      md += `<a href="${formatUrl(state.profile.portfolio)}">\n🚀 <strong>Explore More →</strong>\n</a>\n\n`;
    }
    
    md += `</div>\n\n`;
  }

  return md;
}

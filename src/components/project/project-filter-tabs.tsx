"use client";

type FilterTab = "all" | "starred" | "recent" | "nearby";

type ProjectFilterTabsProps = {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
};

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "starred", label: "Starred" },
  { value: "recent", label: "Recent" },
  { value: "nearby", label: "Nearby" },
];

function ProjectFilterTabs({ activeTab, onTabChange }: ProjectFilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 -mb-2 scrollbar-hide">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === tab.value
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export type { FilterTab };
export default ProjectFilterTabs;

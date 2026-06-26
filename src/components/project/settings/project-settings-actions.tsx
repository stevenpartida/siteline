import React from "react";
import { IconEdit, IconStar, IconShare2 } from "@tabler/icons-react";

const actions = [
  { icon: IconEdit, label: "Edit" },
  { icon: IconStar, label: "Star" },
  { icon: IconShare2, label: "Share" },
];

function ProjectSettingsActions() {
  return (
    <div className="flex flex-row items-center justify-center gap-6 p-4">
      {actions.map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          <button className="flex items-center justify-center size-11 rounded-xl border border-border bg-card">
            <Icon stroke={1.5} size={20} />
          </button>
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default ProjectSettingsActions;

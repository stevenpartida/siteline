import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type EmptyStateProps = {
  icon: React.ElementType;
  title: string;
  subtext: string;
};

function EmptyState({ icon, title, subtext }: EmptyStateProps) {
  const Icon = icon;
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia className="bg-white p-4 rounded-xl border border-forground">
          <Icon size={32} stroke={1.5} className="text-forground " />
        </EmptyMedia>
        <EmptyTitle className="text-lg font-semibold text-foreground">
          {title}
        </EmptyTitle>
        <EmptyDescription className="text-muted-foreground">
          {subtext}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default EmptyState;

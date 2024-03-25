interface HeadingProps {
  title: string;
  center?: boolean;
  className?: string;
}

export const Heading = ({ title, center, className }: HeadingProps) => {
  return (
    <div className={`${center ? "text-center" : "text-start"} ${className}`}>
      <h1 className="font-bold text-2xl">{title}</h1>
    </div>
  );
};

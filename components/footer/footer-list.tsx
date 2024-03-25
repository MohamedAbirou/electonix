const FooterList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-6 flex flex-col gap-2 ${className}`}
    >
      {children}
    </div>
  );
};
export default FooterList;

const FormWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`min-h-fit h-full flex items-center justify-center pb-12 pt-24 ${className}`}
    >
      <div className="max-w-[650px] w-full flex flex-col items-center gap-6 shadow-xl shadow-sky-200 rounded-md p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;

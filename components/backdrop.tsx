interface BackdropProps {
  onClick: () => void;
}

export const Backdrop = ({ onClick }: BackdropProps) => {
  return (
    <div className="z-20 bg-slate-900 opacity-40 w-screen h-screen fixed top-0 left-0"></div>
  );
};

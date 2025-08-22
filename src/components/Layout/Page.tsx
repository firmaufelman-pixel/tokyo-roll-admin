export default function Page({ children, ...props }: any) {
  return (
    <div style={{ padding: 40, position: "relative" }} {...props}>
      {children}
    </div>
  );
}

export default function PageWrapper({ children }) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8 animate-fade-in-up min-h-[calc(100vh-4rem)]">
      {children}
    </main>
  )
}

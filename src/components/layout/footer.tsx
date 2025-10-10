export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} BumaView. All rights reserved.
          </div>

          <nav aria-label="푸터 네비게이션" className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="개인정보처리방침 페이지로 이동"
            >
              개인정보처리방침
            </a>
            <a
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="이용약관 페이지로 이동"
            >
              이용약관
            </a>
            <a
              href="/support"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="고객지원 페이지로 이동"
            >
              고객지원
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

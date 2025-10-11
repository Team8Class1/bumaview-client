export function downloadSampleCSV() {
  const headers = ["question", "categoryIds", "companyId", "questionAt"];
  const sample = [
    ["자기소개를 해주세요", "1,2", "1", "2024-01-15"],
    ["우리 회사에 지원한 이유는?", "3", "", "2024-01-20"],
    ["가장 기억에 남는 프로젝트는?", "2,3", "2", "2024-02-01"],
  ];

  const csv = [headers, ...sample].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "interview_sample.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateCSVFile(file: File): string | null {
  // 파일 확장자 검사
  if (!file.name.endsWith(".csv")) {
    return "CSV 파일만 업로드 가능합니다.";
  }

  // 파일 크기 검사 (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return "파일 크기는 10MB 이하여야 합니다.";
  }

  return null;
}

export function setPageTitle(title: string): void {
  document.title = title;
}

export function displayOverlay(show: boolean) {
  const overlay = document.querySelector(".overlay") as HTMLDivElement;
  if (show) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

export function getGroupName(group: string) {
  if (group === "CL") {
    return "Chung lớp";
  }
  return `Nhóm ${group}`;
}

// WakeUp Call — Figma 자동 스타일 세팅 플러그인

async function setup() {

  // ── 1. 페이지 생성 ──────────────────────────────────────
  const pageNames = ['00. Style Guide', '01. Home', '02. Alarm Ring', '03. Wake Complete'];

  // 첫 번째 페이지 이름 변경
  figma.root.children[0].name = pageNames[0];

  // 나머지 페이지 생성
  for (let i = 1; i < pageNames.length; i++) {
    const page = figma.createPage();
    page.name = pageNames[i];
  }

  // ── 2. 컬러 스타일 등록 ────────────────────────────────
  const colors = [
    { name: 'bg/paper',      r: 253, g: 251, b: 244 },
    { name: 'ink/dark',      r:  45, g:  45, b:  45 },
    { name: 'ink/light',     r: 140, g: 140, b: 140 },
    { name: 'point/orange',  r: 244, g: 162, b:  40 },
    { name: 'point/sky',     r: 168, g: 201, b: 240 },
    { name: 'point/green',   r: 126, g: 200, b: 164 },
  ];

  for (const c of colors) {
    const style = figma.createPaintStyle();
    style.name = c.name;
    style.paints = [{ type: 'SOLID', color: { r: c.r/255, g: c.g/255, b: c.b/255 } }];
  }

  // ── 3. Style Guide 페이지에 색상 칩 시각화 ─────────────
  const stylePage = figma.root.children[0];
  figma.currentPage = stylePage;

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  const chipW = 160, chipH = 80, gap = 20, cols = 3;
  const colorDefs = [
    { name: 'bg/paper',     hex: '#FDFBF4', r: 253, g: 251, b: 244 },
    { name: 'ink/dark',     hex: '#2D2D2D', r:  45, g:  45, b:  45 },
    { name: 'ink/light',    hex: '#8C8C8C', r: 140, g: 140, b: 140 },
    { name: 'point/orange', hex: '#F4A228', r: 244, g: 162, b:  40 },
    { name: 'point/sky',    hex: '#A8C9F0', r: 168, g: 201, b: 240 },
    { name: 'point/green',  hex: '#7EC8A4', r: 126, g: 200, b: 164 },
  ];

  // 섹션 제목
  const title = figma.createText();
  title.characters = 'WakeUp Call — Color Styles';
  title.fontSize = 24;
  title.x = 40;
  title.y = 40;
  title.fills = [{ type: 'SOLID', color: { r: 45/255, g: 45/255, b: 45/255 } }];

  // 색상 칩 생성
  colorDefs.forEach((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 40 + col * (chipW + gap);
    const y = 100 + row * (chipH + 50);

    const rect = figma.createRectangle();
    rect.x = x;
    rect.y = y;
    rect.resize(chipW, chipH);
    rect.fills = [{ type: 'SOLID', color: { r: c.r/255, g: c.g/255, b: c.b/255 } }];
    rect.strokes = [{ type: 'SOLID', color: { r: 45/255, g: 45/255, b: 45/255 } }];
    rect.strokeWeight = 1.5;
    rect.cornerRadius = 8;

    const label = figma.createText();
    label.characters = `${c.name}\n${c.hex}`;
    label.fontSize = 12;
    label.x = x;
    label.y = y + chipH + 6;
    label.fills = [{ type: 'SOLID', color: { r: 45/255, g: 45/255, b: 45/255 } }];
  });

  // ── 4. 각 화면 페이지에 기본 프레임 생성 ──────────────
  const screens = [
    { index: 1, name: '01. Home',          bg: { r: 253, g: 251, b: 244 } },
    { index: 2, name: '02. Alarm Ring',    bg: { r: 253, g: 251, b: 244 } },
    { index: 3, name: '03. Wake Complete', bg: { r: 253, g: 251, b: 244 } },
  ];

  for (const screen of screens) {
    const page = figma.root.children[screen.index];
    figma.currentPage = page;

    const frame = figma.createFrame();
    frame.name = screen.name;
    frame.resize(393, 852); // iPhone 14 Pro
    frame.fills = [{ type: 'SOLID', color: { r: screen.bg.r/255, g: screen.bg.g/255, b: screen.bg.b/255 } }];
    frame.x = 0;
    frame.y = 0;

    // 상단 타이틀 텍스트
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    const label = figma.createText();
    label.characters = screen.name;
    label.fontSize = 18;
    label.x = 24;
    label.y = 60;
    label.fills = [{ type: 'SOLID', color: { r: 45/255, g: 45/255, b: 45/255 } }];
    frame.appendChild(label);
  }

  figma.currentPage = figma.root.children[0];
  figma.notify('✅ WakeUp Call 스타일 가이드 세팅 완료! 4개 페이지 + 색상 스타일 + 프레임 생성됨');
  figma.closePlugin();
}

setup();

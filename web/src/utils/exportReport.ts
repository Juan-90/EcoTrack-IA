// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Export Utilities
//  PDF: jsPDF + jspdf-autotable
//  Excel: ExcelJS (sem vulnerabilidades)
// ─────────────────────────────────────────────────────────
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

type Period = 'diario' | 'semanal' | 'mensal';

const PERIOD_LABEL: Record<Period, string> = {
  diario:  'Diário',
  semanal: 'Semanal',
  mensal:  'Mensal',
};

function getDateRange(period: Period): string {
  const now   = new Date();
  const start = new Date();
  if (period === 'diario')  start.setDate(now.getDate() - 1);
  if (period === 'semanal') start.setDate(now.getDate() - 7);
  if (period === 'mensal')  start.setDate(now.getDate() - 30);
  const fmt = (d: Date) => d.toLocaleDateString('pt-BR');
  return `${fmt(start)} a ${fmt(now)}`;
}

// ── Exportar PDF ──────────────────────────────────────────
export function exportPDF(
  period: Period,
  data: { collections: any[]; drivers: any[]; routes: any[]; kpis: any }
) {
  const doc       = new jsPDF();
  const pageW     = doc.internal.pageSize.getWidth();
  const dateRange = getDateRange(period);
  let   y         = 20;

  // Cabeçalho
  doc.setFillColor(8, 19, 13);
  doc.rect(0, 0, pageW, 35, 'F');
  doc.setTextColor(74, 222, 128);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('EcoTrack-IA', 14, 14);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema Inteligente de Gestão de Resíduos Urbanos', 14, 22);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.text(`Relatório ${PERIOD_LABEL[period]} — ${dateRange}`, 14, 30);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageW - 14, 30, { align: 'right' });

  y = 50;
  doc.setTextColor(30, 30, 30);

  // KPIs
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(8, 19, 13);
  doc.text('Indicadores do Período', 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Indicador', 'Valor']],
    body: [
      ['Total de Coletas',      data.kpis.total_collections.toLocaleString('pt-BR')],
      ['Total Coletado (kg)',   data.kpis.total_kg.toLocaleString('pt-BR') + ' kg'  ],
      ['Km Percorridos',        data.kpis.total_km.toLocaleString('pt-BR') + ' km'  ],
      ['Eficiência Média',      data.kpis.avg_efficiency.toFixed(1) + '%'            ],
      ['Lixeiras Evitadas',     data.kpis.full_bins_avoided.toLocaleString('pt-BR')  ],
      ['Economia Estimada',     `R$ ${data.kpis.cost_saved_brl.toLocaleString('pt-BR')}`],
    ],
    styles:             { fontSize: 9, cellPadding: 4 },
    headStyles:         { fillColor: [27, 67, 50], textColor: [74, 222, 128], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 255, 248] },
    margin:             { left: 14, right: 14 },
    columnStyles:       { 0: { cellWidth: 80 }, 1: { cellWidth: 60, halign: 'right' } },
  });

  y = (doc as any).lastAutoTable.finalY + 14;

  // Performance motoristas
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(8, 19, 13);
  doc.text('Performance por Motorista', 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [['Motorista', 'Coletas', 'Km', 'Eficiência', 'No Prazo', 'Tempo Médio']],
    body: data.drivers.map(d => [
      d.name, d.collections, `${d.km} km`,
      `${d.efficiency}%`, `${d.on_time}%`, `${d.avg_min} min`,
    ]),
    styles:             { fontSize: 8, cellPadding: 3 },
    headStyles:         { fillColor: [27, 67, 50], textColor: [74, 222, 128], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 255, 248] },
    margin:             { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 14;
  if (y > 240) { doc.addPage(); y = 20; }

  // Eficiência rotas
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(8, 19, 13);
  doc.text('Eficiência das Rotas', 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [['Rota', 'Execuções', 'No Prazo', 'Paradas Médias', 'Km Médio', 'Conclusão']],
    body: data.routes.map(r => [
      r.route, r.total_runs, r.on_time,
      r.avg_stops, `${r.avg_km} km`, `${r.completion}%`,
    ]),
    styles:             { fontSize: 8, cellPadding: 3 },
    headStyles:         { fillColor: [27, 67, 50], textColor: [74, 222, 128], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 255, 248] },
    margin:             { left: 14, right: 14 },
  });

  // Rodapé
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `EcoTrack-IA — Relatório ${PERIOD_LABEL[period]} — Página ${i} de ${pageCount}`,
      pageW / 2, doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }

  doc.save(`ecotrack-relatorio-${period}-${new Date().toISOString().split('T')[0]}.pdf`);
}

// ── Exportar Excel (ExcelJS) ──────────────────────────────
export async function exportExcel(
  period: Period,
  data: { collections: any[]; drivers: any[]; routes: any[]; kpis: any }
) {
  const wb        = new ExcelJS.Workbook();
  const dateRange = getDateRange(period);
  const generated = new Date().toLocaleString('pt-BR');

  // Estilos reutilizáveis
  const headerFill: ExcelJS.Fill = {
    type: 'pattern', pattern: 'solid',
    fgColor: { argb: 'FF1B4332' },
  };
  const headerFont: Partial<ExcelJS.Font> = {
    bold: true, color: { argb: 'FF4ADE80' }, size: 10,
  };
  const altFill: ExcelJS.Fill = {
    type: 'pattern', pattern: 'solid',
    fgColor: { argb: 'FFF5FFF8' },
  };
  const titleFont: Partial<ExcelJS.Font> = {
    bold: true, size: 12, color: { argb: 'FF08130D' },
  };

  function styleHeader(row: ExcelJS.Row) {
    row.eachCell(cell => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FF2D6A4F' } },
      };
    });
    row.height = 22;
  }

  function styleDataRows(ws: ExcelJS.Worksheet, startRow: number) {
    for (let i = startRow; i <= ws.rowCount; i++) {
      const row = ws.getRow(i);
      if (i % 2 === 0) {
        row.eachCell(cell => { cell.fill = altFill; });
      }
      row.eachCell(cell => {
        cell.alignment = { vertical: 'middle' };
      });
    }
  }

  // ── Aba 1: Resumo ──────────────────────────────────────
  const wsResumo = wb.addWorksheet('Resumo');
  wsResumo.columns = [
    { width: 30 }, { width: 25 },
  ];

  wsResumo.addRow(['EcoTrack-IA — Relatório ' + PERIOD_LABEL[period]]).font = { bold: true, size: 14, color: { argb: 'FF08130D' } };
  wsResumo.addRow(['Período:', dateRange]);
  wsResumo.addRow(['Gerado em:', generated]);
  wsResumo.addRow([]);
  const resumoTitle = wsResumo.addRow(['INDICADORES DO PERÍODO', '']);
  resumoTitle.font = titleFont;
  wsResumo.addRow([]);

  const kpiHeader = wsResumo.addRow(['Indicador', 'Valor']);
  styleHeader(kpiHeader);

  [
    ['Total de Coletas',      data.kpis.total_collections],
    ['Total Coletado (kg)',   data.kpis.total_kg          ],
    ['Km Percorridos',        data.kpis.total_km          ],
    ['Eficiência Média (%)',  data.kpis.avg_efficiency    ],
    ['Lixeiras Evitadas',     data.kpis.full_bins_avoided ],
    ['Economia Estimada (R$)',data.kpis.cost_saved_brl    ],
  ].forEach(row => wsResumo.addRow(row));

  styleDataRows(wsResumo, 8);

  // ── Aba 2: Coletas por Dia ─────────────────────────────
  const wsColetas = wb.addWorksheet('Coletas por Dia');
  wsColetas.columns = [
    { key: 'label',       header: 'Data',    width: 12 },
    { key: 'total',       header: 'Total',   width: 10 },
    { key: 'zona_centro', header: 'Centro',  width: 10 },
    { key: 'zona_norte',  header: 'Norte',   width: 10 },
    { key: 'zona_sul',    header: 'Sul',     width: 10 },
    { key: 'zona_leste',  header: 'Leste',   width: 10 },
    { key: 'zona_oeste',  header: 'Oeste',   width: 10 },
    { key: 'kg_total',    header: 'Kg Total',width: 12 },
  ];

  styleHeader(wsColetas.getRow(1));
  data.collections.forEach(c => wsColetas.addRow(c));
  styleDataRows(wsColetas, 2);

  // ── Aba 3: Performance Motoristas ─────────────────────
  const wsDrivers = wb.addWorksheet('Performance Motoristas');
  wsDrivers.columns = [
    { key: 'name',        header: 'Motorista',       width: 22 },
    { key: 'collections', header: 'Coletas',          width: 12 },
    { key: 'km',          header: 'Km Rodados',       width: 14 },
    { key: 'efficiency',  header: 'Eficiência (%)',   width: 16 },
    { key: 'on_time',     header: 'No Prazo (%)',     width: 14 },
    { key: 'avg_min',     header: 'Tempo Médio (min)',width: 18 },
  ];

  styleHeader(wsDrivers.getRow(1));
  data.drivers.forEach(d => wsDrivers.addRow(d));
  styleDataRows(wsDrivers, 2);

  // ── Aba 4: Eficiência Rotas ────────────────────────────
  const wsRoutes = wb.addWorksheet('Eficiência Rotas');
  wsRoutes.columns = [
    { key: 'route',       header: 'Rota',             width: 24 },
    { key: 'total_runs',  header: 'Execuções',         width: 12 },
    { key: 'on_time',     header: 'No Prazo',          width: 12 },
    { key: 'avg_stops',   header: 'Paradas Médias',   width: 16 },
    { key: 'avg_km',      header: 'Km Médio',          width: 12 },
    { key: 'completion',  header: 'Conclusão (%)',     width: 14 },
  ];

  styleHeader(wsRoutes.getRow(1));
  data.routes.forEach(r => wsRoutes.addRow(r));
  styleDataRows(wsRoutes, 2);

  // ── Download ───────────────────────────────────────────
  const buffer   = await wb.xlsx.writeBuffer();
  const blob     = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url      = URL.createObjectURL(blob);
  const link     = document.createElement('a');
  link.href      = url;
  link.download  = `ecotrack-relatorio-${period}-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-container">
      <h1>Продажи</h1>
      <div class="chart-container">
        <h2>Выручка за неделю</h2>
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `,
  styles: [`
    .view-container {
      padding: 24px;
    }
    h1 {
      font-size: 24px;
      font-weight: 500;
      margin: 0 0 24px 0;
      color: rgba(0, 0, 0, 0.87);
    }
    h2 {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 16px 0;
      color: rgba(0, 0, 0, 0.87);
    }
    .chart-container {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      height: 33vh;
      min-height: 350px;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  `]
})
export class SalesComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.drawChart();
  }

  private drawChart(): void {
    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const forecastData = [145000, 152000, 148000, 165000, 170000, 195000, 180000];
    const actualData = [142000, 155000, 151000, 163000, 168000, 198000, 175000];

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    ctx.scale(dpr, dpr);

    const padding = { top: 60, right: 40, bottom: 50, left: 80 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    const maxValue = Math.max(...forecastData, ...actualData);
    const roundedMax = Math.ceil(maxValue / 50000) * 50000;

    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';

    const groupWidth = chartWidth / weekDays.length;
    weekDays.forEach((day, i) => {
      const x = padding.left + (i * groupWidth) + (groupWidth / 2);
      ctx.fillText(day, x, padding.top + chartHeight + 30);
    });

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
      const value = (roundedMax / 5) * i;
      const y = padding.top + chartHeight - (i * chartHeight) / 5;
      ctx.fillText((value / 1000).toFixed(0) + 'k ₽', padding.left - 10, y);

      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    }

    this.drawLine(ctx, forecastData, weekDays.length, chartWidth, chartHeight, roundedMax, padding, '#1976d2');
    this.drawLine(ctx, actualData, weekDays.length, chartWidth, chartHeight, roundedMax, padding, '#388e3c');

    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(padding.left, 20, 16, 16);
    ctx.fillStyle = '#333';
    ctx.fillText('Прогнозируемая выручка', padding.left + 24, 28);

    ctx.fillStyle = '#388e3c';
    ctx.fillRect(padding.left + 220, 20, 16, 16);
    ctx.fillStyle = '#333';
    ctx.fillText('Фактическая выручка', padding.left + 244, 28);
  }

  private drawLine(
    ctx: CanvasRenderingContext2D,
    data: number[],
    pointsCount: number,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
    padding: any,
    color: string
  ): void {
    const barWidth = (chartWidth / pointsCount) * 0.3;
    const groupWidth = chartWidth / pointsCount;
    const offset = color === '#1976d2' ? -barWidth / 2 : barWidth / 2;

    ctx.fillStyle = color;

    data.forEach((value, i) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding.left + (i * groupWidth) + (groupWidth / 2) - (barWidth / 2) + offset;
      const y = padding.top + chartHeight - barHeight;

      ctx.fillRect(x, y, barWidth, barHeight);
    });
  }
}
